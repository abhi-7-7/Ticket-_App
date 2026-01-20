import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

const router = express.Router();

// Helper: parse dates and ensure checkIn < checkOut
function parseDates(checkInRaw, checkOutRaw) {
  const checkIn = new Date(checkInRaw);
  const checkOut = new Date(checkOutRaw);
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) return null;
  if (checkIn >= checkOut) return null;
  return { checkIn, checkOut };
}

// POST /api/bookings
// Body: { hotelId, roomNumber, checkIn, checkOut, userId? }
router.post('/', async (req, res) => {
  const { hotelId, roomNumber, checkIn: ci, checkOut: co, userId: userIdBody } = req.body || {};

  if (!hotelId || !roomNumber || !ci || !co) {
    return res.status(400).json({ error: 'hotelId, roomNumber, checkIn and checkOut are required' });
  }

  const dates = parseDates(ci, co);
  if (!dates) return res.status(400).json({ error: 'invalid checkIn/checkOut dates' });

  const { checkIn, checkOut } = dates;

  // Determine user: prefer authenticated user if present, otherwise require userId in body
  const userId = (req.user && req.user._id) || userIdBody;
  if (!userId) return res.status(400).json({ error: 'userId is required when not authenticated' });

  try {
    // Verify user exists
    const user = await User.findById(userId).exec();
    if (!user) throw new Error('user not found');

    // Load hotel and room
    const hotel = await Hotel.findById(hotelId).exec();
    if (!hotel) throw new Error('hotel not found');

    const room = hotel.rooms.find((r) => String(r.number) === String(roomNumber));
    if (!room) throw new Error('room not found in hotel');

    // Check overlapping bookings for the same hotel & room
    const conflict = await Booking.findOne({
      hotel: hotel._id,
      'room.number': room.number,
      status: { $ne: 'cancelled' },
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    }).exec();

    if (conflict) {
      return res.status(409).json({ error: 'room not available for requested dates' });
    }

    // Compute pricing snapshot
    const nightlyRate = room.price || hotel.basePrice || 0;
    const msPerNight = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkOut - checkIn) / msPerNight);
    const totalPrice = nightlyRate * nights;

    // Create booking document
    const booking = new Booking({
      user: user._id,
      hotel: hotel._id,
      room: { number: room.number, type: room.type, price: room.price },
      checkIn,
      checkOut,
      nightlyRate,
      nights,
      totalPrice,
      status: 'confirmed',
      payment: { paid: false },
    });

    await booking.save();

    // Update hotel: push booking id into room.bookings and hotel.customers
    const roomIndex = hotel.rooms.findIndex((r) => String(r.number) === String(roomNumber));
    if (roomIndex !== -1) {
      hotel.rooms[roomIndex].bookings = hotel.rooms[roomIndex].bookings || [];
      hotel.rooms[roomIndex].bookings.push(booking._id);
    }

    hotel.customers = hotel.customers || [];
    hotel.customers.push(booking._id);

    await hotel.save();

    return res.status(201).json({ booking });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ error: 'failed to create booking', details: err.message });
  }
});

// DELETE /api/bookings/:id
// Marks booking as cancelled and removes references from Hotel.rooms[].bookings and Hotel.customers
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'booking id required' });

  try {
    const booking = await Booking.findById(id).exec();
    if (!booking) {
      return res.status(404).json({ error: 'booking not found' });
    }

    // mark cancelled
    booking.status = 'cancelled';
    await booking.save();

    // remove references from hotel
    const hotel = await Hotel.findById(booking.hotel).exec();
    if (hotel) {
      // remove from hotel.customers
      if (Array.isArray(hotel.customers)) {
        hotel.customers = hotel.customers.filter((bId) => String(bId) !== String(booking._id));
      }

      // remove from room bookings arrays
      hotel.rooms = hotel.rooms.map((r) => {
        if (Array.isArray(r.bookings)) {
          r.bookings = r.bookings.filter((bId) => String(bId) !== String(booking._id));
        }
        return r;
      });

      await hotel.save();
    }

    return res.json({ message: 'booking cancelled', booking });
  } catch (err) {
    console.error('Cancel booking error:', err);
    return res.status(500).json({ error: 'failed to cancel booking', details: err.message });
  }
});

// GET /api/bookings
// If authenticated, returns bookings for req.user. Otherwise allow ?userId= for testing.
// Populates hotel name/city and returns room number, dates, status and pricing.
router.get('/', async (req, res) => {
  try {
    const userId = (req.user && req.user._id) || req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId required (or authenticate)' });

    const bookings = await Booking.find({ user: userId })
      .populate({ path: 'hotel', select: 'name city' })
      .select('hotel room checkIn checkOut status totalPrice createdAt updatedAt')
      .lean()
      .exec();

    const result = bookings.map((b) => ({
      id: b._id,
      hotel: b.hotel ? { id: b.hotel._id, name: b.hotel.name, city: b.hotel.city } : null,
      roomNumber: b.room?.number || null,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      status: b.status,
      totalPrice: b.totalPrice,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    return res.json({ count: result.length, bookings: result });
  } catch (err) {
    return res.status(500).json({ error: 'failed to list bookings', details: err.message });
  }
});

export default router;

// Manager endpoints (no role enforcement yet)
// POST /api/manager/check-in/:bookingId
// Marks booking as checked_in and sets hotel room isAvailable=false
router.post('/manager/check-in/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) return res.status(400).json({ error: 'bookingId required' });

  const session = await mongoose.startSession();
  try {
    let updated = null;
    await session.withTransaction(async () => {
      const booking = await Booking.findById(bookingId).session(session).exec();
      if (!booking) throw new Error('booking not found');
      if (booking.status === 'cancelled') throw new Error('cannot check-in a cancelled booking');
      if (booking.status === 'checked_in' || booking.status === 'completed') throw new Error('booking already checked-in or completed');

      const hotel = await Hotel.findById(booking.hotel).session(session).exec();
      if (!hotel) throw new Error('hotel not found for booking');

      // find room in hotel by number
      const roomIndex = hotel.rooms.findIndex((r) => String(r.number) === String(booking.room.number));
      if (roomIndex === -1) throw new Error('room not found in hotel');

      // toggle availability
      hotel.rooms[roomIndex].isAvailable = false;
      await hotel.save({ session });

      booking.status = 'checked_in';
      await booking.save({ session });

      updated = booking;
    });

    return res.json({ booking: updated });
  } catch (err) {
    if (err.message === 'booking not found') return res.status(404).json({ error: err.message });
    return res.status(500).json({ error: 'failed to check-in booking', details: err.message });
  } finally {
    session.endSession();
  }
});

// POST /api/manager/check-out/:bookingId
// Marks booking as completed and sets hotel room isAvailable=true
router.post('/manager/check-out/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId) return res.status(400).json({ error: 'bookingId required' });

  const session = await mongoose.startSession();
  try {
    let updated = null;
    await session.withTransaction(async () => {
      const booking = await Booking.findById(bookingId).session(session).exec();
      if (!booking) throw new Error('booking not found');
      if (booking.status === 'cancelled') throw new Error('cannot check-out a cancelled booking');
      if (booking.status !== 'checked_in') throw new Error('only checked-in bookings can be checked-out');

      const hotel = await Hotel.findById(booking.hotel).session(session).exec();
      if (!hotel) throw new Error('hotel not found for booking');

      const roomIndex = hotel.rooms.findIndex((r) => String(r.number) === String(booking.room.number));
      if (roomIndex === -1) throw new Error('room not found in hotel');

      // toggle availability back to true
      hotel.rooms[roomIndex].isAvailable = true;
      await hotel.save({ session });

      booking.status = 'completed';
      await booking.save({ session });

      updated = booking;
    });

    return res.json({ booking: updated });
  } catch (err) {
    if (err.message === 'booking not found') return res.status(404).json({ error: err.message });
    return res.status(500).json({ error: 'failed to check-out booking', details: err.message });
  } finally {
    session.endSession();
  }
});

// GET /api/manager/bookings
// Read-only: returns bookings grouped by hotel. Optional filters: ?status=&hotelId=
router.get('/manager/bookings', async (req, res) => {
  try {
    const { status, hotelId } = req.query || {};

    const query = {};
    if (status) query.status = status;
    if (hotelId) query.hotel = hotelId;

    const bookings = await Booking.find(query)
      .populate({ path: 'hotel', select: 'name city' })
      .populate({ path: 'user', select: 'username email' })
      .select('hotel user room checkIn checkOut status totalPrice createdAt updatedAt')
      .lean()
      .exec();

    // group by hotel
    const groupsMap = new Map();
    for (const b of bookings) {
      const h = b.hotel || { _id: null, name: 'Unknown', city: null };
      const key = String(h._id);
      if (!groupsMap.has(key)) {
        groupsMap.set(key, { hotel: { id: h._id, name: h.name, city: h.city }, bookings: [] });
      }

      groupsMap.get(key).bookings.push({
        id: b._id,
        user: b.user ? { id: b.user._id, username: b.user.username, email: b.user.email } : null,
        roomNumber: b.room?.number || null,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        status: b.status,
        totalPrice: b.totalPrice,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      });
    }

    const grouped = Array.from(groupsMap.values());
    return res.json({ count: bookings.length, grouped });
  } catch (err) {
    return res.status(500).json({ error: 'failed to list manager bookings', details: err.message });
  }
});


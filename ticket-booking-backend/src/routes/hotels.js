import express from 'express';
import Hotel from '../models/Hotel.js';

const router = express.Router();

// GET /api/hotels
// Optional query: ?city=CityName&limit=10&skip=0
router.get('/', async (req, res) => {
  try {
    const { city, limit = 20, skip = 0 } = req.query;
    const q = {};
    if (city) q.city = city;

    // Get total count
    const total = await Hotel.countDocuments(q);

    // Get paginated hotels
    const hotels = await Hotel.find(q)
      .select('name city address basePrice rooms rating amenities images')
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10))
      .lean()
      .exec();

    const result = hotels.map(h => ({
      id: h._id,
      ...h
    }));

    // Calculate pagination metadata
    const page = Math.floor(parseInt(skip, 10) / parseInt(limit, 10)) + 1;
    const pages = Math.ceil(total / parseInt(limit, 10));

    return res.json({
      count: result.length,
      data: result,
      hotels: result, // Keep for backwards compatibility
      pagination: {
        total,
        limit: parseInt(limit, 10),
        skip: parseInt(skip, 10),
        page,
        pages
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'failed to list hotels', details: err.message });
  }
});

// GET /api/hotels/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id).lean().exec();
    if (!hotel) return res.status(404).json({ error: 'hotel not found' });
    return res.json({
      id: hotel._id,
      _id: hotel._id,
      ...hotel
    });
  } catch (err) {
    return res.status(500).json({ error: 'failed to fetch hotel', details: err.message });
  }
});

// POST /api/hotels
// Body: { name, city, address?, description?, basePrice?, rooms? }
// Validation: name and city are required. Either rooms (non-empty) OR basePrice must be provided.
router.post('/', async (req, res) => {
  try {
    const { name, city, address, description, basePrice, rooms, managerNotes } = req.body || {};

    if (!name || !city) {
      return res.status(400).json({ error: 'name and city are required' });
    }

    const hasRooms = Array.isArray(rooms) && rooms.length > 0;
    const hasBasePrice = typeof basePrice === 'number' && !Number.isNaN(basePrice);
    if (!hasRooms && !hasBasePrice) {
      return res.status(400).json({ error: 'either rooms (non-empty) or basePrice must be provided' });
    }

    const hotelData = { name, city, address, description, basePrice, rooms, managerNotes };
    const hotel = new Hotel(hotelData);
    await hotel.save();

    return res.status(201).json(hotel);
  } catch (err) {
    return res.status(500).json({ error: 'failed to create hotel', details: err.message });
  }
});

export default router;

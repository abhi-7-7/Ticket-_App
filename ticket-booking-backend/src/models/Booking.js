import mongoose from 'mongoose';

const { Schema } = mongoose;

// Snapshot of room details at booking time
const RoomSnapshotSchema = new Schema(
  {
    number: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const BookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
    room: { type: RoomSnapshotSchema, required: true },

    // booking period
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    // pricing snapshot
    nightlyRate: { type: Number, required: true },
    nights: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    // status lifecycle: pending -> confirmed -> checked_in -> completed | cancelled
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },

    // payment snapshot / placeholder
    payment: {
      method: { type: String },
      paid: { type: Boolean, default: false },
      transactionId: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// compound index for common queries
BookingSchema.index({ hotel: 1, 'room.number': 1, checkIn: 1, checkOut: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

export default Booking;

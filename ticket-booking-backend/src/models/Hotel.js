import mongoose from 'mongoose';

const { Schema } = mongoose;

// Room subdocument - extensible for different room types and availability
const RoomSchema = new Schema(
  {
    number: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    amenities: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    // optional reference to booking records when bookings are created
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  },
  { _id: false }
);

const HotelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, index: true, trim: true },
    address: { type: String, required: false, trim: true },
    description: { type: String },
    // Image URLs for hotel photos
    images: [{ type: String }],
    // Hotel rating out of 5
    rating: { type: Number, min: 0, max: 5, default: 0 },
    // Hotel-level amenities
    amenities: [{ type: String }],
    // base price useful for simple listings; room-level price is authoritative
    basePrice: { type: Number, required: false },
    rooms: { type: [RoomSchema], default: [] },
    // customers will reference Booking documents (created in booking flow)
    customers: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    // metadata for admin/manager flows
    managerNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite issues in hot-reload / serverless environments
const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);

export default Hotel;

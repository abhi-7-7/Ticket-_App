import mongoose from 'mongoose';
import Hotel from './src/models/Hotel.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleHotels = [
  {
    name: "Grand Plaza Hotel",
    city: "New York",
    address: "123 Fifth Avenue, Manhattan, NY 10001",
    description: "Experience luxury in the heart of Manhattan. Our grand hotel offers world-class amenities, stunning views of the city skyline, and impeccable service. Perfect for business travelers and tourists alike.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"
    ],
    rating: 4.5,
    amenities: ["Free WiFi", "Swimming Pool", "Gym", "Restaurant", "Bar", "Room Service", "Spa", "Valet Parking"],
    basePrice: 250,
    rooms: [
      { number: "101", type: "Standard King", price: 250, amenities: ["WiFi", "TV", "AC", "Mini Fridge"], isAvailable: true },
      { number: "102", type: "Standard Queen", price: 230, amenities: ["WiFi", "TV", "AC", "Mini Fridge"], isAvailable: true },
      { number: "201", type: "Deluxe King", price: 350, amenities: ["WiFi", "TV", "AC", "Mini Bar", "Coffee Maker", "City View"], isAvailable: true },
      { number: "202", type: "Deluxe Suite", price: 450, amenities: ["WiFi", "TV", "AC", "Mini Bar", "Coffee Maker", "Living Room", "Balcony"], isAvailable: true },
      { number: "301", type: "Executive Suite", price: 650, amenities: ["WiFi", "TV", "AC", "Mini Bar", "Kitchen", "Living Room", "Balcony", "Skyline View"], isAvailable: true }
    ]
  },
  {
    name: "Sunset Beach Resort",
    city: "Miami",
    address: "456 Ocean Drive, Miami Beach, FL 33139",
    description: "Wake up to breathtaking ocean views at our beachfront resort. Enjoy white sandy beaches, crystal clear waters, and world-class dining. Your perfect tropical getaway awaits.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800"
    ],
    rating: 4.8,
    amenities: ["Beach Access", "Free WiFi", "Infinity Pool", "Beach Bar", "Water Sports", "Spa", "Restaurant", "Concierge"],
    basePrice: 320,
    rooms: [
      { number: "A101", type: "Ocean View Double", price: 320, amenities: ["WiFi", "TV", "AC", "Balcony", "Ocean View"], isAvailable: true },
      { number: "A102", type: "Ocean View King", price: 380, amenities: ["WiFi", "TV", "AC", "Balcony", "Ocean View", "Mini Bar"], isAvailable: true },
      { number: "B201", type: "Beachfront Suite", price: 550, amenities: ["WiFi", "TV", "AC", "Balcony", "Ocean View", "Mini Bar", "Living Room", "Direct Beach Access"], isAvailable: true },
      { number: "B202", type: "Premium Beachfront", price: 680, amenities: ["WiFi", "TV", "AC", "Private Balcony", "Ocean View", "Mini Bar", "Kitchen", "Living Room"], isAvailable: true }
    ]
  },
  {
    name: "Mountain View Lodge",
    city: "Denver",
    address: "789 Rocky Mountain Road, Denver, CO 80202",
    description: "Escape to the mountains at our cozy lodge surrounded by nature. Perfect for hiking enthusiasts, ski lovers, and anyone seeking peace and tranquility in the great outdoors.",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800"
    ],
    rating: 4.6,
    amenities: ["Free WiFi", "Fireplace Lounge", "Hiking Trails", "Ski Storage", "Restaurant", "Hot Tub", "Mountain Views", "Parking"],
    basePrice: 180,
    rooms: [
      { number: "1", type: "Standard Mountain View", price: 180, amenities: ["WiFi", "TV", "Fireplace", "Mountain View"], isAvailable: true },
      { number: "2", type: "Deluxe Cabin", price: 240, amenities: ["WiFi", "TV", "Fireplace", "Mountain View", "Kitchen", "Balcony"], isAvailable: true },
      { number: "3", type: "Family Suite", price: 320, amenities: ["WiFi", "TV", "Fireplace", "Mountain View", "Kitchen", "2 Bedrooms", "Living Room"], isAvailable: true },
      { number: "4", type: "Luxury Lodge", price: 450, amenities: ["WiFi", "TV", "Fireplace", "Mountain View", "Full Kitchen", "2 Bedrooms", "Living Room", "Private Hot Tub"], isAvailable: true }
    ]
  },
  {
    name: "Downtown Business Hotel",
    city: "Chicago",
    address: "321 Michigan Avenue, Chicago, IL 60601",
    description: "Ideal for business travelers and city explorers. Located in the heart of downtown with easy access to major attractions, shopping districts, and business centers.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1594741158704-5a784b8e59fb?w=800",
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800"
    ],
    rating: 4.3,
    amenities: ["Free WiFi", "Business Center", "Gym", "Restaurant", "Bar", "Meeting Rooms", "Laundry Service", "Airport Shuttle"],
    basePrice: 200,
    rooms: [
      { number: "501", type: "Business Standard", price: 200, amenities: ["WiFi", "TV", "AC", "Work Desk", "Coffee Maker"], isAvailable: true },
      { number: "502", type: "Business Deluxe", price: 260, amenities: ["WiFi", "TV", "AC", "Work Desk", "Coffee Maker", "Mini Bar", "City View"], isAvailable: true },
      { number: "601", type: "Executive King", price: 340, amenities: ["WiFi", "TV", "AC", "Work Desk", "Coffee Maker", "Mini Bar", "Living Area", "City View"], isAvailable: true },
      { number: "701", type: "Presidential Suite", price: 800, amenities: ["WiFi", "TV", "AC", "Work Desk", "Kitchen", "Dining Room", "Living Room", "2 Bedrooms", "Panoramic View"], isAvailable: true }
    ]
  },
  {
    name: "Historic Garden Inn",
    city: "Charleston",
    address: "567 Rainbow Row, Charleston, SC 29401",
    description: "Step back in time at our beautifully restored historic inn. Featuring charming gardens, antique furnishings, and Southern hospitality that will make you feel right at home.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"
    ],
    rating: 4.7,
    amenities: ["Free WiFi", "Garden", "Complimentary Breakfast", "Historic Tours", "Library", "Courtyard", "Bike Rentals", "Parking"],
    basePrice: 150,
    rooms: [
      { number: "Rose", type: "Garden View", price: 150, amenities: ["WiFi", "TV", "AC", "Garden View", "Antique Furnishings"], isAvailable: true },
      { number: "Magnolia", type: "Deluxe Garden", price: 190, amenities: ["WiFi", "TV", "AC", "Garden View", "Antique Furnishings", "Private Patio"], isAvailable: true },
      { number: "Jasmine", type: "Historic Suite", price: 280, amenities: ["WiFi", "TV", "AC", "Garden View", "Antique Furnishings", "Sitting Room", "Fireplace"], isAvailable: true }
    ]
  },
  {
    name: "Tech Hub Hotel",
    city: "San Francisco",
    address: "888 Market Street, San Francisco, CA 94102",
    description: "Modern hotel designed for the tech-savvy traveler. Smart rooms, high-speed internet, and cutting-edge amenities in the heart of Silicon Valley's gateway.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
    ],
    rating: 4.4,
    amenities: ["High-Speed WiFi", "Smart Rooms", "Rooftop Bar", "Gym", "Co-working Space", "Restaurant", "EV Charging", "Tech Support"],
    basePrice: 280,
    rooms: [
      { number: "T101", type: "Smart Standard", price: 280, amenities: ["Ultra-Fast WiFi", "Smart TV", "AC", "Voice Control", "USB-C Charging"], isAvailable: true },
      { number: "T201", type: "Tech Suite", price: 380, amenities: ["Ultra-Fast WiFi", "Smart TV", "AC", "Voice Control", "USB-C Charging", "Work Station", "Video Conferencing"], isAvailable: true },
      { number: "T301", type: "Innovation Suite", price: 520, amenities: ["Ultra-Fast WiFi", "Smart TV", "AC", "Voice Control", "USB-C Charging", "Standing Desk", "Video Conferencing", "Living Room"], isAvailable: true }
    ]
  }
];

async function seedHotels() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-booking');
    console.log('✅ Connected to MongoDB');

    // Clear existing hotels (optional - comment out if you want to keep existing data)
    await Hotel.deleteMany({});
    console.log('🗑️  Cleared existing hotels');

    // Insert sample hotels
    const insertedHotels = await Hotel.insertMany(sampleHotels);
    console.log(`✅ Successfully inserted ${insertedHotels.length} hotels`);

    // Display summary
    console.log('\n📊 Hotel Summary:');
    insertedHotels.forEach(hotel => {
      console.log(`  - ${hotel.name} (${hotel.city}): ${hotel.rooms.length} rooms, Rating: ${hotel.rating}⭐`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedHotels();

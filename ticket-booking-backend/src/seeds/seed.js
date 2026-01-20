import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Blog from '../models/Blog.js';
import Booking from '../models/Booking.js';
import hotelsData from './hotels.data.js';
import blogsData from './blogs.data.js';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ticket-booking');
    console.log('✅ MongoDB Connected for Seeding');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

// ========== SEED DATA ==========

// 1️⃣ USERS SEED DATA (8 users with different roles)
const usersData = [
  {
    username: 'admin',
    email: 'admin@ticketbooking.com',
    password: 'admin123', // Will be hashed
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
  },
  {
    username: 'bob_wilson',
    email: 'bob@example.com',
    password: 'password123',
  },
  {
    username: 'alice_brown',
    email: 'alice@example.com',
    password: 'password123',
  },
  {
    username: 'manager_mumbai',
    email: 'manager.mumbai@ticketbooking.com',
    password: 'manager123',
  },
  {
    username: 'manager_delhi',
    email: 'manager.delhi@ticketbooking.com',
    password: 'manager123',
  },
  {
    username: 'test_user',
    email: 'test@example.com',
    password: 'test123',
  },
];

// 2️⃣ HOTELS SEED DATA (70 hotels imported from modular data file)
// Hotels are imported from ./hotels.data.js as hotelsData

// 3️⃣ BLOGS SEED DATA (40 blogs imported from modular data file)
// Blogs are imported from ./blogs.data.js as blogsData

// ========== SEEDING FUNCTIONS ==========

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Hash passwords before saving
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const users = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Seeded ${users.length} users`);
    return users;
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    throw err;
  }
};

const seedHotels = async () => {
  try {
    await Hotel.deleteMany({});
    console.log('🗑️  Cleared existing hotels');

    const hotels = await Hotel.insertMany(hotelsData);
    console.log(`✅ Seeded ${hotels.length} hotels with ${hotels.reduce((acc, h) => acc + h.rooms.length, 0)} total rooms`);
    return hotels;
  } catch (err) {
    console.error('❌ Error seeding hotels:', err);
    throw err;
  }
};

const seedBlogs = async (users) => {
  try {
    await Blog.deleteMany({});
    console.log('🗑️  Cleared existing blogs');

    // Assign random authors to blogs
    const blogsWithAuthors = blogsData.map((blog, index) => ({
      ...blog,
      author: users[index % users.length]._id, // Cycle through users
    }));

    const blogs = await Blog.insertMany(blogsWithAuthors);
    console.log(`✅ Seeded ${blogs.length} blogs`);
    return blogs;
  } catch (err) {
    console.error('❌ Error seeding blogs:', err);
    throw err;
  }
};

const seedBookings = async (users, hotels) => {
  try {
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing bookings');

    const bookingsData = [];
    const statuses = ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'];

    // Create 20 sample bookings
    for (let i = 0; i < 20; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const hotel = hotels[Math.floor(Math.random() * hotels.length)];
      const room = hotel.rooms[Math.floor(Math.random() * hotel.rooms.length)];

      // Random dates in past/future
      const daysOffset = Math.floor(Math.random() * 60) - 30; // -30 to +30 days
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + daysOffset);
      
      const nights = Math.floor(Math.random() * 5) + 1; // 1-5 nights
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + nights);

      const totalPrice = room.price * nights;

      bookingsData.push({
        user: user._id,
        hotel: hotel._id,
        room: {
          number: room.number,
          type: room.type,
          price: room.price,
        },
        checkIn,
        checkOut,
        nightlyRate: room.price,
        nights,
        totalPrice,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        payment: {
          method: Math.random() > 0.5 ? 'Credit Card' : 'UPI',
          paid: Math.random() > 0.3, // 70% paid
          transactionId: `TXN${Date.now()}${i}`,
        },
      });
    }

    const bookings = await Booking.insertMany(bookingsData);
    console.log(`✅ Seeded ${bookings.length} bookings`);
    return bookings;
  } catch (err) {
    console.error('❌ Error seeding bookings:', err);
    throw err;
  }
};

// ========== MAIN SEED FUNCTION ==========

const seedDatabase = async () => {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    await connectDB();

    const users = await seedUsers();
    const hotels = await seedHotels();
    const blogs = await seedBlogs(users);
    const bookings = await seedBookings(users, hotels);

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Hotels: ${hotels.length}`);
    console.log(`   - Rooms: ${hotels.reduce((acc, h) => acc + h.rooms.length, 0)}`);
    console.log(`   - Blogs: ${blogs.length}`);
    console.log(`   - Bookings: ${bookings.length}`);
    console.log('\n🔑 Test Credentials:');
    console.log('   - Admin: admin / admin123');
    console.log('   - User: john_doe / password123');
    console.log('   - Manager: manager_mumbai / manager123');
    console.log('\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();

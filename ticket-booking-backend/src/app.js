import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import methodOverride from 'method-override';
import session from 'express-session';
import passport from './config/passport.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Basic middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// CORS: allow frontend to communicate (adjust origin in env for production)
// CORS: allow frontend to communicate (adjust origin in env for production)
app.use(cors({ origin: true, credentials: true }));

// Session configuration
// Session secret is read from environment; provide a default for dev but
// require a proper secret in production via `.env`.
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret';

app.use(
  session({
    name: 'ticket.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Initialize Passport (no routes here)
app.use(passport.initialize());
app.use(passport.session());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ticket Booking & Blogging API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      hotels: '/api/hotels',
      bookings: '/api/bookings',
      blogs: '/api/blogs'
    }
  });
});

// Health check route - returns JSON only
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount auth routes
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);

import hotelsRoutes from './routes/hotels.js';
app.use('/api/hotels', hotelsRoutes);

import bookingsRoutes from './routes/bookings.js';
app.use('/api/bookings', bookingsRoutes);

import blogsRoutes from './routes/blogs.js';
app.use('/api/blogs', blogsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'endpoint not found' });
});

export default app;

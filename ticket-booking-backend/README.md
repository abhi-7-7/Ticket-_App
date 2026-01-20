# Backend API Server

Express.js REST API server for the Ticket Booking System.

## 📁 Folder Structure

```
src/
├── middleware/              # Custom middleware
│   ├── auth.middleware.js       # Authentication checks
│   ├── error.middleware.js      # Error handling
│   ├── validation.middleware.js # Request validation
│   └── index.js                 # Middleware exports
│
├── config/                  # Configuration files
│   ├── db.js                    # MongoDB connection
│   └── passport.js              # Passport authentication setup
│
├── models/                  # Mongoose schemas
│   ├── User.js                  # User model
│   ├── Hotel.js                 # Hotel model
│   ├── Booking.js               # Booking model
│   └── Blog.js                  # Blog model
│
├── routes/                  # API route handlers
│   ├── auth.js                  # Authentication routes
│   ├── hotels.js                # Hotel CRUD routes
│   ├── bookings.js              # Booking management routes
│   └── blogs.js                 # Blog CRUD routes
│
├── utils/                   # Utility functions
│   └── hash.js                  # Password hashing utilities
│
├── app.js                   # Express app configuration
└── server.js                # Server entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/session` - Check authentication status

### Hotels
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create hotel (admin)
- `PATCH /api/hotels/:id` - Update hotel (admin)
- `DELETE /api/hotels/:id` - Delete hotel (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/manager/bookings` - Get all bookings (manager)
- `PATCH /api/manager/bookings/:id/checkin` - Check-in guest
- `PATCH /api/manager/bookings/:id/checkout` - Check-out guest

### Blogs
- `GET /api/blogs` - List all blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (admin)
- `PATCH /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)

## 🚀 Running the Server

### Development Mode
```bash
npm run dev  # Uses nodemon for auto-reload
```

### Production Mode
```bash
npm start
```

## 🧪 Testing

### Test API Endpoints
```bash
# Check server health
curl http://localhost:4000/api/auth/session

# Test hotel listing
curl http://localhost:4000/api/hotels
```

## 🔐 Authentication

- Session-based authentication using Passport.js
- Passwords hashed with bcryptjs (10 rounds)
- HttpOnly cookies for session storage
- CORS enabled for frontend communication

## 📦 Seeding Database

```bash
# Seed hotels with sample data
node hotels.seed.js
```

## 🛠️ Middleware

### Authentication Middleware
- `isAuthenticated` - Requires user login
- `isAdmin` - Requires admin privileges
- `optionalAuth` - Optional authentication

### Validation Middleware
- `validateObjectId` - Validates MongoDB ObjectIds
- `validateRequiredFields` - Checks required fields
- `validateDates` - Validates date ranges

### Error Middleware
- `errorHandler` - Global error handler
- `notFoundHandler` - 404 handler

## 📝 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/ticket-booking
PORT=4000
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

## 🐛 Debugging

### Common Issues

**Port already in use:**
```bash
lsof -ti:4000 | xargs kill -9
```

**MongoDB connection failed:**
```bash
# Ensure MongoDB is running
mongod --dbpath /path/to/data
```

## 📚 Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `passport` - Authentication
- `bcryptjs` - Password hashing
- `express-session` - Session management
- `cors` - CORS middleware
- `helmet` - Security headers
- `dotenv` - Environment variables

---

**Port:** 4000  
**API Base URL:** http://localhost:4000/api

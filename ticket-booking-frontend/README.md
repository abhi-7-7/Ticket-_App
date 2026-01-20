# Frontend Application

Next.js 13 (App Router) frontend for the Ticket Booking System.

## 📁 Folder Structure

```
ticket-booking-frontend/
├── app/                     # Next.js App Router pages
│   ├── (auth)/                  # Authentication routes (grouped)
│   ├── (main)/                  # Main application routes (grouped)
│   ├── about/                   # About page
│   ├── blogs/                   # Blog pages
│   ├── bookings/                # User bookings
│   ├── hotels/                  # Hotel listing & details
│   ├── login/                   # Login page
│   ├── signup/                  # Registration page
│   ├── manager/                 # Manager dashboard
│   ├── layout.jsx               # Root layout
│   ├── page.jsx                 # Home page
│   ├── globals.css              # Global styles
│   └── auth-provider.jsx        # Auth provider wrapper
│
├── components/              # Reusable components
│   └── Navbar.jsx               # Navigation bar
│
├── context/                 # React Context providers
│   └── AuthContext.jsx          # Authentication context
│
├── lib/                     # API and utilities
│   └── api.js                   # Axios instance & API functions
│
├── utils/                   # Utility functions
│   ├── date.utils.js            # Date formatting & calculations
│   ├── price.utils.js           # Price formatting
│   ├── validation.utils.js      # Form validation
│   └── index.js                 # Utils exports
│
├── constants/               # Application constants
│   └── index.js                 # Routes, messages, endpoints
│
├── hooks/                   # Custom React hooks (future)
│
├── .env.local               # Environment variables
├── jsconfig.json            # JavaScript configuration
├── package.json             # Dependencies & scripts
└── README.md                # This file
```

## 🎨 Pages & Routes

### Public Pages
- `/` - Home page
- `/about` - About the platform
- `/hotels` - Browse hotels
- `/hotels/[id]` - Hotel details & booking
- `/blogs` - Blog listing
- `/blogs/[slug]` - Blog article
- `/login` - User login
- `/signup` - User registration

### Protected Pages
- `/bookings` - My bookings (requires auth)
- `/manager` - Manager dashboard (requires auth)

## 🧩 Components

### Navbar
Navigation component with:
- Logo/brand
- Navigation links
- Authentication status
- Active route highlighting
- Responsive mobile menu

### Layout
Root layout wrapper:
- Includes Navbar
- Wraps all pages with AuthProvider
- Sets up HTML structure

## 🔧 Utilities

### Date Utils
- `formatDate()` - Format date to readable string
- `calculateNights()` - Calculate nights between dates
- `isPastDate()` - Check if date is in past
- `getMinDate()` - Get minimum date for inputs

### Price Utils
- `formatPrice()` - Format price to USD currency
- `calculateTotalPrice()` - Calculate total booking price
- `calculatePricePerPerson()` - Split price calculation

### Validation Utils
- `isValidEmail()` - Email validation
- `isValidPassword()` - Password strength check
- `isRequired()` - Required field validation
- `isValidDateRange()` - Date range validation

## 📡 API Integration

### API Client (`lib/api.js`)
Axios instance with:
- Base URL from environment
- Credentials enabled (cookies)
- Organized API functions

### API Functions
- **authAPI** - signup, login, logout, checkSession
- **hotelsAPI** - getAll, getById, create, update, delete
- **bookingsAPI** - create, getMyBookings, cancel
- **managerAPI** - getAllBookings, checkIn, checkOut
- **blogsAPI** - getAll, getBySlug, create, update, delete

## 🎯 Constants

### API Endpoints
Centralized endpoint definitions in `constants/index.js`

### Routes
Application route constants for navigation

### Messages
- Validation messages
- Success messages
- Error messages

### Status & Types
- Booking statuses
- Room types
- User roles

## 🚀 Running the App

### Development Mode
```bash
npm run dev  # Runs on http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

## 🔐 Authentication

- Uses React Context for global auth state
- Session-based authentication with cookies
- Protected routes redirect to login
- Automatic session check on app load

## 🎨 Styling

- Custom CSS with utility classes
- Tailwind-inspired utilities in `globals.css`
- Modular component styles
- Responsive design

## 📝 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Note:** Variables must start with `NEXT_PUBLIC_` to be accessible in browser.

## 🐛 Debugging

### Common Issues

**API calls failing:**
- Check NEXT_PUBLIC_API_URL in .env.local
- Ensure backend is running on port 4000
- Restart dev server after env changes

**Authentication not persisting:**
- Check withCredentials in api.js
- Verify cookie settings in backend

**Environment variables not loading:**
- Restart Next.js dev server
- Ensure .env.local exists in root
- Check variable name starts with NEXT_PUBLIC_

## 📚 Dependencies

- `next` - React framework
- `react` - UI library
- `react-dom` - React DOM renderer
- `axios` - HTTP client

## 🔄 State Management

### Context API
- `AuthContext` - User authentication state
- Global state accessible via `useContext(AuthContext)`

### Local State
- `useState` for component-level state
- `useEffect` for side effects and data fetching

## 🎨 Code Style

- Use functional components
- Prefer hooks over class components
- Keep components small and focused
- Use absolute imports with @ alias
- Document complex logic with comments

---

**Port:** 3000  
**API URL:** http://localhost:4000/api

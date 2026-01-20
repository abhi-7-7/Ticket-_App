/**
 * Application Constants
 * Centralized constants for the application
 */

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    SESSION: '/auth/session',
  },
  HOTELS: {
    LIST: '/hotels',
    DETAIL: (id) => `/hotels/${id}`,
    CREATE: '/hotels',
    UPDATE: (id) => `/hotels/${id}`,
    DELETE: (id) => `/hotels/${id}`,
  },
  BOOKINGS: {
    CREATE: '/bookings',
    LIST: '/bookings',
    CANCEL: (id) => `/bookings/${id}`,
  },
  MANAGER: {
    BOOKINGS: '/manager/bookings',
    CHECKIN: (id) => `/manager/bookings/${id}/checkin`,
    CHECKOUT: (id) => `/manager/bookings/${id}/checkout`,
  },
  BLOGS: {
    LIST: '/blogs',
    DETAIL: (slug) => `/blogs/${slug}`,
    CREATE: '/blogs',
    UPDATE: (id) => `/blogs/${id}`,
    DELETE: (id) => `/blogs/${id}`,
  },
};

/**
 * Booking Status
 */
export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked-in',
  CHECKED_OUT: 'checked-out',
  CANCELLED: 'cancelled',
};

/**
 * Room Types
 */
export const ROOM_TYPES = {
  SINGLE: 'single',
  DOUBLE: 'double',
  SUITE: 'suite',
};

/**
 * User Roles
 */
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MANAGER: 'manager',
};

/**
 * Navigation Routes
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOTELS: '/hotels',
  HOTEL_DETAIL: (id) => `/hotels/${id}`,
  BOOKINGS: '/bookings',
  MANAGER: '/manager',
  BLOGS: '/blogs',
  BLOG_DETAIL: (slug) => `/blogs/${slug}`,
};

/**
 * Form Validation Messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  DATES_INVALID: 'Check-out date must be after check-in date',
  SELECT_ROOM: 'Please select a room',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  LOGIN_SUCCESS: 'Login successful',
  SIGNUP_SUCCESS: 'Account created successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTH_REQUIRED: 'Please login to continue',
  UNAUTHORIZED: 'You do not have permission to perform this action',
};

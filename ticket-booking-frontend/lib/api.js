import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== AUTH API =====
export const authAPI = {
  signup: (username, email, password) => api.post('/auth/signup', { username, email, password }),
  login: (username, password) => api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
};

// ===== BLOGS API =====
export const blogsAPI = {
  getAll: () => api.get('/blogs'),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
};

// ===== HOTELS API =====
export const hotelsAPI = {
  getAll: (params) => api.get('/hotels', { params }), // params: { city, limit, skip }
  getById: (id) => api.get(`/hotels/${id}`),
  create: (hotelData) => api.post('/hotels', hotelData),
};

// ===== BOOKINGS API =====
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: (userId) => api.get('/bookings', { params: userId ? { userId } : {} }),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

// ===== MANAGER API =====
export const managerAPI = {
  getAllBookings: (filters) => api.get('/manager/bookings', { params: filters }),
  checkIn: (bookingId) => api.post(`/manager/check-in/${bookingId}`),
  checkOut: (bookingId) => api.post(`/manager/check-out/${bookingId}`),
};

export default api;

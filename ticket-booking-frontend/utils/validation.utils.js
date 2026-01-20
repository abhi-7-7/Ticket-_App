/**
 * Validation Utilities
 * Client-side validation helper functions
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * At least 6 characters
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

/**
 * Validate date range
 */
export const isValidDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return false;
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  return checkInDate < checkOutDate;
};

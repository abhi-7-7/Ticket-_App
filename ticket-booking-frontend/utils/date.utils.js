/**
 * Date Utilities
 * Helper functions for date formatting and calculations
 */

/**
 * Format date to readable string (e.g., "Jan 20, 2026")
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format date to ISO string for API calls
 */
export const toISODate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString();
};

/**
 * Calculate number of nights between two dates
 */
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  const diffTime = Math.abs(checkOutDate - checkInDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Get minimum date for date input (today)
 */
export const getMinDate = () => {
  return new Date().toISOString().split('T')[0];
};

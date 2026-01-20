/**
 * Price Utilities
 * Helper functions for price formatting and calculations
 */

/**
 * Format price to USD currency string
 */
export const formatPrice = (amount) => {
  if (typeof amount !== 'number') return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate total price for booking
 */
export const calculateTotalPrice = (nightlyRate, nights) => {
  return nightlyRate * nights;
};

/**
 * Calculate price per person (for split billing)
 */
export const calculatePricePerPerson = (totalPrice, numberOfPeople) => {
  if (numberOfPeople <= 0) return totalPrice;
  return totalPrice / numberOfPeople;
};

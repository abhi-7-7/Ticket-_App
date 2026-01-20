// High-quality Unsplash hotel images as fallback
// These are royalty-free images suitable for commercial use
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=800&h=600&fit=crop', // Luxury hotel exterior
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', // Modern hotel lobby
  'https://images.unsplash.com/photo-1564501049351-005e2b3e3337?w=800&h=600&fit=crop', // Hotel room with ocean view
  'https://images.unsplash.com/photo-1551632786-de41ec16a kirk-9-wXKJzL0?w=800&h=600&fit=crop', // Hotel pool area
];

/**
 * Get a random fallback image
 * @param {string|number} seed - Optional seed for consistent image selection
 * @returns {string} Unsplash image URL
 */
export function getRandomFallbackImage(seed) {
  if (seed !== undefined) {
    // Use seed to consistently select same image for same hotel
    const index = Math.abs(seed) % FALLBACK_IMAGES.length;
    return FALLBACK_IMAGES[index];
  }
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  return FALLBACK_IMAGES[randomIndex];
}

/**
 * Get fallback image based on hotel ID
 * @param {string} hotelId - Hotel ID for consistent image selection
 * @returns {string} Unsplash image URL
 */
export function getFallbackImageForHotel(hotelId) {
  if (!hotelId) return FALLBACK_IMAGES[0];
  
  // Use hotel ID to create consistent seed
  const seed = hotelId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return getRandomFallbackImage(seed);
}

/**
 * Get all fallback images
 * @returns {array} Array of all fallback image URLs
 */
export function getAllFallbackImages() {
  return FALLBACK_IMAGES;
}

/**
 * Get fallback image gallery (multiple images for gallery view)
 * @param {string} hotelId - Hotel ID
 * @param {number} count - Number of images to return (default: 4)
 * @returns {array} Array of fallback images
 */
export function getFallbackImageGallery(hotelId, count = 4) {
  const gallery = [];
  if (!hotelId) {
    // Return available fallback images
    return FALLBACK_IMAGES.slice(0, count);
  }
  
  // Create seed based on hotel ID
  const seed = hotelId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate gallery by cycling through images with offset
  for (let i = 0; i < Math.min(count, FALLBACK_IMAGES.length); i++) {
    const index = (seed + i) % FALLBACK_IMAGES.length;
    gallery.push(FALLBACK_IMAGES[index]);
  }
  
  return gallery;
}

/**
 * Check if hotel has valid images
 * @param {object} hotel - Hotel object
 * @returns {boolean} True if hotel has valid images array with at least one image
 */
export function hasValidImages(hotel) {
  return (
    hotel &&
    hotel.images &&
    Array.isArray(hotel.images) &&
    hotel.images.length > 0 &&
    hotel.images[0] &&
    typeof hotel.images[0] === 'string'
  );
}

/**
 * Get hotel images with fallback
 * @param {object} hotel - Hotel object
 * @returns {array} Array of valid image URLs
 */
export function getHotelImages(hotel) {
  if (hasValidImages(hotel)) {
    return hotel.images;
  }
  
  // Return fallback gallery if no valid images
  return getFallbackImageGallery(hotel?.id || hotel?._id, 4);
}

/**
 * Get first hotel image with fallback
 * @param {object} hotel - Hotel object
 * @returns {string} Image URL
 */
export function getFirstHotelImage(hotel) {
  if (hasValidImages(hotel)) {
    return hotel.images[0];
  }
  
  // Return fallback image
  return getFallbackImageForHotel(hotel?.id || hotel?._id);
}

export default {
  getRandomFallbackImage,
  getFallbackImageForHotel,
  getAllFallbackImages,
  getFallbackImageGallery,
  hasValidImages,
  getHotelImages,
  getFirstHotelImage,
};

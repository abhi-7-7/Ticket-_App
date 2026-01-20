/**
 * Blog Reading Time Calculator
 * Calculates estimated reading time based on word count
 * Average reading speed: 200-250 words per minute
 */

export const calculateReadingTime = (text) => {
  if (!text) return 0;
  
  const wordsPerMinute = 225; // Average reading speed
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, minutes); // Minimum 1 minute
};

/**
 * Extract excerpt from blog content
 * Removes extra whitespace and truncates to specified length
 */
export const getExcerpt = (text, maxLength = 150) => {
  if (!text) return '';
  
  // Clean up the text
  const cleanText = text
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Truncate and add ellipsis, but break at word boundary
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpaceIndex) + '...';
};

/**
 * Format blog content for rich display
 * Handles paragraph breaks and basic formatting
 */
export const formatBlogContent = (content) => {
  if (!content) return '';
  
  return content
    .split('\n\n') // Split by double newlines for paragraphs
    .filter(para => para.trim().length > 0) // Remove empty paragraphs
    .map(para => para.trim())
    .join('\n\n');
};

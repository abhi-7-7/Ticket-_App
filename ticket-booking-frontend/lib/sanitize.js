/**
 * Content Sanitization Utility
 * SECURITY: Prevent XSS attacks by sanitizing user-generated and API content
 * 
 * Uses DOMPurify to remove potentially malicious scripts while preserving
 * legitimate HTML formatting like markdown-generated content
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * 
 * CONFIG:
 * - Allows common markdown/formatting tags: <p>, <h1-6>, <strong>, <em>, <u>, <a>, <ul>, <ol>, <li>, <br>, <code>, <pre>, <blockquote>
 * - Removes: <script>, <iframe>, <img with javascript>, onclick handlers, etc.
 * - Allows safe href attributes on links
 * 
 * @param {string} dirty - Raw HTML content that may contain malicious scripts
 * @returns {string} - Sanitized HTML safe to render
 */
export const sanitizeHtml = (dirty) => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  const config = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'a', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody'
    ],
    ALLOWED_ATTR: [
      'href',           // for links
      'title',          // for links and elements
      'alt',            // for images
      'src',            // for images (will be validated)
      'target',         // for link target
      'rel'             // for link relationships
    ],
    KEEP_CONTENT: true,  // Keep text even if tags are stripped
    ALLOW_DATA_ATTR: false,  // Don't allow data-* attributes
  };

  // Sanitize the HTML
  let clean = DOMPurify.sanitize(dirty, config);

  // Additional security: remove javascript: URLs
  clean = clean.replace(/href="javascript:[^"]*"/gi, 'href="#"');
  clean = clean.replace(/src="javascript:[^"]*"/gi, '');

  return clean;
};

/**
 * Sanitize plain text - just removes HTML/scripts, no formatting preserved
 * 
 * @param {string} text - Raw text that may contain HTML
 * @returns {string} - Plain text without any HTML
 */
export const sanitizeText = (text) => {
  if (!typeof text === 'string') return '';
  
  // Strip all HTML tags
  return DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true 
  });
};

/**
 * Validate URL is safe to use in href or src
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is safe
 */
export const isSafeUrl = (url) => {
  if (!url) return false;
  
  try {
    // Don't allow javascript: or data: URLs
    if (url.startsWith('javascript:') || url.startsWith('data:')) {
      return false;
    }
    
    // Allow relative URLs and http(s) URLs
    if (url.startsWith('/') || url.startsWith('http')) {
      return true;
    }
    
    return false;
  } catch (err) {
    return false;
  }
};

export default {
  sanitizeHtml,
  sanitizeText,
  isSafeUrl,
};

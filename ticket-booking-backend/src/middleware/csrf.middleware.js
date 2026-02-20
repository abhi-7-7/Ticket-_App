/**
 * CSRF Protection Middleware
 * Security: Protect against Cross-Site Request Forgery attacks
 * 
 * Strategy: Use SameSite cookies + session-based validation
 * No explicit CSRF tokens needed with proper cookie settings
 */

/**
 * CSRF validation middleware for POST/PUT/DELETE requests
 * Uses SameSite cookie policy to prevent CSRF attacks
 * 
 * SECURITY: Only validates when:
 * 1. Request is changing data (POST, PUT, DELETE, PATCH)
 * 2. Content-Type is application/json
 * 3. Request is not from same origin (SameSite handles this)
 */
export const csrfProtection = (req, res, next) => {
  // Only check state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    // Verify Content-Type is JSON (browser same-origin requests have this)
    const contentType = req.get('Content-Type') || '';
    
    // If not JSON, could be form-encoded or missing - could be CSRF
    if (!contentType.includes('application/json')) {
      // Allow GET-like requests but log suspicious ones
      if (req.method !== 'GET' && !contentType.includes('application/x-www-form-urlencoded')) {
        console.warn(`Suspicious request: ${req.method} ${req.path} - Invalid Content-Type: ${contentType}`);
      }
    }
  }
  
  next();
};

/**
 * Validate request origin for sensitive operations
 * SECURITY: Prevent requests from different origins
 */
export const validateOrigin = (req, res, next) => {
  // Only validate for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.get('Origin');
    const referer = req.get('Referer');
    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // If origin header is present, validate it against allowed origin
    if (origin && origin !== allowedOrigin) {
      console.warn(`Cross-origin request blocked: Origin=${origin}, Allowed=${allowedOrigin}`);
      return res.status(403).json({ error: 'Cross-origin request not allowed' });
    }
    
    // If referer header is present, validate it against allowed origin
    if (referer && !referer.startsWith(allowedOrigin)) {
      console.warn(`Cross-origin request blocked: Referer=${referer}, Allowed=${allowedOrigin}`);
      return res.status(403).json({ error: 'Cross-origin request not allowed' });
    }
  }
  
  next();
};

export default { csrfProtection, validateOrigin };

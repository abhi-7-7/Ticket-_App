/**
 * Authentication Middleware
 * Handles user authentication checks for protected routes
 */

/**
 * Middleware to check if user is authenticated
 * Protects routes that require login
 */
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Authentication required' });
};

/**
 * Middleware to check if user is admin
 * Protects routes that require admin privileges
 */
export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    if (req.user && req.user.isAdmin) {
      return next();
    }
    return res.status(403).json({ error: 'Admin access required' });
  }
  return res.status(401).json({ error: 'Authentication required' });
};

/**
 * Optional authentication middleware
 * Allows both authenticated and unauthenticated access
 */
export const optionalAuth = (req, res, next) => {
  // Always proceed, authentication status available via req.user
  next();
};

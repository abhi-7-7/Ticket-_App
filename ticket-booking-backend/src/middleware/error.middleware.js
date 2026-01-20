/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

/**
 * Global error handler middleware
 * Catches and formats errors consistently
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error status and message
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  // Send error response
  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

/**
 * 404 Not Found handler
 * Handles requests to undefined routes
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
};

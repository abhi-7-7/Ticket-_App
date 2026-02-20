/**
 * Error Handling Middleware
 * Centralized error handling for the application
 * SECURITY: Never expose stack traces in production
 */

/**
 * Global error handler middleware
 * Catches and formats errors consistently
 * SECURITY FIX: Hide stack traces in production to prevent information leakage
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error status and message
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  const isDevelopment = process.env.NODE_ENV === 'development';

  // SECURITY: Only expose stack traces in development
  const errorResponse = {
    error: message,
  };

  // Add details only in development
  if (isDevelopment) {
    errorResponse.details = err.stack;
  } else {
    // In production, use generic error message for 500 errors
    if (statusCode === 500) {
      errorResponse.error = 'Internal server error';
    }
  }

  res.status(statusCode).json(errorResponse);
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

/**
 * Validation Middleware
 * Handles request validation for various endpoints
 */

/**
 * Validate MongoDB ObjectId
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // Simple MongoDB ObjectId validation (24 hex characters)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ 
        error: 'Invalid ID format',
        field: paramName 
      });
    }
    
    next();
  };
};

/**
 * Validate required fields in request body
 */
export const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missing = fields.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missing
      });
    }
    
    next();
  };
};

/**
 * Validate date format and logic
 */
export const validateDates = (req, res, next) => {
  const { checkIn, checkOut } = req.body;
  
  if (!checkIn || !checkOut) {
    return res.status(400).json({ 
      error: 'Check-in and check-out dates are required' 
    });
  }
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return res.status(400).json({ 
      error: 'Invalid date format' 
    });
  }
  
  if (checkInDate >= checkOutDate) {
    return res.status(400).json({ 
      error: 'Check-out date must be after check-in date' 
    });
  }
  
  next();
};

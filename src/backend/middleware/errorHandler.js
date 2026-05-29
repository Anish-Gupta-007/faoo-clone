/**
 * Global Express error-handling middleware.
 * Must be registered as the last middleware with 4 arguments.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message    = err.message || 'Internal Server Error';

  // Mongoose – invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message    = `Invalid ID: ${err.value}`;
  }

  // Mongoose – unique key constraint (11000)
  if (err.code === 11000) {
    statusCode  = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message     = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already exists`;
  }

  // Mongoose – schema validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message    = Object.values(err.errors).map((e) => e.message).join('; ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Token has expired';
  }

  // Log the error for backend debugging
  console.error('API Error:', err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

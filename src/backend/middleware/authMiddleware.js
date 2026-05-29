const jwt        = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const { User }   = require('../models');

/**
 * Middleware: verify Bearer JWT access token and attach req.user.
 * Rejects with 401 if token is missing, invalid, or user not found.
 */
const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('No token provided');
  }

  const token   = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); // throws JsonWebTokenError / TokenExpiredError

  const user = await User.findById(decoded.id).select('-passwordHash -refreshToken');
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;

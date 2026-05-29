/**
 * Middleware: allow access only to users with role = 'admin'.
 * Must be used AFTER authMiddleware (requires req.user to be set).
 */
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('Access denied: Admins only');
};

module.exports = adminMiddleware;

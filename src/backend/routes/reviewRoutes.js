const express = require('express');
const router  = express.Router();
const { getProductReviews, postReview, approveReview, getAdminReviews } =
  require('../controllers/reviewController');
const authMiddleware  = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public
router.get('/product/:productId', getProductReviews);

// AUTH
router.post('/', authMiddleware, postReview);

// Admin
router.get('/admin',          authMiddleware, adminMiddleware, getAdminReviews);
router.put('/:id/approve',    authMiddleware, adminMiddleware, approveReview);

module.exports = router;

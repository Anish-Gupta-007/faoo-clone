const express = require('express');
const router  = express.Router();
const { submitContactQuery, getAllContactQueries, resolveContactQuery } =
  require('../controllers/contactController');
const authMiddleware  = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public
router.post('/', submitContactQuery);

// Admin
router.get('/',           authMiddleware, adminMiddleware, getAllContactQueries);
router.put('/:id/resolve', authMiddleware, adminMiddleware, resolveContactQuery);

module.exports = router;

const express = require('express');
const router  = express.Router();
const { getDashboardStats, getAllUsers, getUserDetail } =
  require('../controllers/adminController');
const authMiddleware  = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

router.get('/stats',           getDashboardStats);
router.get('/users',           getAllUsers);
router.get('/users/:userId',   getUserDetail);

module.exports = router;

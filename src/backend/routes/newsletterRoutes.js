const express = require('express');
const router  = express.Router();
const { subscribe, getAllSubscribers } = require('../controllers/newsletterController');
const authMiddleware  = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/subscribe',              subscribe);
router.get('/subscribers', authMiddleware, adminMiddleware, getAllSubscribers);

module.exports = router;

const express = require('express');
const router  = express.Router();
const { getHomepageContent, updateHomepageContent } =
  require('../controllers/homepageController');
const authMiddleware  = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getHomepageContent);
router.put('/', authMiddleware, adminMiddleware, updateHomepageContent);

module.exports = router;

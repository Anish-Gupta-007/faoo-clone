const express = require('express');
const router = express.Router();
const { getHomepageVideos } = require('../../services/shopify/homepageVideos');

router.get('/', async (req, res, next) => {
  try {
    const videos = await getHomepageVideos();
    res.json({ success: true, data: videos });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

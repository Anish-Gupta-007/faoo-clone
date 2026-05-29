const express = require('express');
const router = express.Router();
const { getAnnouncements } = require('../../services/shopify/announcements');

router.get('/', async (req, res) => {
  try {
    const announcements = await getAnnouncements();
    res.json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

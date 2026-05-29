const express = require('express');
const router = express.Router();
const { getCollections, getCollectionByHandle } = require('../../services/shopify/collections');

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const collections = await getCollections(limit);
    res.json({ success: true, data: collections });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:handle', async (req, res) => {
  try {
    const collection = await getCollectionByHandle(req.params.handle);
    res.json({ success: true, data: collection });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

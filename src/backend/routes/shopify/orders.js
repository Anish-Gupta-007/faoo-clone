const express = require('express');
const router = express.Router();
const { getOrders, getOrderById } = require('../../services/shopify/orders');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const accessToken = req.user.shopifyAccessToken; 
    
    if (!accessToken) {
      return res.json({ success: true, data: [] });
    }

    const orders = await getOrders(accessToken, limit);
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const accessToken = req.user.shopifyAccessToken;
    if (!accessToken) {
      return res.status(401).json({ success: false, message: 'Shopify token missing' });
    }

    const order = await getOrderById(accessToken, req.params.id);
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

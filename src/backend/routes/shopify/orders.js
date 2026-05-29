const express = require('express');
const router = express.Router();
const { getCustomerOrders } = require('../../services/shopify/customerService');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const shopifyCustomerId = req.user.shopifyCustomerId;

    if (!shopifyCustomerId) {
      return res.json({ success: true, data: [] });
    }

    const orders = await getCustomerOrders(shopifyCustomerId);
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.json({ success: true, data: [] });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const shopifyCustomerId = req.user.shopifyCustomerId;
    if (!shopifyCustomerId) {
      return res.status(401).json({ success: false, message: 'Shopify customer ID missing' });
    }

    const orders = await getCustomerOrders(shopifyCustomerId);
    const order = orders.find(o => o.id === req.params.id || o.order_number === req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Error fetching order:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { createReturn, getReturnById } = require('../../services/shopify/returns');
const authMiddleware = require('../../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { orderId, lineItems } = req.body;
    const returnData = await createReturn(orderId, lineItems);
    res.json({ success: true, data: returnData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:returnId', authMiddleware, async (req, res) => {
  try {
    const returnData = await getReturnById(req.params.returnId);
    res.json({ success: true, data: returnData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

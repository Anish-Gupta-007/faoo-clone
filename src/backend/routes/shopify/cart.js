const express = require('express');
const router = express.Router();
const { createCart, getCart, addToCart, removeFromCart, updateCartLine, updateCartAttributes } = require('../../services/shopify/cart');

router.post('/create', async (req, res) => {
  try {
    const { lines } = req.body;
    const cart = await createCart(lines);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:cartId', async (req, res) => {
  try {
    const cart = await getCart(req.params.cartId);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:cartId/add', async (req, res) => {
  try {
    const { lines } = req.body;
    const cart = await addToCart(req.params.cartId, lines);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:cartId/remove', async (req, res) => {
  try {
    const { lineIds } = req.body;
    const cart = await removeFromCart(req.params.cartId, lineIds);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:cartId/update', async (req, res) => {
  try {
    const { lines } = req.body;
    const cart = await updateCartLine(req.params.cartId, lines);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/:cartId/discount', async (req, res) => {
  try {
    const { discountCode } = req.body;
    // We import applyDiscountCode directly here to avoid requiring a full file rewrite above
    const { applyDiscountCode } = require('../../services/shopify/cart');
    const cart = await applyDiscountCode(req.params.cartId, discountCode);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/:cartId/attributes', async (req, res) => {
  try {
    const { attributes } = req.body;
    const cart = await updateCartAttributes(req.params.cartId, attributes);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

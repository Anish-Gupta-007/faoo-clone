const asyncHandler          = require('../middleware/asyncHandler');

const { getProducts } = require('../services/shopify/products');

/**
 * @desc   Full-text search across products
 * @route  GET /api/v1/search?q=...
 * @access PUBLIC
 */
const searchProducts = asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;

  if (!q || q.trim().length === 0) {
    res.status(400);
    throw new Error('Search query "q" is required');
  }

  // Use Shopify Storefront API for search
  const products = await getProducts(limit, q.trim());

  res.status(200).json({
    success: true,
    products,
    total: products.length,
    page: 1,
    pages: 1,
  });
});

module.exports = { searchProducts };

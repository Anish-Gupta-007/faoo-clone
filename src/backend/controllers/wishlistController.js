const { User } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const { getProductsByIds } = require('../services/shopify/products');

/**
 * Helper to resolve product details for both Shopify GIDs and MongoDB ObjectIds.
 */
const resolveWishlistProducts = async (wishlistIds) => {
  if (!wishlistIds || !wishlistIds.length) {
    return [];
  }
  
  const shopifyIds = [];
  
  for (const id of wishlistIds) {
    if (!id) continue;
    const idStr = id.toString();
    if (idStr.startsWith('gid://shopify/Product/')) {
      shopifyIds.push(idStr);
    }
  }
  
  // Fetch Shopify products
  let shopifyProductsMapped = [];
  if (shopifyIds.length > 0) {
    try {
      const shopifyProducts = await getProductsByIds(shopifyIds);
      shopifyProductsMapped = (shopifyProducts || []).map(sp => ({
        _id: sp.id,
        name: sp.title,
        slug: sp.handle,
        price: parseFloat(sp.priceRange?.minVariantPrice?.amount || '0'),
        media: sp.images?.map((img, i) => ({
          _id: `img-${i}`,
          url: img.url,
          publicId: `pub-${i}`,
          mediaType: 'model',
          displayOrder: i,
          isPrimary: i === 0,
        })) || [],
        isActive: true,
      }));
    } catch (err) {
      console.error('Error fetching Shopify products for wishlist:', err);
    }
  }
  
  // Combine them back in the original order to preserve sequence
  const productMap = new Map();
  shopifyProductsMapped.forEach(p => productMap.set(p._id, p));
  
  const finalWishlist = wishlistIds
    .map(id => productMap.get(id && id.toString()))
    .filter(Boolean);
    
  return finalWishlist;
};

/**
 * @desc   Get user wishlist (populated products)
 * @route  GET /api/v1/wishlist
 * @access AUTH
 */
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('wishlist');
  const wishlist = await resolveWishlistProducts(user.wishlist || []);
  res.status(200).json({ success: true, wishlist });
});

/**
 * @desc   Toggle product in wishlist (add if absent, remove if present)
 * @route  POST /api/v1/wishlist/:productId
 * @access AUTH
 */
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id).select('wishlist');
  const isInWishlist = (user.wishlist || []).some((id) => id && id.toString() === productId);

  if (isInWishlist) {
    await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: productId } });
    const updated = await User.findById(req.user._id).select('wishlist');
    const wishlist = await resolveWishlistProducts(updated.wishlist || []);
    return res.status(200).json({ success: true, message: 'Removed from wishlist', wishlist });
  }

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: productId } });
  const updated = await User.findById(req.user._id).select('wishlist');
  const wishlist = await resolveWishlistProducts(updated.wishlist || []);
  res.status(200).json({ success: true, message: 'Added to wishlist', wishlist });
});

/**
 * @desc   Explicit remove from wishlist
 * @route  DELETE /api/v1/wishlist/:productId
 * @access AUTH
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.productId } });
  const updated = await User.findById(req.user._id).select('wishlist');
  const wishlist = await resolveWishlistProducts(updated.wishlist || []);
  res.status(200).json({ success: true, message: 'Removed from wishlist', wishlist });
});

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };

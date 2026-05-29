const { Review } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const { getOrders } = require('../services/shopify/orders');

// ─── Helper: recalculate product rating (no-op now since products are in Shopify) ───
const updateProductRating = async (productId) => {
  // Shopify products are fetched directly, ratings are rendered dynamically in frontend
};

// ─── Helper: publish approved reviews ────────────────────────────────────────
const publishPendingReviews = async (productId) => {
  const now     = new Date();
  const pending = await Review.find({
    productId,
    isApproved:  true,
    publishedAt: null,
  });

  if (pending.length === 0) return;

  await Promise.all(pending.map((r) =>
    Review.findByIdAndUpdate(r._id, { publishedAt: now })
  ));
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc   Get all published reviews for a product.
 * @route  GET /api/v1/reviews/product/:productId
 * @access PUBLIC
 */
const getProductReviews = asyncHandler(async (req, res) => {
  const idOrHandle = req.params.productId;
  const isObjectId = idOrHandle && idOrHandle.length === 24 && /^[0-9a-fA-F]+$/.test(idOrHandle);

  if (isObjectId) {
    publishPendingReviews(idOrHandle).catch(() => {});
  }

  const query = isObjectId 
    ? { productId: idOrHandle, isApproved: true }
    : { productHandle: idOrHandle, isApproved: true };

  const reviews = await Review.find(query)
    .populate('userId', 'fullName')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, reviews });
});

/**
 * @desc   Submit a review (only for delivered orders containing that product)
 * @route  POST /api/v1/reviews
 * @access AUTH
 */
const postReview = asyncHandler(async (req, res) => {
  const { productId, productHandle, rating, reviewText } = req.body;

  if (!productId && !productHandle) {
    res.status(400);
    throw new Error('productId or productHandle is required');
  }
  if (!rating) {
    res.status(400);
    throw new Error('rating is required');
  }
  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const targetIdentifier = productHandle || productId;

  // Eligibility: user must have a Shopify order containing this product
  let eligibleOrder = null;
  try {
    const orders = await getOrders(50, req.user.email);
    for (const order of orders) {
      if (order.lineItems) {
        for (const item of order.lineItems) {
          const itemHandle = item.product?.handle;
          const itemId = item.product?.id;
          const itemTitle = item.title;

          if (
            (productId && itemId === productId) ||
            (productHandle && itemHandle === productHandle) ||
            (productHandle && itemTitle.toLowerCase().includes(productHandle.toLowerCase()))
          ) {
            eligibleOrder = order;
            break;
          }
        }
      }
      if (eligibleOrder) break;
    }
  } catch (err) {
    console.error('Error verifying review eligibility from Shopify:', err);
  }

  // Bypass eligibility check in local development to allow testing reviews easily
  if (!eligibleOrder && process.env.NODE_ENV !== 'development') {
    res.status(403);
    throw new Error('You can only review products from your delivered orders');
  }

  // One review per product per user (unique index enforces at DB level)
  const isObjectId = targetIdentifier && targetIdentifier.length === 24 && /^[0-9a-fA-F]+$/.test(targetIdentifier);
  const query = isObjectId 
    ? { productId: targetIdentifier, userId: req.user._id }
    : { productHandle: targetIdentifier, userId: req.user._id };

  const existing = await Review.findOne(query);
  if (existing) {
    res.status(409);
    throw new Error('You have already reviewed this product');
  }

  const reviewData = {
    userId:     req.user._id,
    rating:     Number(rating),
    reviewText: reviewText || '',
  };

  if (isObjectId) {
    reviewData.productId = targetIdentifier;
  } else {
    reviewData.productHandle = targetIdentifier;
  }

  const review = await Review.create(reviewData);

  res.status(201).json({ success: true, review, message: 'Review submitted and pending approval' });
});

/**
 * @desc   Approve a review (admin)
 * @route  PUT /api/v1/reviews/:id/approve
 * @access ADMIN
 */
const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.isApproved = true;
  review.publishedAt = new Date();
  await review.save();

  res.status(200).json({ success: true, review });
});

/**
 * @desc   List reviews for admin moderation
 * @route  GET /api/v1/reviews/admin
 * @access ADMIN
 */
const getAdminReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isApproved } = req.query;
  const filter = {};
  if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

  const skip = (Number(page) - 1) * Number(limit);
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('userId',    'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, reviews, total });
});

module.exports = { getProductReviews, postReview, approveReview, getAdminReviews };

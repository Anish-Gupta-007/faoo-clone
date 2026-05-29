const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    productHandle: {
      type: String,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewText: {
      type: String,
      default: '',
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    /**
     * Reviews go live ONLY when:
     *   isApproved === true  AND  Date.now >= product.launchedAt + 7 days
     * Set by server when both conditions are met.
     */
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────

/** Fetch all reviews for a product on PDP */
ReviewSchema.index({ productId: 1 });

/** Approved & published reviews for a product (public display) */
ReviewSchema.index({ productId: 1, isApproved: 1, publishedAt: 1 });

/** Prevent duplicate reviews: one user → one review per product */
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

/** Admin moderation queue: unapproved reviews */
ReviewSchema.index({ isApproved: 1, createdAt: -1 });

// ─── Model ─────────────────────────────────────────────────────────────────────

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

module.exports = Review;

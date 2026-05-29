const mongoose = require('mongoose');

// ─── Sub-schema: Hero Banner ──────────────────────────────────────────────────

const BannerSchema = new mongoose.Schema(
  {
    title:     { type: String, default: '' },
    subtitle:  { type: String, default: '' },
    imageUrl:  { type: String, default: '' },
    ctaText:   { type: String, default: '' },
    ctaLink:   { type: String, default: '' },
    isActive:  { type: Boolean, default: true },
  },
  { _id: true }
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const HomepageContentSchema = new mongoose.Schema(
  {
    /**
     * key: 'main' — single document for the homepage.
     * Additional keys can be used for A/B variants or seasonal campaigns.
     */
    key: {
      type:     String,
      required: true,
      unique:   true,
      default:  'main',
    },
    heroBanners: [BannerSchema],
    featuredCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    ],
    featuredProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ],
    /** Scrolling marquee text shown in the announcement strip */
    marqueeText:          { type: String, default: '' },
    announcementBar:      { type: String, default: '' },
    isAnnouncementActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// ─── Model ───────────────────────────────────────────────────────────────────

const HomepageContent = mongoose.models.HomepageContent || mongoose.model('HomepageContent', HomepageContentSchema);

module.exports = HomepageContent;

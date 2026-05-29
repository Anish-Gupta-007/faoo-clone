const mongoose = require('mongoose');

const ContactQuerySchema = new mongoose.Schema(
  {
    fullName: {
      type:     String,
      required: [true, 'Full name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      lowercase: true,
      trim:      true,
    },
    phone: {
      type:  String,
      default: '',
      trim:  true,
    },
    message: {
      type:     String,
      required: [true, 'Message is required'],
      trim:     true,
    },
    isResolved: {
      type:    Boolean,
      default: false,
    },
    resolvedAt: {
      type:    Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

/** Admin queue: unresolved queries first, newest first */
ContactQuerySchema.index({ isResolved: 1, createdAt: -1 });

// ─── Model ───────────────────────────────────────────────────────────────────

const ContactQuery = mongoose.models.ContactQuery || mongoose.model('ContactQuery', ContactQuerySchema);

module.exports = ContactQuery;

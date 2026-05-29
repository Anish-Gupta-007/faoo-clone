const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// unique: true already covers email.
SubscriberSchema.index({ createdAt: -1 });

// ─── Model ───────────────────────────────────────────────────────────────────

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

module.exports = Subscriber;

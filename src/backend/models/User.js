const mongoose = require('mongoose');

// ─── Sub-schemas ───────────────────────────────────────────────────────────────

// (none – addresses & wishlist are plain refs)

// ─── Main Schema ───────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFirstOrder: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    profileIcon: {
      type: String,
      default: '',
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    wishlist: [
      {
        type: String,
      },
    ],
    refreshToken: {
      type: String,
      default: '',
      select: false, // never returned in queries by default
    },
    shopifyAccessToken: {
      type: String,
      default: '',
    },
    shopifyRefreshToken: {
      type: String,
      default: '',
    },
    shopifyCustomerId: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───────────────────────────────────────────────────────────────────

// unique: true already creates an index on email and phone.
// Additional compound / partial indexes:

/** Speed up role-based admin queries */
UserSchema.index({ role: 1 });

/** Speed up queries that filter verified customers */
UserSchema.index({ isVerified: 1, role: 1 });

// ─── Model ─────────────────────────────────────────────────────────────────────

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;

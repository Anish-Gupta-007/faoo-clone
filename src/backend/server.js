// Only load dotenv when running standalone (not inside Next.js which uses .env.local natively)
if (require.main === module) {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ── App init ──────────────────────────────────────────────────────────────────
const app = express();

// ── API base path ─────────────────────────────────────────────────────────────
const BASE = '/api/v1';

// Trust proxy in production (behind Vercel / reverse proxy)
app.set('trust proxy', 1);

// ── Lazy DB connection middleware (runs once on first request) ─────────────────
let dbReady = false;
app.use(async (req, res, next) => {
  if (!dbReady) {
    try {
      await connectDB();
      dbReady = true;
      console.log('✅ DB connected (lazy init on first request)');
    } catch (err) {
      console.error('❌ DB connection failed:', err.message);
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }
  }
  next();
});

// ── Global middleware ─────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || "").split(",").map(url => url.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Always allow requests with no origin (e.g. same-origin Next.js API requests or direct browser visits)
    if (!origin) {
      return callback(null, true);
    }
    // Allow if origin is in list or wildcard is set
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      // Log the blocked origin for debugging
      console.warn(`CORS blocked for origin: ${origin}`);
      console.warn(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ── Webhook routes (must be before express.json() to get raw body for HMAC) ──
// express.raw() is applied per-route inside webhooks.js — not globally.
app.use(`${BASE}/webhooks`, require('./routes/webhooks'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate-limit: 200 req / 15 min per IP across all /api routes
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — please slow down' },
}));

// ── Routes (lazy imports to avoid module-load-time crashes) ─────────────────

app.use(`${BASE}/auth`, require('./routes/authRoutes'));
// Shopify OAuth removed - using Admin API only for customer data sync
// app.use(`${BASE}/auth/shopify`, require('./routes/shopifyAuthRoutes'));
app.use(`${BASE}/user`, require('./routes/userRoutes'));
app.use(`${BASE}/wishlist`, require('./routes/wishlistRoutes'));
app.use(`${BASE}/reviews`, require('./routes/reviewRoutes'));
app.use(`${BASE}/homepage`, require('./routes/homepageRoutes'));
app.use(`${BASE}/newsletter`, require('./routes/newsletterRoutes'));
app.use(`${BASE}/contact`, require('./routes/contactRoutes'));
app.use(`${BASE}/search`, require('./routes/searchRoutes'));
app.use(`${BASE}/admin`, require('./routes/adminRoutes'));
app.use(`${BASE}/returns`, require('./routes/returnRoutes'));
app.use(`${BASE}/shop/products`, require('./routes/shopify/products'));
app.use(`${BASE}/shop/cart`, require('./routes/shopify/cart'));
app.use(`${BASE}/shop/orders`, require('./routes/shopify/orders'));
app.use(`${BASE}/shop/returns`, require('./routes/shopify/returns'));
app.use(`${BASE}/shop/announcements`, require('./routes/shopify/announcements'));
app.use(`${BASE}/shop/homepage-videos`, require('./routes/shopify/homepageVideos'));
app.use(`${BASE}/shop/collections`, require('./routes/shopify/collections'));
app.use(`${BASE}/shop/blogs`, require('./routes/shopify/blogs'));

// ── Health check (under BASE so it's reachable via Next.js catch-all) ─────────
app.get(`${BASE}/health`, (req, res) =>
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
);
app.get('/health', (req, res) =>
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
);

// ── Global error handler (must be last middleware) ────────────────────────────
app.use(errorHandler);

// ── Standalone bootstrap ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB().then(() => {
    dbReady = true;
    app.listen(PORT, () => {
      console.log(`🚀 Faoo API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
      console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
    });
  });
}

module.exports = app; // for Vercel serverless function & testing


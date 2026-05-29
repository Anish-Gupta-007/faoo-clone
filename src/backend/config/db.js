const mongoose = require('mongoose');
const dns = require('dns');

let cachedConnection = null;

/**
 * Connect to MongoDB with connection caching for serverless environments.
 * Uses Google DNS to resolve SRV records (fixes ECONNREFUSED on some ISPs).
 */
const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // Set Google DNS right before connecting — must be done at call-time,
  // not at module-load-time, because Next.js webpack may reorder top-level code.
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    // dns.setServers can throw if servers are invalid, ignore gracefully
    console.warn('⚠️ Could not set DNS servers:', e.message);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    cachedConnection = conn;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    throw err;
  }
};

module.exports = connectDB;

/**
 * src/models/index.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central barrel – import all Mongoose models from a single entry point.
 *
 * Usage:
 *   const { User, Product, Order } = require('../models');
 */

const User = require('./User');
const Address = require('./Address');
const Review = require('./Review');
const HomepageContent = require('./HomepageContent');
const Subscriber = require('./Subscriber');
const ContactQuery = require('./ContactQuery');
const ReturnRequest = require('./ReturnRequest');

module.exports = {
  User,
  Address,
  Review,
  HomepageContent,
  Subscriber,
  ContactQuery,
  ReturnRequest,
};


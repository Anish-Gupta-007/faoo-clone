const { Subscriber } = require('../models');
const asyncHandler   = require('../middleware/asyncHandler');

/**
 * @desc   Subscribe to newsletter
 * @route  POST /api/v1/newsletter/subscribe
 * @access PUBLIC
 */
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400); throw new Error('Email is required'); }

  const existing = await Subscriber.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(200).json({ success: true, message: 'Already subscribed' });
  }

  await Subscriber.create({ email });
  res.status(201).json({ success: true, message: 'Subscribed successfully! 🎉' });
});

/**
 * @desc   List all subscribers (paginated)
 * @route  GET /api/v1/newsletter/subscribers
 * @access ADMIN
 */
const getAllSubscribers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [subscribers, total] = await Promise.all([
    Subscriber.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Subscriber.countDocuments(),
  ]);

  res.status(200).json({ success: true, subscribers, total });
});

module.exports = { subscribe, getAllSubscribers };

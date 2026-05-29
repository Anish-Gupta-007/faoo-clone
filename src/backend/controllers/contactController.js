const { ContactQuery } = require('../models');
const asyncHandler     = require('../middleware/asyncHandler');

/**
 * @desc   Submit a contact enquiry
 * @route  POST /api/v1/contact
 * @access PUBLIC
 */
const submitContactQuery = asyncHandler(async (req, res) => {
  const { fullName, email, phone, message } = req.body;

  if (!fullName || !email || !message) {
    res.status(400);
    throw new Error('fullName, email, and message are required');
  }

  const query = await ContactQuery.create({ fullName, email, phone, message });
  res.status(201).json({ success: true, message: 'Query submitted successfully', query });
});

/**
 * @desc   List all contact queries (admin, filterable by isResolved)
 * @route  GET /api/v1/contact
 * @access ADMIN
 */
const getAllContactQueries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isResolved } = req.query;
  const filter = {};
  if (isResolved !== undefined) filter.isResolved = isResolved === 'true';

  const skip = (Number(page) - 1) * Number(limit);
  const [queries, total] = await Promise.all([
    ContactQuery.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ContactQuery.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, queries, total });
});

/**
 * @desc   Mark a contact query as resolved
 * @route  PUT /api/v1/contact/:id/resolve
 * @access ADMIN
 */
const resolveContactQuery = asyncHandler(async (req, res) => {
  const query = await ContactQuery.findByIdAndUpdate(
    req.params.id,
    { isResolved: true, resolvedAt: new Date() },
    { new: true }
  );
  if (!query) { res.status(404); throw new Error('Query not found'); }
  res.status(200).json({ success: true, query });
});

module.exports = { submitContactQuery, getAllContactQueries, resolveContactQuery };

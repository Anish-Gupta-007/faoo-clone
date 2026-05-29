const { HomepageContent } = require('../models');
const asyncHandler        = require('../middleware/asyncHandler');

/**
 * @desc   Get homepage CMS content (populated)
 * @route  GET /api/v1/homepage
 * @access PUBLIC
 */
const getHomepageContent = asyncHandler(async (req, res) => {
  let content = await HomepageContent.findOne({ key: 'main' });

  if (!content) {
    content = await HomepageContent.create({ key: 'main' });
  }

  res.status(200).json({ success: true, content });
});

/**
 * @desc   Update homepage CMS content
 * @route  PUT /api/v1/homepage
 * @access ADMIN
 */
const updateHomepageContent = asyncHandler(async (req, res) => {
  const content = await HomepageContent.findOneAndUpdate(
    { key: 'main' },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  );
  res.status(200).json({ success: true, content });
});

module.exports = { getHomepageContent, updateHomepageContent };

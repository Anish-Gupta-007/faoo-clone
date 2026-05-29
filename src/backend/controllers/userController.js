const { User } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const { getCustomerOrders } = require('../services/shopify/customerService');

/**
 * @desc   Get logged-in user profile
 * @route  GET /api/v1/user/profile
 * @access AUTH
 */
const getProfile = asyncHandler(async (req, res) => {
  const localUser = req.user;

  const user = {
    _id: localUser._id,
    fullName: localUser.fullName,
    email: localUser.email,
    phone: localUser.phone,
    profileIcon: localUser.profileIcon,
    role: localUser.role,
    isVerified: localUser.isVerified,
    isFirstOrder: localUser.isFirstOrder,
    wishlist: localUser.wishlist,
    createdAt: localUser.createdAt,
    shopifyCustomerId: localUser.shopifyCustomerId,
    shopifyAccountUrl: localUser.shopifyCustomerId
      ? `https://shopify.com/100271948085/account/customer/${localUser.shopifyCustomerId}`
      : null,
  };

  res.status(200).json({ success: true, user });
});

/**
 * @desc   Update profile (fullName, phone, profileIcon)
 * @route  PUT /api/v1/user/profile
 * @access AUTH
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, profileIcon } = req.body;
  const localUser = req.user;

  const updates = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (phone !== undefined) updates.phone = phone;
  if (profileIcon !== undefined) updates.profileIcon = profileIcon;

  const updatedLocalUser = await User.findByIdAndUpdate(
    localUser._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-passwordHash -refreshToken');

  res.status(200).json({ success: true, user: updatedLocalUser });
});

/**
 * @desc   Get all saved addresses for the logged-in user
 * @route  GET /api/v1/user/addresses
 * @access AUTH
 */
const getAddresses = asyncHandler(async (req, res) => {
  // For now, return empty array - addresses will be managed locally
  // Can be extended to sync with Shopify later if needed
  res.status(200).json({ success: true, addresses: [] });
});

/**
 * @desc   Add a new address
 * @route  POST /api/v1/user/addresses
 * @access AUTH
 */
const addAddress = asyncHandler(async (req, res) => {
  // For now, addresses will be managed locally
  // Can be extended to sync with Shopify later if needed
  res.status(501).json({ success: false, message: 'Address management not implemented yet' });
});

/**
 * @desc   Update an address
 * @route  PUT /api/v1/user/addresses/:addressId
 * @access AUTH
 */
const updateAddress = asyncHandler(async (req, res) => {
  // For now, addresses will be managed locally
  // Can be extended to sync with Shopify later if needed
  res.status(501).json({ success: false, message: 'Address management not implemented yet' });
});

/**
 * @desc   Delete an address
 * @route  DELETE /api/v1/user/addresses/:addressId
 * @access AUTH
 */
const deleteAddress = asyncHandler(async (req, res) => {
  // For now, addresses will be managed locally
  // Can be extended to sync with Shopify later if needed
  res.status(501).json({ success: false, message: 'Address management not implemented yet' });
});

/**
 * @desc   Set an address as the default
 * @route  PUT /api/v1/user/addresses/:addressId/set-default
 * @access AUTH
 */
const setDefaultAddress = asyncHandler(async (req, res) => {
  // For now, addresses will be managed locally
  // Can be extended to sync with Shopify later if needed
  res.status(501).json({ success: false, message: 'Address management not implemented yet' });
});

/**
 * @desc   Get Shopify customer orders
 * @route  GET /api/v1/user/shopify-orders
 * @access AUTH
 */
const getShopifyOrders = asyncHandler(async (req, res) => {
  const localUser = req.user;

  if (!localUser.shopifyCustomerId) {
    return res.status(200).json({ success: true, orders: [] });
  }

  try {
    const orders = await getCustomerOrders(localUser.shopifyCustomerId);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching Shopify orders:', error.message);
    res.status(200).json({ success: true, orders: [] });
  }
});

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getShopifyOrders,
};

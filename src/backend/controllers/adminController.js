const { User } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const { getOrders } = require('../services/shopify/orders');

/**
 * @desc   Admin dashboard summary stats
 * @route  GET /api/v1/admin/stats
 * @access ADMIN
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalCustomers,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
  ]);

  // Fetch some orders from Shopify to populate basic stats if possible
  let totalOrders = 0;
  let totalRevenue = 0;
  let recentOrders = [];

  try {
    const shopifyOrders = await getOrders(20);
    totalOrders = shopifyOrders.length;
    recentOrders = shopifyOrders.map(order => ({
      _id: order.id,
      orderId: order.name,
      totalAmount: parseFloat(order.totalPriceSet?.shopMoney?.amount || '0'),
      paymentStatus: order.financialStatus === 'paid' ? 'Paid' : 'Pending',
      orderStatus: order.fulfillmentStatus === 'fulfilled' ? 'Delivered' : 'Pending',
      createdAt: order.createdAt,
      email: order.email,
    }));

    totalRevenue = recentOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  } catch (err) {
    console.error('Failed to fetch Shopify orders for admin stats:', err);
  }

  res.status(200).json({
    success: true,
    totalOrders,
    totalRevenue,
    totalCustomers,
    pendingOrders: 0,
    lowStockVariants: [],
    recentOrders,
  });
});

/**
 * @desc   List all customers with optional search (paginated)
 * @route  GET /api/v1/admin/users
 * @access ADMIN
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = { role: 'customer' };

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email:    { $regex: search, $options: 'i' } },
      { phone:    { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-passwordHash -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, users, total });
});

/**
 * @desc   Get specific user with their order history
 * @route  GET /api/v1/admin/users/:userId
 * @access ADMIN
 */
const getUserDetail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
    .select('-passwordHash -refreshToken')
    .populate('addresses');

  if (!user) { res.status(404); throw new Error('User not found'); }

  let orders = [];
  try {
    const shopifyOrders = await getOrders(50, user.email);
    orders = shopifyOrders.map(order => ({
      _id: order.id,
      orderId: order.name,
      totalAmount: parseFloat(order.totalPriceSet?.shopMoney?.amount || '0'),
      paymentStatus: order.financialStatus === 'paid' ? 'Paid' : 'Pending',
      orderStatus: order.fulfillmentStatus === 'fulfilled' ? 'Delivered' : 'Pending',
      createdAt: order.createdAt,
    }));
  } catch (err) {
    console.error(`Failed to fetch Shopify orders for user ${user.email}:`, err);
  }

  res.status(200).json({ success: true, user, orders });
});

module.exports = { getDashboardStats, getAllUsers, getUserDetail };

const ReturnRequest = require('../models/ReturnRequest');
const asyncHandler = require('../middleware/asyncHandler');
const { getOrderByName } = require('../services/shopify/orderLookup');

exports.createReturnRequest = asyncHandler(async (req, res) => {
  const { orderId, requestType, reason } = req.body;

  if (!orderId || !requestType || !reason) {
    res.status(400);
    throw new Error('Please provide orderId, requestType, and reason');
  }

  const order = await getOrderByName(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const item = order.items[0];

  const returnReq = await ReturnRequest.create({
    orderId,
    productName: item ? item.productName : 'Unknown Product',
    size: item ? item.size : '',
    requestType,
    reason
  });

  res.status(201).json({ success: true, returnRequest: returnReq });
});

exports.getReturnRequests = asyncHandler(async (req, res) => {
  const requests = await ReturnRequest.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: requests.length, returns: requests });
});

exports.updateReturnRequest = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  let returnReq = await ReturnRequest.findById(req.params.id);

  if (!returnReq) {
    res.status(404);
    throw new Error('Return request not found');
  }

  if (status) returnReq.status = status;
  if (adminNotes !== undefined) returnReq.adminNotes = adminNotes;

  await returnReq.save();
  res.status(200).json({ success: true, returnRequest: returnReq });
});

exports.getOrderByOrderId = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await getOrderByName(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.status(200).json({ success: true, order });
});

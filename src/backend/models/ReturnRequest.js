const mongoose = require('mongoose');

const ReturnRequestSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      trim: true,
    },
    productName: {
      type: String,
      required: [true, 'Product Name is required'],
    },
    size: {
      type: String,
    },
    requestType: {
      type: String,
      enum: ['Return', 'Exchange'],
      required: [true, 'Request Type is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
      default: 'Pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

ReturnRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.models.ReturnRequest || mongoose.model('ReturnRequest', ReturnRequestSchema);

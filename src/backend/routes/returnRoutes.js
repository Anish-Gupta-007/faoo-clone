const express = require('express');
const { createReturnRequest, getReturnRequests, updateReturnRequest, getOrderByOrderId } = require('../controllers/returnController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', createReturnRequest);
router.get('/order/:orderId', getOrderByOrderId);
router.get('/', authMiddleware, adminMiddleware, getReturnRequests);
router.put('/:id', authMiddleware, adminMiddleware, updateReturnRequest);

module.exports = router;

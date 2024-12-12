const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);

// Protected routes - cần đăng nhập
router.post('/', auth.verifyToken, orderController.createOrder);
router.put('/:id/status', auth.verifyToken, orderController.updateOrderStatus);
router.put('/:id/payment', auth.verifyToken, orderController.updatePaymentStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Route công khai cho việc đặt món
router.post('/create', orderController.createOrder);

// Route để lấy danh sách đơn hàng (cần xác thực)
router.get('/', auth.verifyToken, orderController.getAllOrders);

// Route để lấy chi tiết đơn hàng (cần xác thực)
router.get('/:id', auth.verifyToken, orderController.getOrderById);

// Đường dẫn phải khớp với frontend
router.put('/:id/status', auth.verifyToken, orderController.updateOrderStatus); // Bỏ /api/orders/

module.exports = router;
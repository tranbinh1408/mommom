const express = require('express');
const router = express.Router();
const takeawayOrderController = require('../controllers/takeawayOrderController');
const { verifyToken } = require('../middleware/auth');

// Route công khai cho việc đặt món mang về
router.post('/create', takeawayOrderController.createOrder);

// Routes cần xác thực
router.get('/', verifyToken, takeawayOrderController.getAllOrders);
router.get('/:id', verifyToken, takeawayOrderController.getOrderById);
router.put('/:id/status', verifyToken, takeawayOrderController.updateOrderStatus);
router.delete('/:id', verifyToken, takeawayOrderController.deleteOrder);
router.put('/:id', verifyToken, takeawayOrderController.updateOrder);
router.get('/details/:id', verifyToken, takeawayOrderController.getOrderDetails);

module.exports = router; 
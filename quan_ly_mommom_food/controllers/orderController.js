const Order = require('../models/orderModel');

const orderController = {
  // Tạo đơn hàng mới
  createOrder: async (req, res) => {
    try {
      const orderData = {
        customer_name: req.body.customerName,
        customer_phone: req.body.customerPhone,
        customer_email: req.body.customerEmail,
        table_id: req.body.tableId,
        staff_id: req.user.id, // Lấy từ token
        total_amount: req.body.totalAmount,
        payment_method: req.body.paymentMethod,
        note: req.body.note,
        items: req.body.items
      };

      const orderId = await Order.create(orderData);
      
      res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công',
        data: { orderId }
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo đơn hàng',
        error: error.message
      });
    }
  },

  // Lấy danh sách đơn hàng
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.findAll();
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đơn hàng',
        error: error.message
      });
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin đơn hàng',
        error: error.message
      });
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái đơn hàng không hợp lệ'
        });
      }

      const updated = await Order.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công'
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái đơn hàng',
        error: error.message
      });
    }
  },

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      // Validate payment status
      const validPaymentStatuses = ['pending', 'paid', 'failed'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái thanh toán không hợp lệ'
        });
      }

      const updated = await Order.updatePaymentStatus(id, paymentStatus);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái thanh toán thành công'
      });
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái thanh toán',
        error: error.message
      });
    }
  }
};

module.exports = orderController;

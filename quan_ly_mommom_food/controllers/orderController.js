const db = require('../config/database');

const orderController = {
  // Tạo đơn hàng mới
  createOrder: async (req, res) => {
    try {
      const { items, total_amount } = req.body;
      console.log('Received order data:', req.body); // Debug log

      // Kiểm tra dữ liệu đầu vào
      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Giỏ hàng trống'
        });
      }

      // Tạo đơn hàng mới
      const [orderResult] = await db.query(
        `INSERT INTO Orders (
          total_amount,
          status,
          payment_status,
          created_at,
          updated_at
        ) VALUES (?, 'pending', 'pending', NOW(), NOW())`,
        [total_amount]
      );

      const orderId = orderResult.insertId;

      // Thêm chi tiết đơn hàng
      for (const item of items) {
        await db.query(
          `INSERT INTO OrderDetails (
            order_id,
            product_id,
            quantity,
            unit_price
          ) VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price]
        );
      }

      res.status(201).json({
        success: true,
        message: 'Đặt món thành công',
        data: { orderId }
      });

    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo đơn hàng'
      });
    }
  },

  // Lấy danh sách đơn hàng
  getAllOrders: async (req, res) => {
    try {
      const [orders] = await db.query(`
        SELECT o.*, t.table_number 
        FROM Orders o
        LEFT JOIN Tables t ON o.table_id = t.table_id
        ORDER BY o.created_at DESC
      `);

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đơn hàng'
      });
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;

      const [orders] = await db.query(`
        SELECT o.*, t.table_number 
        FROM Orders o
        LEFT JOIN Tables t ON o.table_id = t.table_id
        WHERE o.order_id = ?
      `, [id]);

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      // Lấy chi tiết các món trong đơn hàng
      const [orderDetails] = await db.query(`
        SELECT od.*, p.name as product_name
        FROM OrderDetails od
        JOIN Products p ON od.product_id = p.product_id
        WHERE od.order_id = ?
      `, [id]);

      res.json({
        success: true,
        data: {
          ...orders[0],
          items: orderDetails
        }
      });

    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin đơn hàng'
      });
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái đơn hàng không hợp lệ'
        });
      }

      const [result] = await db.query(
        'UPDATE Orders SET status = ?, updated_at = NOW() WHERE order_id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
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
        message: 'Lỗi khi cập nhật trạng thái đơn hàng'
      });
    }
  }
};

module.exports = orderController;

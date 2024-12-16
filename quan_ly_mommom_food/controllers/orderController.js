const db = require('../config/database');

const orderController = {
  // Tạo đơn hàng mới
  createOrder: async (req, res) => {
    try {
      const { items, total_amount } = req.body;
      console.log('Received order data:', { items, total_amount });

      // Validate items array
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Giỏ hàng không hợp lệ'
        });
      }

      // Start transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Create order
        const [orderResult] = await connection.query(
          `INSERT INTO Orders (
            total_amount,
            status,
            payment_method,
            payment_status,
            created_at,
            updated_at
          ) VALUES (?, 'created', 'cash', 'pending', NOW(), NOW())`,
          [Number(total_amount) || 0]
        );

        const orderId = orderResult.insertId;

        // Insert order details
        for (const item of items) {
          await connection.query(
            `INSERT INTO OrderDetails (
              order_id,
              product_id,
              quantity,
              unit_price
            ) VALUES (?, ?, ?, ?)`,

            [
              orderId,
              Number(item.product_id),
              Number(item.quantity),
              Number(item.unit_price)
            ]
          );
        }

        await connection.commit();

        res.status(201).json({
          success: true,
          message: 'Đặt món thành công',
          data: { orderId }
        });

      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }

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

      // Update lại danh sách trạng thái hợp lệ
      const validStatuses = ['created', 'confirmed', 'completed'];
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

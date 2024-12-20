const db = require('../config/database');

const takeawayOrderController = {
  createOrder: async (req, res) => {
    console.log('Received takeaway order data:', req.body);
    try {
      const { items, customer_name, customer_phone, address, total_amount } = req.body;

      // Validate required fields
      if (!items || !items.length || !customer_name || !customer_phone || !address) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        });
      }

      // Start transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Create order
        const [orderResult] = await connection.query(
          `INSERT INTO Orders (
            customer_name,
            customer_phone,
            address,
            total_amount,
            status,
            payment_method,
            payment_status,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, 'created', 'cash', 'pending', NOW(), NOW())`,
          [customer_name, customer_phone, address, Number(total_amount) || 0]
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
          message: 'Đặt món mang về thành công',
          data: { orderId }
        });

      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }

    } catch (error) {
      console.error('Create takeaway order error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo đơn hàng mang về',
        error: error.message
      });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const [orders] = await db.query(`
        SELECT 
          o.*,
          GROUP_CONCAT(p.name) as product_names,
          GROUP_CONCAT(od.quantity) as quantities
        FROM Orders o
        LEFT JOIN OrderDetails od ON o.order_id = od.order_id
        LEFT JOIN Products p ON od.product_id = p.product_id
        WHERE o.table_id IS NULL
        GROUP BY o.order_id
        ORDER BY o.created_at DESC
      `);

      const formattedOrders = orders.map(order => ({
        ...order,
        items: order.product_names?.split(',').map((name, index) => ({
          name,
          quantity: parseInt(order.quantities?.split(',')[index] || 0)
        })) || []
      }));

      res.json({
        success: true,
        data: formattedOrders
      });
    } catch (error) {
      console.error('Get takeaway orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đơn hàng mang về'
      });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const [order] = await db.query(`
        SELECT o.*, od.product_id, p.name, od.quantity, od.unit_price
        FROM Orders o
        LEFT JOIN OrderDetails od ON o.order_id = od.order_id
        LEFT JOIN Products p ON od.product_id = p.product_id
        WHERE o.order_id = ? AND o.table_id IS NULL
      `, [id]);

      if (!order.length) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      res.json({
        success: true,
        data: {
          ...order[0],
          items: order.map(item => ({
            product_id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price
          }))
        }
      });
    } catch (error) {
      console.error('Get order details error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết đơn hàng'
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    let connection;
    try {
      const { id } = req.params;
      const { status } = req.body;
      console.log('Update request:', { id, status });

      connection = await db.getConnection();
      await connection.beginTransaction();

      const [result] = await connection.query(
        'UPDATE Orders SET status = ?, updated_at = NOW() WHERE order_id = ? AND table_id IS NULL',
        [status, id]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy đơn hàng mang về với ID ${id}`
        });
      }

      await connection.commit();
      return res.json({
        success: true,
        message: 'Cập nhật trạng thái thành công'
      });

    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Update status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái đơn hàng',
        error: error.message
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Xóa chi tiết đơn hàng
        await connection.query('DELETE FROM OrderDetails WHERE order_id = ?', [id]);
        
        // Xóa đơn hàng
        const [result] = await connection.query(
          'DELETE FROM Orders WHERE order_id = ? AND table_id IS NULL',
          [id]
        );

        if (result.affectedRows === 0) {
          await connection.rollback();
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy đơn hàng'
          });
        }

        await connection.commit();
        res.json({
          success: true,
          message: 'Xóa đơn hàng thành công'
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa đơn hàng'
      });
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const [details] = await db.query(`
        SELECT 
          od.*,
          p.name as product_name,
          p.price as product_price
        FROM OrderDetails od
        JOIN Products p ON od.product_id = p.product_id
        WHERE od.order_id = ?
      `, [id]);

      res.json({
        success: true,
        data: details
      });
    } catch (error) {
      console.error('Get order details error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết đơn hàng'
      });
    }
  },

  updateOrder: async (req, res) => {
    let connection;
    try {
      const { id } = req.params;
      const { items, customer_name, customer_phone, address, total_amount } = req.body;

      // Validate required fields
      if (!items || !items.length || !customer_name || !customer_phone || !address) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        });
      }

      connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Update order information
        const [orderResult] = await connection.query(
          `UPDATE Orders 
           SET customer_name = ?,
               customer_phone = ?,
               address = ?,
               total_amount = ?,
               updated_at = NOW()
           WHERE order_id = ? AND table_id IS NULL`,
          [customer_name, customer_phone, address, total_amount, id]
        );

        if (orderResult.affectedRows === 0) {
          throw new Error('Không tìm thấy đơn hàng');
        }

        // Delete old order details
        await connection.query('DELETE FROM OrderDetails WHERE order_id = ?', [id]);

        // Insert new order details
        for (const item of items) {
          await connection.query(
            `INSERT INTO OrderDetails (
              order_id,
              product_id,
              quantity,
              unit_price
            ) VALUES (?, ?, ?, ?)`,
            [id, item.product_id, item.quantity, item.unit_price]
          );
        }

        await connection.commit();
        res.json({
          success: true,
          message: 'Cập nhật đơn hàng thành công'
        });

      } catch (error) {
        await connection.rollback();
        throw error;
      }

    } catch (error) {
      console.error('Update order error:', error);
      res.status(error.message === 'Không tìm thấy đơn hàng' ? 404 : 500).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật đơn hàng'
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
};

module.exports = takeawayOrderController; 
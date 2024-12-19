const db = require('../config/database');

const createOrder = async (req, res) => {
  console.log('Received order data:', req.body); // Debug log
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
};

const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  try {
    // Updated query to include product name
    const [orderDetails] = await db.query(
      `SELECT 
        o.*,
        od.quantity,
        od.unit_price,
        p.name as product_name,
        p.product_id
      FROM Orders o
      JOIN OrderDetails od ON o.order_id = od.order_id
      JOIN Products p ON od.product_id = p.product_id
      WHERE o.order_id = ?`,
      [orderId]
    );

    if (orderDetails && orderDetails.length > 0) {
      const order = {
        ...orderDetails[0],
        order_details: orderDetails.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name, // Include product name
          quantity: item.quantity,
          unit_price: item.unit_price
        }))
      };

      res.json({
        success: true,
        data: order
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết đơn hàng'
    });
  }
};

const orderController = {
  // Tạo đơn hàng mới
  createOrder,

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

      // Sửa câu query để lấy thêm thông tin sản phẩm
      const [orders] = await db.query(`
        SELECT 
          o.*,
          t.table_number,
          od.quantity,
          od.unit_price,
          p.name as product_name,
          p.product_id
        FROM Orders o
        LEFT JOIN Tables t ON o.table_id = t.table_id
        LEFT JOIN OrderDetails od ON o.order_id = od.order_id 
        LEFT JOIN Products p ON od.product_id = p.product_id
        WHERE o.order_id = ?
      `, [id]);

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      // Định dạng lại dữ liệu trả về
      const orderDetails = orders.map(item => ({
        name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price
      }));

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
    let connection;
    try {
      const { id } = req.params;
      const { status } = req.body;
      console.log('Update request:', { id, status });

      // Get connection from pool
      connection = await db.getConnection();
      await connection.beginTransaction();

      const [result] = await connection.query(
        'UPDATE Orders SET status = ?, updated_at = NOW() WHERE order_id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy đơn hàng với ID ${id}`
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

  // Xóa đơn hàng
  deleteOrder: async (req, res) => {
    let connection;
    try {
      const { id } = req.params;
      
      connection = await db.getConnection();
      await connection.beginTransaction();

      // Delete from OrderDetails first (due to foreign key constraint)
      await connection.query(
        'DELETE FROM OrderDetails WHERE order_id = ?',
        [id]
      );

      // Then delete from Orders
      const [result] = await connection.query(
        'DELETE FROM Orders WHERE order_id = ?',
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
      return res.json({
        success: true,
        message: 'Xóa đơn hàng thành công'
      });

    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Delete order error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa đơn hàng',
        error: error.message
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderDetails
};

module.exports = orderController;

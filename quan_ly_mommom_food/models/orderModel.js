const db = require('../config/database');

class Order {
  static async create(orderData) {
    try {
      // Bắt đầu transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Tạo đơn hàng
        const [order] = await connection.execute(
          `INSERT INTO Orders (
            customer_name, customer_phone, customer_email,
            table_id, staff_id, total_amount,
            status, payment_method, payment_status, note
          ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, 'pending', ?)`,
          [
            orderData.customer_name,
            orderData.customer_phone,
            orderData.customer_email,
            orderData.table_id,
            orderData.staff_id,
            orderData.total_amount,
            orderData.payment_method,
            orderData.note
          ]
        );

        const orderId = order.insertId;

        // Thêm chi tiết đơn hàng
        for (const item of orderData.items) {
          await connection.execute(
            `INSERT INTO OrderDetails (
              order_id, product_id, quantity,
              unit_price, subtotal, note
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              item.productId,
              item.quantity,
              item.unitPrice,
              item.quantity * item.unitPrice,
              item.note
            ]
          );
        }

        // Cập nhật trạng thái bàn nếu có
        if (orderData.table_id) {
          await connection.execute(
            'UPDATE Tables SET status = ? WHERE table_id = ?',
            ['occupied', orderData.table_id]
          );
        }

        // Commit transaction
        await connection.commit();
        return orderId;
      } catch (error) {
        // Rollback nếu có lỗi
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [orders] = await db.execute(`
        SELECT o.*,
               GROUP_CONCAT(
                 CONCAT(p.name, ' (x', od.quantity, ')')
                 SEPARATOR ', '
               ) as items
        FROM Orders o
        LEFT JOIN OrderDetails od ON o.order_id = od.order_id
        LEFT JOIN Products p ON od.product_id = p.product_id
        GROUP BY o.order_id
        ORDER BY o.created_at DESC
      `);
      return orders;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      // Lấy thông tin đơn hàng
      const [orders] = await db.execute(`
        SELECT o.*,
               t.table_number,
               u.username as staff_name
        FROM Orders o
        LEFT JOIN Tables t ON o.table_id = t.table_id
        LEFT JOIN Users u ON o.staff_id = u.user_id
        WHERE o.order_id = ?
      `, [id]);

      if (orders.length === 0) return null;

      // Lấy chi tiết đơn hàng
      const [orderDetails] = await db.execute(`
        SELECT od.*,
               p.name as product_name,
               p.image_url
        FROM OrderDetails od
        JOIN Products p ON od.product_id = p.product_id
        WHERE od.order_id = ?
      `, [id]);

      // Kết hợp thông tin
      const order = {
        ...orders[0],
        items: orderDetails
      };

      return order;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await db.execute(
        'UPDATE Orders SET status = ? WHERE order_id = ?',
        [status, id]
      );

      // Nếu đơn hàng hoàn thành hoặc hủy, cập nhật trạng thái bàn
      if (result.affectedRows > 0 && (status === 'completed' || status === 'cancelled')) {
        await db.execute(`
          UPDATE Tables t
          JOIN Orders o ON t.table_id = o.table_id
          SET t.status = 'available'
          WHERE o.order_id = ?
        `, [id]);
      }

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updatePaymentStatus(id, paymentStatus) {
    try {
      const [result] = await db.execute(
        'UPDATE Orders SET payment_status = ? WHERE order_id = ?',
        [paymentStatus, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Order;

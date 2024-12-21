const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Lấy số lượng các mục
    const [products] = await connection.query('SELECT COUNT(*) as count FROM Products');
    const [orders] = await connection.query('SELECT MAX(order_id) as count FROM Orders');
    const [tables] = await connection.query('SELECT COUNT(*) as count FROM Tables');
    const [users] = await connection.query('SELECT COUNT(*) as count FROM Users');
    
    // Lấy đơn hàng gần đây
    const [recentOrders] = await connection.query(
      `SELECT order_id, customer_name, total_amount, status 
       FROM Orders 
       ORDER BY created_at DESC 
       LIMIT 5`
    );
    
    // Lấy doanh thu theo ngày (7 ngày gần nhất)
    const [dailyRevenue] = await connection.query(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as total
      FROM Orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Thêm query để lấy số lượng đơn hàng theo trạng thái
    const [ordersByStatus] = await connection.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM Orders
      GROUP BY status
    `);

    connection.release();
    
    res.json({
      products: products[0].count,
      orders: orders[0].count || 0,
      tables: tables[0].count,
      users: users[0].count,
      recentOrders,
      dailyRevenue,
      ordersByStatus
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thống kê' });
  }
});

module.exports = router;
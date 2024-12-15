import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Fetch orders error:', error);
      if (error.response && error.response.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        window.location.href = '/admin/login';
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: newStatus },
        config
      );
      fetchOrders(); // Refresh danh sách
    } catch (error) {
      console.error('Update status error:', error);
      alert('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  return (
    <div className="orders-page">
      <h2>Quản lý đơn hàng</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.order_id} className="order-card">
            <div className="order-header">
              <h3>Đơn hàng #{order.order_id}</h3>
              <span className={`status ${order.status}`}>{order.status}</span>
            </div>
            <div className="order-info">
              <p>Khách hàng: {order.customer_name}</p>
              <p>SĐT: {order.customer_phone}</p>
              <p>Tổng tiền: ${order.total_amount}</p>
              <p>Thời gian: {new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div className="order-items">
              {order.items.map(item => (
                <div key={item.product_id} className="order-item">
                  <span>{item.quantity}x {item.product_name}</span>
                  <span>${item.unit_price}</span>
                </div>
              ))}
            </div>
            <div className="order-actions">
              <select 
                value={order.status}
                onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="preparing">Đang chuẩn bị</option>
                <option value="ready">Sẵn sàng</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
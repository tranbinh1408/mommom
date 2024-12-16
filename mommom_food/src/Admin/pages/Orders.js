import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Định nghĩa labels cho các trạng thái
  const STATUS_LABELS = {
    created: 'Chờ xác nhận',
    completed: 'Hoàn thành'
  };

  const PAYMENT_STATUS_LABELS = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thất bại'
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      // Fetch chi tiết cho mỗi đơn hàng
      const ordersWithDetails = await Promise.all(
        response.data.data.map(async (order) => {
          const details = await fetchOrderDetails(order.order_id);
          return { ...order, details };
        })
      );

      setOrders(ordersWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchOrders(); // Refresh list after update
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-page">
      <h2>Quản lý đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Món</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td>#{order.order_id}</td>
                <td>
                  <div>{order.customer_name || 'Khách vãng lai'}</div>
                  <div>{order.customer_phone || 'Không có SĐT'}</div>
                </td>
                <td>
                  {order.details?.items?.map(item => (
                    <div key={item.product_id}>
                      {item.product_name} x {item.quantity} ({formatCurrency(item.unit_price)})
                    </div>
                  )) || 'Đang tải...'}
                </td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td>
                  <div className={`status ${order.status}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </div>
                  <div className={`payment-status ${order.payment_status}`}>
                    {PAYMENT_STATUS_LABELS[order.payment_status] || order.payment_status}
                  </div>
                </td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                    className={`status-select ${order.status}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
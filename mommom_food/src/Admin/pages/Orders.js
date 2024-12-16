import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const Orders = ({ api, fetchData }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});

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
        `http://localhost:5000/api/orders/${orderId}`, // Sửa URL
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

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const detailsPromises = orders.map(order => 
          api.get(`/api/orders/${order.order_id}`)
        );
        const details = await Promise.all(detailsPromises);
        const detailsMap = {};
        details.forEach(response => {
          if (response.data.success) {
            detailsMap[response.data.data.order_id] = response.data.data;
          }
        });
        setOrderDetails(detailsMap);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
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
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₫', '000đ');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-container">
      <h2>Quản lý đơn hàng</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Thông tin khách hàng</th>
            <th>Chi tiết đơn hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const details = order.details || {};
            const items = details.items || [];
            
            return (
              <tr key={order.order_id}>
                <td>ĐH{order.order_id.toString().padStart(4, '0')}</td>
                <td>
                  <div>
                    <strong>Tên:</strong> {order.customer_name || 'Không có thông tin'}
                  </div>
                  <div>
                    <strong>SĐT:</strong> {order.customer_phone || 'Không có thông tin'}
                  </div>
                  <div>
                    <strong>Email:</strong> {order.customer_email || 'Không có thông tin'}
                  </div>
                </td>
                <td className="order-items">
                  {items && items.length > 0 ? (
                    items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x {item.quantity}</span>
                        </div>
                        <span className="item-price">{formatCurrency(item.unit_price)}</span>
                      </div>
                    ))
                  ) : (
                    <div>Đang tải thông tin món...</div>
                  )}
                </td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td>
                  <div className={`status ${order.status}`}>
                    {STATUS_LABELS[order.status]}
                  </div>
                  <div className={`payment-status ${order.payment_status}`}>
                    {PAYMENT_STATUS_LABELS[order.payment_status]}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Orders.propTypes = {
  api: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired
};

export default Orders;
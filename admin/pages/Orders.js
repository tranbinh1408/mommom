import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Lấy danh sách đơn hàng
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Không thể tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchOrders();
    } catch (error) {
      setError('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  // Xem chi tiết đơn hàng
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-page">
      <h1>Quản lý đơn hàng</h1>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Bàn</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer_name}</td>
                <td>Bàn {order.table_number}</td>
                <td>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(order.total_amount)}
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className={`status-select ${order.status}`}
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="preparing">Đang chuẩn bị</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => handleViewDetails(order)}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
            <div className="order-info">
              <p><strong>Khách hàng:</strong> {selectedOrder.customer_name}</p>
              <p><strong>Số điện thoại:</strong> {selectedOrder.customer_phone}</p>
              <p><strong>Bàn:</strong> {selectedOrder.table_number}</p>
              <p><strong>Thời gian:</strong> {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p>
              <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            </div>
            
            <div className="order-items">
              <h3>Các món đã đặt</h3>
              <table>
                <thead>
                  <tr>
                    <th>Tên món</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map(item => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(item.unit_price)}
                      </td>
                      <td>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(item.quantity * item.unit_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-total">
              <h3>Tổng cộng: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(selectedOrder.total_amount)}</h3>
            </div>

            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

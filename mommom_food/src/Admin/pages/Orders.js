import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const Orders = ({ api, fetchData }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});

  // Thêm state cho modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // Định nghĩa labels cho các trạng thái
  const STATUS_LABELS = {
    created: 'Chờ xác nhận',
    confirmed: 'Chờ thanh toán',
    completed: 'Đã thanh toán'  // Sửa text hiển thị
  };

  const PAYMENT_STATUS_LABELS = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thất bại'
  };

  // Sửa lại hàm fetchOrderDetails
  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Fetching order:', orderId); // Debug log
      
      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Order API response:', response.data); // Debug log
      
      if (response.data.success && response.data.data) {
        const orderData = response.data.data;
        console.log('Processed order data:', orderData); // Debug log
        return orderData;
      }
      return null;
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

  // Orders.js - Sửa lại hàm updateOrderStatus
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Updating order:', orderId, 'to status:', newStatus);

      // Sửa lại API call
      const response = await axios({
        method: 'PUT',
        url: `http://localhost:5000/api/orders/${orderId}/status`,
        data: { status: newStatus },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Update response:', response.data); // Debug log

      if (response.data.success) {
        await fetchOrders(); // Refresh list
        return true;
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      console.error('Error updating order:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert('Không thể cập nhật trạng thái đơn hàng: ' + errorMessage);
      return false;
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

  // Sửa lại hàm mở modal
  const openDetailModal = async (order) => {
    const details = await fetchOrderDetails(order.order_id);
    console.log('Selected order details:', details); // Debug log
    setSelectedOrderDetail({ 
      ...order,
      details: details?.items || [] // Ensure items is an array
    });
    setShowDetailModal(true);
  };

  // Sửa lại phần OrderDetailModal
  const OrderDetailModal = () => {
    if (!selectedOrderDetail) return null;
    
    console.log('Modal data:', selectedOrderDetail); // Debug log
    
    // Ensure items is always an array
    const items = selectedOrderDetail?.details || [];

    const handleComplete = async () => {
      try {
        const success = await updateOrderStatus(selectedOrderDetail.order_id, 'confirmed');
        if (success) {
          setShowDetailModal(false);
        }
      } catch (error) {
        console.error('Error completing order:', error);
      }
    };

    return (
      <div className="orders-modal">
        <div className="orders-modal-content">
          <div className="orders-modal-header">
            <h3>Chi tiết đơn hàng #{selectedOrderDetail.order_id}</h3>
            <button onClick={() => setShowDetailModal(false)}>&times;</button>
          </div>
          <div className="orders-modal-body">
            <div className="orders-customer-info">
              <h4>Thông tin khách hàng</h4>
              <p><strong>Tên:</strong> {selectedOrderDetail.customer_name || 'Không có thông tin'}</p>
              <p><strong>SĐT:</strong> {selectedOrderDetail.customer_phone || 'Không có thông tin'}</p>
              <p><strong>Email:</strong> {selectedOrderDetail.customer_email || 'Không có thông tin'}</p>
            </div>
            <div className="order-items">
              <h4>Món đã đặt</h4>
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
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.product_name || item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unit_price)}</td>
                        <td>{formatCurrency(item.unit_price * item.quantity)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{textAlign: 'center'}}>
                        Không có dữ liệu món ăn
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3"><strong>Tổng cộng:</strong></td>
                    <td><strong>{formatCurrency(selectedOrderDetail.total_amount)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="orders-modal-footer">
            {selectedOrderDetail.status === 'created' && (
              <button className="orders-btn orders-btn-complete" onClick={handleComplete}>
                Xong
              </button>
            )}
            <button 
              className="orders-btn orders-btn-close" 
              onClick={() => setShowDetailModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Orders.js - Update handleDelete function
  const handleDelete = async (orderId) => {
    // Find the order first
    const orderToDelete = orders.find(order => order.order_id === orderId);

    // Check if order exists and is completed
    if (!orderToDelete) {
      alert('Không tìm thấy đơn hàng');
      return;
    }

    if (orderToDelete.status !== 'completed') {
      alert('Chỉ có thể xóa đơn hàng đã hoàn thành thanh toán');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.delete(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setOrders(prevOrders => prevOrders.filter(order => order.order_id !== orderId));
        }
      } catch (error) {
        console.error('Delete order error:', error);
        alert('Không thể xóa đơn hàng');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Sửa lại phần render của bảng
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
                <td>
                  <button 
                    className="orders-view-detail"
                    onClick={() => openDetailModal(order)}
                  >
                    Xem chi tiết đơn hàng
                  </button>
                </td>
                <td>{formatCurrency(order.total_amount)}</td>
                <td>
                  <div className={`status ${order.status}`}>
                    {order.status === 'confirmed' ? 'Chờ thanh toán' : STATUS_LABELS[order.status]}
                  </div>
                </td>
                <td>
                  {order.status !== 'completed' ? (
                    <button
                      className="complete-btn"
                      onClick={() => updateOrderStatus(order.order_id, 'completed')}
                    >
                      Hoàn thành
                    </button>
                  ) : (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(order.order_id)}
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showDetailModal && <OrderDetailModal />}
    </div>
  );
};

Orders.propTypes = {
  api: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired
};

export default Orders;
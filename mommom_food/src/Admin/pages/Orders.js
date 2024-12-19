import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [products, setProducts] = useState([]);

  const STATUS_LABELS = {
    created: 'Chờ xác nhận',
    confirmed: 'Chờ thanh toán',
    completed: 'Đã thanh toán'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₫', '000đ');
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Không thể tải danh sách đơn hàng');
      setLoading(false);
    }
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

      console.log('Order details response:', response.data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  };

  const openDetailModal = async (order) => {
    try {
      const details = await fetchOrderDetails(order.order_id);
      if (details) {
        setSelectedOrderDetail({
          ...order,
          items: details.items || []
        });
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error('Error opening detail modal:', err);
      alert('Không thể tải chi tiết đơn hàng');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );

      if (response.data.success) {
        await fetchOrders();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Không thể cập nhật trạng thái đơn hàng');
    }
  };

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
          alert('Xóa đơn hàng thành công');
        }
      } catch (error) {
        console.error('Delete order error:', error);
        alert('Không thể xóa đơn hàng');
      }
    }
  };

  const handleEditOrder = async (orderId) => {
    try {
      // Lấy thông tin chi tiết đơn hàng
      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );

      if (response.data.success) {
        // Format dữ liệu để hiển thị trong modal
        const orderData = response.data.data;
        
        // Đảm bảo items có đầy đủ thông tin
        const formattedItems = orderData.items.map(item => ({
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price
        }));

        setEditingOrder({
          order_id: orderId,
          items: formattedItems
        });
        
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error getting order details:', error);
      alert('Không thể tải thông tin đơn hàng');
    }
  };

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      // Chỉ gửi các trường có trong database
      const orderData = {
        customer_name: updatedOrder.customer_name || null,
        customer_phone: updatedOrder.customer_phone || null,
        items: updatedOrder.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price
        }))
      };

      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `http://localhost:5000/api/orders/${updatedOrder.order_id}`,
        orderData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setShowEditModal(false);
        setEditingOrder(null);
        await fetchOrders();
        alert('Cập nhật đơn hàng thành công');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Không thể cập nhật đơn hàng: ' + error.response?.data?.message || error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (!editingOrder.items) {
      setEditingOrder({
        ...editingOrder,
        items: []
      });
    }
    setEditingOrder({
      ...editingOrder,
      items: [
        ...editingOrder.items,
        { product_id: '', name: '', quantity: 1, unit_price: 0 }
      ]
    });
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="orders-container">
      <h2>Quản lý đơn hàng</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Thông tin khách hàng</th>
            <th>Món đặt</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id}>
              <td>ĐH{order.order_id.toString().padStart(4, '0')}</td>
              <td>
                <div><strong>Tên:</strong> {order.customer_name || 'N/A'}</div>
                <div><strong>SĐT:</strong> {order.customer_phone || 'N/A'}</div>
                <div><strong>Email:</strong> {order.customer_email || 'N/A'}</div>
              </td>
              <td>
                {order.items?.map((item, idx) => (
                  <div key={idx}>{item.name}</div>
                ))}
              </td>
              <td>
                {order.items?.map((item, idx) => (
                  <div key={idx}>{item.quantity}</div>
                ))}
              </td>
              <td>{formatCurrency(order.total_amount)}</td>
              <td>
                <div className={`status ${order.status}`}>
                  {STATUS_LABELS[order.status]}
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditOrder(order.order_id)}
                  >
                    Chỉnh sửa
                  </button>
                  
                  {order.status === 'created' ? (
                    <button
                      className="complete-btn"
                      onClick={() => updateOrderStatus(order.order_id, 'completed')}
                    >
                      Hoàn thành
                    </button>
                  ) : order.status === 'completed' ? (
                    <button
                      className="pending-btn"
                      onClick={() => updateOrderStatus(order.order_id, 'created')}
                    >
                      Chờ xác nhận
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetailModal && selectedOrderDetail && (
        <div className="orders-modal">
          <div className="orders-modal-content">
            <div className="orders-modal-header">
              <h3>Chi tiết đơn hàng #{selectedOrderDetail.order_id}</h3>
              <button onClick={() => setShowDetailModal(false)}>&times;</button>
            </div>
            <div className="orders-modal-body">
              <div className="orders-customer-info">
                <h4>Thông tin khách hàng</h4>
                <p><strong>Tên:</strong> {selectedOrderDetail.customer_name || 'N/A'}</p>
                <p><strong>SĐT:</strong> {selectedOrderDetail.customer_phone || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedOrderDetail.customer_email || 'N/A'}</p>
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
                    {selectedOrderDetail.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unit_price)}</td>
                        <td>{formatCurrency(item.unit_price * item.quantity)}</td>
                      </tr>
                    ))}
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
              <button className="orders-btn orders-btn-close" onClick={() => setShowDetailModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingOrder && (
        <div className="orders-modal">
          <div className="orders-modal-content">
            <div className="orders-modal-header">
              <h3>Chỉnh sửa đơn hàng #{editingOrder.order_id}</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            
            <div className="orders-modal-body">
              <div className="order-items-list">
                <h4>Danh sách món:</h4>
                <div className="ordered-items">
                  {editingOrder.items?.map((item, index) => (
                    <div key={index} className="ordered-item">
                      <select 
                        value={item.product_id || ''}
                        onChange={(e) => {
                          const selectedProduct = products.find(p => p.product_id.toString() === e.target.value);
                          const newItems = [...editingOrder.items];
                          newItems[index] = {
                            ...newItems[index],
                            product_id: e.target.value,
                            name: selectedProduct ? selectedProduct.name : '',
                            unit_price: selectedProduct ? selectedProduct.price : 0
                          };
                          setEditingOrder({...editingOrder, items: newItems});
                        }}
                        className="product-select"
                      >
                        <option value="">Chọn món</option>
                        {products.map(product => (
                          <option 
                            key={product.product_id} 
                            value={product.product_id}
                          >
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        min="1"
                        onChange={(e) => {
                          const newItems = [...editingOrder.items];
                          newItems[index].quantity = parseInt(e.target.value) || 1;
                          setEditingOrder({...editingOrder, items: newItems});
                        }}
                        className="quantity-input"
                      />
                      <button 
                        className="remove-item-btn" 
                        onClick={() => {
                          const newItems = editingOrder.items.filter((_, idx) => idx !== index);
                          setEditingOrder({...editingOrder, items: newItems});
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button className="add-item-btn" onClick={() => {
                  const newItems = [...(editingOrder.items || []), { product_id: '', quantity: 1 }];
                  setEditingOrder({...editingOrder, items: newItems});
                }}>
                  Thêm món
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button className="save-btn" onClick={() => handleUpdateOrder(editingOrder)}>
                Lưu thay đổi
              </button>
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
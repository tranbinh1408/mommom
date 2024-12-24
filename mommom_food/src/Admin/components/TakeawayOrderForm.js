import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TakeawayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const STATUS_LABELS = {
    created: 'Chờ xác nhận',
    confirmed: 'Chờ thanh toán',
    completed: 'Đã thanh toán'
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 đồng';
    return `${amount.toLocaleString('vi-VN')} đồng`;
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://kind-trust-production.up.railway.app/api/takeaway-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Không thể tải danh sách đơn hàng mang về');
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://kind-trust-production.up.railway.app/api/products', {
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

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingOrder({
      items: [{ product_id: '', quantity: 1 }],
      customer_name: '',
      customer_phone: '',
      address: ''
    });
    setShowEditModal(true);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const product = products.find(p => p.product_id.toString() === item.product_id.toString());
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^0\d{9}$/;  // Bắt đầu bằng 0, theo sau là 9 chữ số
    return phoneRegex.test(phone);
  };

  const isValidName = (name) => {
    return name.trim().length >= 2;  // Tên phải có ít nhất 2 ký tự
  };

  const handleCreateOrder = async () => {
    try {
      if (!editingOrder.customer_name || !isValidName(editingOrder.customer_name)) {
        alert('Tên khách hàng phải có ít nhất 2 ký tự');
        return;
      }

      if (!editingOrder.customer_phone || !isValidPhoneNumber(editingOrder.customer_phone)) {
        alert('Số điện thoại không hợp lệ (phải có 10 chữ số và bắt đầu bằng số 0)');
        return;
      }

      if (!editingOrder.items.every(item => item.product_id && item.quantity)) {
        alert('Vui lòng chọn món và số lượng');
        return;
      }

      const orderData = {
        ...editingOrder,
        address: editingOrder.address || 'Mang về',
        items: editingOrder.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: products.find(p => p.product_id.toString() === item.product_id)?.price || 0
        })),
        total_amount: calculateTotal(editingOrder.items)
      };

      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        'https://kind-trust-production.up.railway.app/api/takeaway-orders/create',
        orderData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setShowEditModal(false);
        setEditingOrder(null);
        await fetchOrders();
        alert('Tạo đơn hàng mang về thành công');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Không thể tạo đơn hàng: ' + error.response?.data?.message || error.message);
    }
  };

  const handleEditOrder = async (order) => {
    try {
      setIsEditMode(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `https://kind-trust-production.up.railway.app/api/takeaway-orders/${order.order_id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setEditingOrder({
        ...response.data.data,
        items: response.data.data.items.map(item => ({
          product_id: item.product_id.toString(),
          quantity: item.quantity
        }))
      });
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Không thể lấy thông tin đơn hàng');
    }
  };

  const handleUpdateOrder = async () => {
    try {
      if (!editingOrder.customer_name || !isValidName(editingOrder.customer_name)) {
        alert('Tên khách hàng phải có ít nhất 2 ký tự');
        return;
      }

      if (!editingOrder.customer_phone || !isValidPhoneNumber(editingOrder.customer_phone)) {
        alert('Số điện thoại không hợp lệ (phải có 10 chữ số và bắt đầu bằng số 0)');
        return;
      }

      if (!editingOrder.items.every(item => item.product_id && item.quantity)) {
        alert('Vui lòng chọn món và số lượng');
        return;
      }

      const orderData = {
        ...editingOrder,
        address: editingOrder.address || 'Mang về',
        items: editingOrder.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: products.find(p => p.product_id.toString() === item.product_id)?.price || 0
        })),
        total_amount: calculateTotal(editingOrder.items)
      };

      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `https://kind-trust-production.up.railway.app/api/takeaway-orders/${editingOrder.order_id}`,
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

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.delete(
          `https://kind-trust-production.up.railway.app/api/takeaway-orders/${orderId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          await fetchOrders();
          alert('Xóa đơn hàng thành công');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Không thể xóa đơn hàng: ' + error.response?.data?.message || error.message);
      }
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `https://kind-trust-production.up.railway.app/api/takeaway-orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        await fetchOrders(); // Refresh danh sách đơn hàng
        alert('Cập nhật trạng thái thành công');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Không thể cập nhật trạng thái đơn hàng: ' + error.response?.data?.message || error.message);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name && order.customer_phone && order.address
  );

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="orders-container">
      <div className="products-header">
        <h2>Quản lý đơn hàng mang về</h2>
        <button className="products-add-btn" onClick={handleOpenModal}>
          Thêm đơn hàng mang về
        </button>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Thông tin khách hàng</th>
            <th>Địa chỉ</th>
            <th>Món đặt</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.order_id}>
              <td>ĐH{order.order_id.toString().padStart(4, '0')}</td>
              <td className="customer-info-cell">
                {order.customer_name && (
                  <div><strong>Tên:</strong> {order.customer_name}</div>
                )}
                {order.customer_phone && (
                  <div><strong>SĐT:</strong> {order.customer_phone}</div>
                )}
                {!order.customer_name && !order.customer_phone && (
                  <span className="empty-cell">Chưa có thông tin</span>
                )}
              </td>
              <td>{order.address}</td>
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
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEditOrder(order)}>
                    Chỉnh sửa
                  </button>
                  {order.status === 'created' ? (
                    <button 
                      className="status-btn confirm-btn"
                      onClick={() => handleUpdateStatus(order.order_id, 'completed')}
                    >
                      Xác nhận thanh toán
                    </button>
                  ) : (
                    <button 
                      className="status-btn return-btn"
                      onClick={() => handleUpdateStatus(order.order_id, 'created')}
                    >
                      Chờ xác nhận
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && (
        <div className="orders-modal">
          <div className="orders-modal-content">
            <div className="modal-header">
              <h3>{isEditMode ? 'Sửa đơn hàng mang về' : 'Thêm đơn hàng mang về'}</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <div className="orders-modal-body">
              <div className="customer-info">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Tên khách hàng"
                    value={editingOrder.customer_name || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, customer_name: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={editingOrder.customer_phone || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, customer_phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="order-items">
                {editingOrder.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <select
                      value={item.product_id}
                      onChange={(e) => {
                        const newItems = [...editingOrder.items];
                        newItems[index].product_id = e.target.value;
                        setEditingOrder({...editingOrder, items: newItems});
                      }}
                    >
                      <option value="">Chọn món</option>
                      {products.map(product => (
                        <option key={product.product_id} value={product.product_id}>
                          {product.name} - {formatCurrency(product.price)}
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...editingOrder.items];
                        newItems[index].quantity = parseInt(e.target.value) || 1;
                        setEditingOrder({...editingOrder, items: newItems});
                      }}
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
                
                <button className="add-item-btn" onClick={() => {
                  const newItems = [...editingOrder.items, { product_id: '', quantity: 1 }];
                  setEditingOrder({...editingOrder, items: newItems});
                }}>
                  Thêm món
                </button>

                <div className="order-total">
                  <h4>Tổng tiền: {formatCurrency(calculateTotal(editingOrder.items))}</h4>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="save-btn" 
                onClick={isEditMode ? handleUpdateOrder : handleCreateOrder}
              >
                {isEditMode ? 'Cập nhật đơn hàng' : 'Tạo đơn hàng'}
              </button>
              <button 
                className="cancel-btn" 
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeawayOrders; 
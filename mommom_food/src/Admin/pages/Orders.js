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
    if (!amount) return '0 đồng';
    return `${amount.toLocaleString('vi-VN')} đồng`;
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://kind-trust-production.up.railway.app/api/orders', {
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
        `https://kind-trust-production.up.railway.app/api/orders/${orderId}`,
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
        `https://kind-trust-production.up.railway.app/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        await fetchOrders();
        alert('Cập nhật trạng thái thành công');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
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
          `https://kind-trust-production.up.railway.app/api/orders/${orderId}`,
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
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `https://kind-trust-production.up.railway.app/api/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const orderData = response.data.data;
        setEditingOrder({
          order_id: orderId,
          items: orderData.items.map(item => ({
            product_id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price
          }))
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
      // Kiểm tra món ăn trùng nhau
      const productIds = updatedOrder.items.map(item => item.product_id);
      const hasDuplicates = productIds.length !== new Set(productIds).size;
      
      if (hasDuplicates) {
        alert('Không thể đặt món ăn trùng nhau');
        return;
      }

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
        `https://kind-trust-production.up.railway.app/api/orders/${updatedOrder.order_id}`,
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

  const handleOpenModal = () => {
    setEditingOrder({
      items: [{ product_id: '', quantity: 1 }]
    });
    setShowEditModal(true);
  };

  const handleCreateOrder = async () => {
    try {
      // Validate items
      if (!editingOrder.items?.length || editingOrder.items.some(item => !item.product_id)) {
        alert('Vui lòng chọn ít nhất một món');
        return;
      }

      const token = localStorage.getItem('adminToken');
      const total = calculateTotal(editingOrder.items); // Tính tổng tiền

      const orderData = {
        items: editingOrder.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: products.find(p => p.product_id === item.product_id)?.price || 0
        })),
        total_amount: total // Thêm tổng tiền vào dữ liệu gửi đi
      };

      const response = await axios.post(
        'https://kind-trust-production.up.railway.app/api/orders/create',
        orderData,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setShowEditModal(false);
        setEditingOrder(null);
        await fetchOrders();
        alert('Tạo đơn hàng thành công');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Không thể tạo đơn hàng: ' + error.response?.data?.message || error.message);
    }
  };

  // Thêm hàm tính tổng tiền
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const product = products.find(p => p.product_id.toString() === item.product_id.toString());
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  // Thêm hàm filter orders để chỉ lấy đơn không có thông tin khách hàng
  const filteredOrders = orders.filter(order => 
    !order.customer_name && !order.customer_phone
  );

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    
    // Tạo đối tượng Date từ timestamp
    const date = new Date(timestamp);
    
    // Thêm 7 giờ để chuyển sang múi giờ Việt Nam
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    
    // Format theo định dạng Việt Nam
    return vietnamTime.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false
    });
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="orders-container">
      <div className="products-header">
        <h2>Quản lý đơn hàng</h2>
        <button className="products-add-btn" onClick={handleOpenModal}>
          Thêm đơn hàng mới
        </button>
      </div>
      
      <table className="orders-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Món đặt</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Tạo lúc</th>
            <th>Cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.order_id}>
              <td>ĐH{order.order_id.toString().padStart(4, '0')}</td>
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
              <td>{formatCurrency(order.total_amount || 0)}</td>
              <td>
                <div className={`status ${order.status}`}>
                  {STATUS_LABELS[order.status]}
                </div>
              </td>
              <td>{formatDateTime(order.created_at)}</td>
              <td>{formatDateTime(order.updated_at)}</td>
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
              <h3>{editingOrder.order_id ? 'Chỉnh sửa đơn hàng #' + editingOrder.order_id : 'Thêm đơn hàng mới'}</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            
            <div className="orders-modal-body">
              <div className="order-items-list">
                <h4>Danh sách món:</h4>
                <div className="ordered-items">
                  {editingOrder?.items?.map((item, index) => (
                    <div key={index} className="ordered-item">
                      <select 
                        value={item.product_id}
                        onChange={(e) => {
                          const selectedProduct = products.find(p => p.product_id.toString() === e.target.value);
                          const newItems = [...editingOrder.items];
                          newItems[index] = {
                            ...newItems[index],
                            product_id: selectedProduct?.product_id || '',
                            name: selectedProduct?.name || '',
                            unit_price: selectedProduct?.price || 0,
                            quantity: item.quantity
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
                <div className="order-total">
                  <h4>Tổng tiền: {formatCurrency(calculateTotal(editingOrder.items))}</h4>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="save-btn" 
                onClick={() => editingOrder.order_id ? handleUpdateOrder(editingOrder) : handleCreateOrder()}
              >
                {editingOrder.order_id ? 'Lưu thay đổi' : 'Tạo đơn hàng'}
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
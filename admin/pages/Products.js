import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho form thêm/sửa sản phẩm
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true
  });
  
  // State cho modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách sản phẩm
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Không thể tải danh sách sản phẩm');
      setLoading(false);
    }
  };

  // Xử lý thêm sản phẩm mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchProducts();
      setShowModal(false);
      resetForm();
    } catch (error) {
      setError('Có lỗi xảy ra khi lưu sản phẩm');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      is_available: true
    });
    setEditingId(null);
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        setError('Không thể xóa sản phẩm');
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Quản lý sản phẩm</h1>
        <button 
          className="add-button"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Thêm sản phẩm
        </button>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="product-image"
                  />
                </td>
                <td>{product.name}</td>
                <td>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(product.price)}
                </td>
                <td>
                  <span className={`status ${product.is_available ? 'active' : 'inactive'}`}>
                    {product.is_available ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => {
                      setFormData(product);
                      setEditingId(product.id);
                      setShowModal(true);
                    }}
                  >
                    Sửa
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(product.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa sản phẩm */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit}>
              {/* Form fields */}
              <button type="submit">
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              <button type="button" onClick={() => setShowModal(false)}>
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

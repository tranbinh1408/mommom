import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const Products = ({ products, api, fetchData }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    image_url: '',
    is_available: true
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/categories');
      console.log('Categories response:', response.data);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category_id: product.category_id,
        description: product.description || '',
        image_url: product.image_url || '',
        is_available: product.is_available
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category_id: '',
        description: '',
        image_url: '',
        is_available: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await handleUpdateProduct(editingProduct.product_id, formData);
      } else {
        await handleAddProduct(formData);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await api.post('/api/products', productData);
      if (response.data.success) {
        fetchData();
        setShowModal(false);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Không thể thêm sản phẩm');
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      const response = await api.put(`/api/products/${productId}`, productData);
      if (response.data.success) {
        fetchData();
        setShowModal(false);
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Không thể cập nhật sản phẩm');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await api.delete(`/api/products/${productId}`);
      if (response.data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Không thể xóa sản phẩm');
    }
  };

  return (
    <div className="products-container">
      <h2>Quản lý sản phẩm</h2>
      <button className="products-add-btn" onClick={() => handleOpenModal()}>
        Thêm sản phẩm mới
      </button>

      <table className="products-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products?.map(product => (
            <tr key={product.product_id}>
              <td><img className="product-image" src={product.image_url} alt={product.name} /></td>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString('vi-VN')}đ</td>
              <td>{product.category_name}</td>
              <td>{product.is_available ? 'Còn hàng' : 'Hết hàng'}</td>
              <td>
                <button className="products-edit-btn" onClick={() => handleOpenModal(product)}>
                  Sửa
                </button>
                <button className="products-delete-btn" onClick={() => handleDeleteProduct(product.product_id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên sản phẩm:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Giá:</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Danh mục:</label>
                <select
                  value={formData.category_id}
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>URL Hình ảnh:</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={e => setFormData({...formData, is_available: e.target.checked})}
                  />
                  Còn hàng
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit">
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

Products.propTypes = {
  products: PropTypes.array.isRequired,
  api: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired
};

export default Products;
import React from 'react';
import './ProductTable.css';

const ProductTable = ({ products, onEdit, onDelete, onStatusChange }) => {
  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <div className="product-image-container">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="product-image"
                  />
                </div>
              </td>
              <td>
                <div className="product-name">
                  <span>{product.name}</span>
                  <small>{product.description}</small>
                </div>
              </td>
              <td>{product.category_name}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>
                <select
                  value={product.is_available ? 'active' : 'inactive'}
                  onChange={(e) => onStatusChange(product.id, e.target.value === 'active')}
                  className={`status-select ${product.is_available ? 'active' : 'inactive'}`}
                >
                  <option value="active">Còn hàng</option>
                  <option value="inactive">Hết hàng</option>
                </select>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => onEdit(product)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(product.id)}
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
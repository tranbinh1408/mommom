import React from 'react';

const Products = ({ products, handleAddProduct, handleUpdateProduct, handleDeleteProduct }) => {
  return (
    <div className="products-container">
      <h2>Quản lý sản phẩm</h2>
      <button className="products-add-btn">Thêm sản phẩm mới</button>
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
              <button className="products-edit-btn" onClick={() => handleUpdateProduct(product.product_id)}>
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
    </div>
  );
};

export default Products;
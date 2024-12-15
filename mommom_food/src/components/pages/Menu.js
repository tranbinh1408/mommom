import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = () => {
  const [activeFilter, setActiveFilter] = useState('*');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        if (response.data.success) {
          setProducts(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải danh sách sản phẩm');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find(item => item.product_id === selectedProduct.product_id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      existingCart.push({
        product_id: selectedProduct.product_id,
        name: selectedProduct.name,
        image_url: selectedProduct.image_url,
        price: selectedProduct.price,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));

    setShowModal(false);
    setSelectedProduct(null);
    setQuantity(1);
    alert('Đã thêm vào giỏ hàng!');
  };

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price.replace('đ', ''));
    return numericPrice.toFixed(2) + 'đ';
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="sub_page">
      <section className="food_section layout_padding-bottom">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>Thực đơn</h2>
          </div>

          <ul className="filters_menu">
            <li className="active" data-filter="*">Tất cả</li>
            <li data-filter=".burger">Phở/Bún</li>
            <li data-filter=".pizza">Cơm</li>
            <li data-filter=".pasta">Đồ uống</li>
          </ul>

          <div className="filters-content">
            <div className="row grid">
              {products.map(product => (
                <div key={product.product_id} className={`col-sm-6 col-lg-4 all ${product.category_name?.toLowerCase()}`}>
                  <div className="box">
                    <div>
                      <div className="img-box">
                        <img src={product.image_url} alt={product.name} />
                      </div>
                      <div className="detail-box">
                        <h5>{product.name}</h5>
                        <div className="options">
                          <h6>{formatPrice(product.price)}</h6>
                          <button 
                            className="cart-btn"
                            onClick={() => {
                              setSelectedProduct(product);
                              setQuantity(1);
                              setShowModal(true);
                            }}
                          >
                            <i className="fa fa-shopping-cart"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showModal && selectedProduct && (
        <div className="modal" style={{display: 'block', background: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProduct.name}</h5>
                <button onClick={() => {
                  setShowModal(false);
                  setSelectedProduct(null);
                  setQuantity(1);
                }}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="product-info text-center">
                  <img 
                    src={selectedProduct.image_url} 
                    alt={selectedProduct.name} 
                    style={{width: '200px', borderRadius: '10px'}}
                  />
                  <h6 className="product-name">{selectedProduct.name}</h6>
                  <p className="product-price">
                    {formatPrice(selectedProduct.price)} x {quantity}
                  </p>
                  <p className="total-amount">
                    Tổng tiền: {formatPrice((parseFloat(selectedProduct.price.replace('đ', '')) * quantity).toString())}
                  </p>
                </div>

                <div className="quantity-selector">
                  <button 
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >-</button>
                  <span className="quantity">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                  >+</button>
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={() => {
                  setShowModal(false);
                  setSelectedProduct(null);
                  setQuantity(1);
                }}>Đóng</button>
                <button onClick={handleAddToCart}>Thêm vào giỏ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
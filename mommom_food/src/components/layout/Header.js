import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
  };

  const calculateTotal = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return "0.00đ";
    
    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.toString().replace('đ', ''));
      return sum + (price * item.quantity);
    }, 0);
    
    return total.toFixed(2) + 'đ';
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!Array.isArray(cartItems)) return;
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    if (!Array.isArray(cartItems)) return;
    
    const updatedCart = cartItems.filter(item => item.product_id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const placeOrder = async () => {
    try {
      if (cartItems.length === 0) {
        alert('Giỏ hàng trống!');
        return;
      }

      const orderData = {
        total_amount: totalAmount,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await axios.post('http://localhost:5000/api/orders/create', orderData);

      if (response.data.success) {
        localStorage.removeItem('cart');
        setCartItems([]);
        setTotalAmount(0);
        setShowCart(false);
        alert('Đặt món thành công!');
      }
    } catch (error) {
      console.error('Place order error:', error);
      alert('Có lỗi xảy ra khi đặt món. Vui lòng thử lại!');
    }
  };

  const formatPrice = (price) => {
    if (!price) return "0.00đ";
    const numericPrice = parseFloat(price.toString().replace('đ', ''));
    return numericPrice.toFixed(2) + 'đ';
  };

  return (
    <header className="header_section">
      <div className="container">
        <nav className="navbar navbar-expand-lg custom_nav-container">
          <Link className="navbar-brand" to="/">
            <span>Mommom food</span>
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            data-toggle="collapse" 
            data-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className=""> </span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto">
              <li className={`nav-item ${path === '/' ? 'active' : ''}`}>
                <Link className="nav-link" to="/">
                  Trang chủ {path === '/' && <span className="sr-only">(current)</span>}
                </Link>
              </li>
              <li className={`nav-item ${path === '/menu' ? 'active' : ''}`}>
                <Link className="nav-link" to="/menu">
                  Thực đơn {path === '/menu' && <span className="sr-only">(current)</span>}
                </Link>
              </li>
              <li className={`nav-item ${path === '/about' ? 'active' : ''}`}>
                <Link className="nav-link" to="/about">
                  Thêm {path === '/about' && <span className="sr-only">(current)</span>}
                </Link>
              </li>
              <li className={`nav-item ${path === '/book' ? 'active' : ''}`}>
                <Link className="nav-link" to="/book">
                  Đặt bàn {path === '/book' && <span className="sr-only">(current)</span>}
                </Link>
              </li>
            </ul>
            <div className="user_option">
              {/* Thay đổi thành Link để chuyển đến trang đăng nhập admin */}
              <Link to="/admin/login" className="user_link">
                <i className="fa fa-user" aria-hidden="true"></i>
              </Link>
              <div className="cart_link" onClick={() => setShowCart(true)}>
                <i className="fa fa-shopping-cart"></i>
                {Array.isArray(cartItems) && cartItems.length > 0 && (
                  <span className="cart-badge">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <form className="form-inline">
                <button className="btn my-2 my-sm-0 nav_search-btn" type="submit">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </form>
              <Link to="#" className="order_online">
                Order Online
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Modal giỏ hàng */}
      {showCart && (
        <div className="cart-modal">
          <div className="cart-modal-content">
            <div className="cart-modal-header">
              <h5>Giỏ hàng của bạn</h5>
              <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
            </div>
            
            <div className="cart-modal-body">
              {Array.isArray(cartItems) && cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item.product_id} className="cart-item">
                    <img src={item.image_url} alt={item.name} />
                    <div className="cart-item-info">
                      <h6>{item.name}</h6>
                      <p className="price">{formatPrice(item.price)}</p>
                    </div>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.product_id)}
                    >×</button>
                  </div>
                ))
              ) : (
                <p className="empty-cart">Giỏ hàng trống</p>
              )}
            </div>

            <div className="cart-modal-footer">
              <div className="cart-total">
                <h6>Tổng cộng:</h6>
                <p>{calculateTotal()}</p>
              </div>
              <button 
                className="checkout-btn"
                onClick={placeOrder}
                disabled={cartItems.length === 0}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
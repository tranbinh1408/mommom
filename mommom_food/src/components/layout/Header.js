import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          if (Array.isArray(items)) {
            setCartItems(items);
            calculateTotal(items);
          } else {
            setCartItems([]);
            calculateTotal([]);
          }
        } catch (error) {
          console.error('Error parsing cart:', error);
          setCartItems([]);
          calculateTotal([]);
        }
      }
    };

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    loadCart();

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const total = calculateTotal(cartItems);
    setTotalAmount(total);
  }, [cartItems]);

// Header.js
const calculateTotal = (items) => {
  if (!Array.isArray(items) || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);
};

  const removeFromCart = (productId) => {
    const newItems = cartItems.filter(item => item.product_id !== productId);
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    setTotalAmount(calculateTotal(newItems));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const newItems = cartItems.map(item => {
      if (item.product_id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    setTotalAmount(calculateTotal(newItems));
  };

// Header.js
const placeOrder = async () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check cart not empty
    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    const orderData = {
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price
      })),
      total_amount: calculateTotal(cart)
    };

    console.log('Sending order:', orderData);

    const response = await axios.post(
      'http://localhost:5000/api/orders/create',
      orderData
    );

    if (response.data.success) {
      // Clear cart only after successful order
      localStorage.removeItem('cart');
      setCartItems([]);
      setShowCart(false);
      alert('Đặt hàng thành công!');
    }

  } catch (error) {
    console.error('Place order error:', error);
    alert('Có lỗi xảy ra khi đặt hàng!');
  }
};
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2) + 'đ';
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
                      onClick={() => removeFromCart(item.product_id)}
                    >×</button>
                  </div>
                ))
              ) : (
                <p>Giỏ hàng trống</p>
              )}
            </div>
            
            <div className="cart-modal-footer">
              <div className="cart-total">
                <h6>Tổng cộng:</h6>
                <p>{formatPrice(totalAmount)}</p>
              </div>
              <button 
                className="checkout-btn"
                onClick={placeOrder}
                disabled={!Array.isArray(cartItems) || cartItems.length === 0}
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
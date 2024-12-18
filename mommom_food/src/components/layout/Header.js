import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Add new state
  const [showTakeaway, setShowTakeaway] = useState(false);
  const [takeawayForm, setTakeawayForm] = useState({
    customerName: '',
    phone: '',
    address: ''
  });

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

// Add handleTakeawaySubmit function
const handleTakeawaySubmit = async () => {
  try {
    const takeawayItems = cartItems.filter(item => item.isTakeaway);
    
    // Match database structure exactly
    const orderData = {
      // Main order info
      items: takeawayItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price
      })),
      // Customer info
      customer_name: takeawayForm.customerName,
      customer_phone: takeawayForm.phone,
      customer_email: '',
      address: takeawayForm.address,
      total_amount: calculateTotal(takeawayItems),
      status: 'created',
      type: 'takeaway'
    };

    console.log('Sending order data:', orderData);

    const response = await axios.post(
      'http://localhost:5000/api/orders/create',
      orderData
    );

    if (response.data.success) {
      const newCart = cartItems.filter(item => !item.isTakeaway);
      localStorage.setItem('cart', JSON.stringify(newCart));
      setCartItems(newCart);
      setShowTakeaway(false);
      setTakeawayForm({
        customerName: '',
        phone: '',
        address: ''
      });
      alert('Đặt hàng thành công!');
    }
  } catch (err) {
    console.error('Error data:', err.response?.data);
    alert('Đặt hàng thất bại');
  }
};

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(3) + 'đ';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Navigate to menu with search term
    navigate(`/menu?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
    setShowSearchResults(false);
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
              <form className="form-inline" onSubmit={handleSearch}>
                <div className="search-container">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm món ăn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn nav_search-btn" type="submit">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </div>
              </form>
              <Link to="#" className="order_online" onClick={() => setShowTakeaway(true)}>
                Đặt mang về ({cartItems.filter(item => item.isTakeaway).length})
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

      {/* Add takeaway modal */}
      {showTakeaway && (
        <div className="cart-modal">
          <div className="cart-modal-content">
            <div className="cart-modal-header">
              <h5>Đơn hàng mang về</h5>
              <button className="close-btn" onClick={() => setShowTakeaway(false)}>×</button>
            </div>
            
            <div className="cart-modal-body">
              {/* Show takeaway items */}
              {cartItems.filter(item => item.isTakeaway).map(item => (
                <div key={item.product_id} className="cart-item">
                  <img src={item.image_url} alt={item.name} />
                  <div className="cart-item-info">
                    <h6>{item.name}</h6>
                    <p className="price">{formatPrice(item.price)}</p>
                    <div className="quantity">SL: {item.quantity}</div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.product_id)}>×</button>
                </div>
              ))}
              
              {/* Add delivery form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                handleTakeawaySubmit();
              }}>
                <div className="form-group">
                  <label>Họ tên:</label>
                  <input
                    type="text"
                    required
                    value={takeawayForm.customerName}
                    onChange={(e) => setTakeawayForm({
                      ...takeawayForm,
                      customerName: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại:</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={takeawayForm.phone}
                    onChange={(e) => setTakeawayForm({
                      ...takeawayForm,
                      phone: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ:</label>
                  <textarea
                    required
                    value={takeawayForm.address}
                    onChange={(e) => setTakeawayForm({
                      ...takeawayForm,
                      address: e.target.value
                    })}
                  />
                </div>
              </form>
            </div>
            
            <div className="cart-modal-footer">
              <div className="cart-total">
                <h6>Tổng cộng:</h6>
                <p>{formatPrice(calculateTotal(cartItems.filter(item => item.isTakeaway)))}</p>
              </div>
              <button 
                className="checkout-btn"
                onClick={handleTakeawaySubmit}
                disabled={!cartItems.some(item => item.isTakeaway)}
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add search results dropdown */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(product => (
            <Link 
              key={product.product_id}
              to={`/menu?product=${product.product_id}`}
              className="search-result-item"
              onClick={() => setShowSearchResults(false)}
            >
              <img src={product.image_url} alt={product.name} />
              <div>
                <h6>{product.name}</h6>
                <p>{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
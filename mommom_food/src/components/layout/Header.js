import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
import { useCallStaff } from '../../hooks/useCallStaff';

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
  const { callStaff } = useCallStaff();

  // Add new state
  const [showTakeaway, setShowTakeaway] = useState(false);
  const [takeawayForm, setTakeawayForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    items: []
  });

  // Thêm state để quản lý trạng thái menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hàm toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
    // Đảm bảo price và quantity là số
    const price = typeof item.price === 'string' ? 
      parseFloat(item.price.replace(/[^\d.-]/g, '')) : 
      parseFloat(item.price);
    const quantity = parseInt(item.quantity);
    
    if (isNaN(price) || isNaN(quantity)) {
      console.error('Invalid price or quantity:', item);
      return sum;
    }
    
    return sum + (price * quantity);
  }, 0);
};

  const addToCart = (product, isTakeaway = false) => {
    const newItem = {
      ...product,
      quantity: 1,
      isTakeaway // true nếu là đặt mang về, false nếu đặt tại bàn
    };

    setCartItems(prevItems => {
      // Tìm món đã tồn tại với cùng loại đơn (mang về/tại bàn)
      const existingItem = prevItems.find(
        item => item.product_id === product.product_id && item.isTakeaway === isTakeaway
      );

      let newItems;
      if (existingItem) {
        // Nếu món đã tồn tại, tăng số lượng
        newItems = prevItems.map(item => {
          if (item.product_id === product.product_id && item.isTakeaway === isTakeaway) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      } else {
        // Nếu món chưa tồn tại, thêm mới
        newItems = [...prevItems, newItem];
      }

      // Lưu vào localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCart = (productId, isTakeaway) => {
    const newItems = cartItems.filter(
      item => !(item.product_id === productId && item.isTakeaway === isTakeaway)
    );
    setCartItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
    setTotalAmount(calculateTotal(newItems));
  };

  const updateQuantity = (productId, newQuantity, isTakeaway) => {
    // Kiểm tra số lượng hợp lệ
    if (newQuantity < 1 || newQuantity > 100) {
      alert('Số lượng không hợp lệ (1-100)');
      return;
    }

    try {
      const newItems = cartItems.map(item => {
        if (item.product_id === productId && item.isTakeaway === isTakeaway) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      // Cập nhật state và localStorage
      setCartItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
      
      // Tính lại tổng tiền
      const newTotal = calculateTotal(newItems);
      setTotalAmount(newTotal);

      // Trigger event để cập nhật UI
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Có lỗi xảy ra khi cập nhật số lượng');
    }
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
      'https://kind-trust-production.up.railway.app/api/orders/create',
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

// Thêm các hàm validation
const isValidName = (name) => {
  return name.trim().length >= 2;
};

const isValidPhone = (phone) => {
  const phoneRegex = /^0\d{9}$/;
  return phoneRegex.test(phone);
};

// Cập nhật hàm handleTakeawaySubmit
const handleTakeawaySubmit = async () => {
  try {
    // Validate thông tin
    if (!takeawayForm.customerName || takeawayForm.customerName.length < 2) {
      alert('Tên khách hàng phải có ít nhất 2 ký tự');
      return;
    }

    if (!takeawayForm.phone || !/^0\d{9}$/.test(takeawayForm.phone)) {
      alert('Số điện thoại không hợp lệ (phải có 10 chữ số và bắt đầu bằng số 0)');
      return;
    }

    // Lấy các món mang về từ giỏ hàng
    const takeawayItems = cartItems.filter(item => item.isTakeaway);
    
    const orderData = {
      customer_name: takeawayForm.customerName,
      customer_phone: takeawayForm.phone,
      address: takeawayForm.address || 'Mang về',
      items: takeawayItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: parseFloat(item.price)
      })),
      total_amount: calculateTakeawayTotal(takeawayItems)
    };

    const response = await axios.post('https://kind-trust-production.up.railway.app/api/takeaway-orders/create', orderData);

    if (response.data.success) {
      // Chỉ xóa các món mang về khỏi giỏ hàng
      const newCartItems = cartItems.filter(item => !item.isTakeaway);
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
      
      // Reset form
      setTakeawayForm({
        customerName: '',
        phone: '',
        address: ''
      });
      
      setShowTakeaway(false);
      alert('Đặt hàng mang về thành công!');
    }
  } catch (error) {
    console.error('Error placing takeaway order:', error);
    alert('Có lỗi xảy ra khi đặt hàng');
  }
};

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      price = parseFloat(price.replace(/[^\d.-]/g, ''));
    }
    return price.toFixed(3) + 'đ';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Navigate to menu with search term
    navigate(`/menu?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  // Thêm hàm để gộp các item giống nhau
  const getMergedTakeawayItems = () => {
    const takeawayItems = cartItems.filter(item => item.isTakeaway);
    return takeawayItems.reduce((acc, item) => {
      const existingItem = acc.find(i => i.product_id === item.product_id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push({...item});
      }
      return acc;
    }, []);
  };

  // Tính tổng cho đơn ăn tại chỗ
  const calculateDineInTotal = (items) => {
    if (!Array.isArray(items)) return 0;
    return items
      .filter(item => !item.isTakeaway)
      .reduce((sum, item) => {
        const price = typeof item.price === 'string' ? 
          parseFloat(item.price.replace(/[^\d.-]/g, '')) : 
          parseFloat(item.price);
        return sum + (price * item.quantity);
      }, 0);
  };

  // Tính tổng cho đơn mang về
  const calculateTakeawayTotal = (items) => {
    if (!Array.isArray(items)) return 0;
    return items
      .filter(item => item.isTakeaway)
      .reduce((sum, item) => {
        const price = typeof item.price === 'string' ? 
          parseFloat(item.price.replace(/[^\d.-]/g, '')) : 
          parseFloat(item.price);
        return sum + (price * item.quantity);
      }, 0);
  };

  // Tính tổng số lượng món cho từng loại đơn
  const getDineInCount = () => {
    return cartItems
      .filter(item => !item.isTakeaway)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTakeawayCount = () => {
    return cartItems
      .filter(item => item.isTakeaway)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <>
      <header className="header_section">
        <div className="container">
          <nav className="navbar navbar-expand-lg custom_nav-container">
            <Link className="navbar-brand" to="/">
              <span>Mommom food</span>
            </Link>

            <button 
              className={`navbar-toggler ${isMenuOpen ? 'active' : ''}`}
              type="button" 
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              <span className="toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
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
                  <Link 
                    className="nav-link" 
                    to="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      callStaff();
                    }}
                  >
                    Thêm {path === '/about' && <span className="sr-only">(current)</span>}
                  </Link>
                </li>
                {/* <li className={`nav-item ${path === '/book' ? 'active' : ''}`}>
                  <Link className="nav-link" to="/book">
                    Đặt bàn {path === '/book' && <span className="sr-only">(current)</span>}
                  </Link>
                </li> */}
              </ul>
              <div className="user_option">
                {/* Thay đổi thành Link để chuyển đến trang đăng nhập admin */}
                <Link to="/admin/login" className="user_link">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </Link>
                <div className="cart_link" onClick={() => setShowCart(true)}>
                  <i className="fa fa-shopping-cart"></i>
                  {Array.isArray(cartItems) && cartItems.filter(item => !item.isTakeaway).length > 0 && (
                    <span className="cart-badge">
                      {cartItems
                        .filter(item => !item.isTakeaway)
                        .reduce((sum, item) => sum + item.quantity, 0)}
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
                  Đặt mang về ({cartItems
                    .filter(item => item.isTakeaway)
                    .reduce((sum, item) => sum + item.quantity, 0)})
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Modal giỏ hàng ăn tại chỗ */}
        {showCart && (
          <div className="cart-modal">
            <div className="cart-modal-content">
              <div className="cart-modal-header">
                <h5>Giỏ hàng của bạn (Ăn tại chỗ)</h5>
                <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
              </div>
              
              <div className="cart-modal-body">
                {/* Chỉ hiển thị món ăn tại chỗ */}
                {cartItems
                  .filter(item => !item.isTakeaway)
                  .map(item => (
                    <div key={`table-${item.product_id}`} className="cart-item">
                      <img src={item.image_url} alt={item.name} />
                      <div className="cart-item-info">
                        <h6>{item.name}</h6>
                        <p className="price">{formatPrice(item.price)}</p>
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1, false)}
                            disabled={item.quantity <= 1}
                          >-</button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1, false)}
                          >+</button>
                        </div>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.product_id, false)}
                      >×</button>
                    </div>
                  ))}
              </div>
              
              <div className="cart-modal-footer">
                <div className="cart-total">
                  <h6>Tổng cộng:</h6>
                  <p>{formatPrice(calculateDineInTotal(cartItems))}</p>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={placeOrder}
                  disabled={!cartItems.some(item => !item.isTakeaway)}
                >Đặt món</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal đơn mang về */}
        {showTakeaway && (
          <div className="cart-modal">
            <div className="cart-modal-content">
              <div className="cart-modal-header">
                <h5>Đơn hàng mang về</h5>
                <button className="close-btn" onClick={() => setShowTakeaway(false)}>×</button>
              </div>
              
              <div className="cart-modal-body">
                {/* Chỉ hiển thị món mang về */}
                {cartItems
                  .filter(item => item.isTakeaway)
                  .map(item => (
                    <div key={`takeaway-${item.product_id}`} className="cart-item">
                      <img src={item.image_url} alt={item.name} />
                      <div className="cart-item-info">
                        <h6>{item.name}</h6>
                        <p className="price">{formatPrice(item.price)}</p>
                      </div>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, true)}
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, true)}
                        >+</button>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.product_id, true)}
                      >×</button>
                    </div>
                  ))}

                {/* Form thông tin khách hàng */}
                <form className="takeaway-form">
                  <div className="form-group">
                    <label>Tên khách hàng:</label>
                    <input
                      type="text"
                      value={takeawayForm.customerName}
                      onChange={(e) => setTakeawayForm({
                        ...takeawayForm,
                        customerName: e.target.value
                      })}
                      placeholder="Nhập tên (ít nhất 2 ký tự)"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại:</label>
                    <input
                      type="tel"
                      value={takeawayForm.phone}
                      onChange={(e) => setTakeawayForm({
                        ...takeawayForm,
                        phone: e.target.value
                      })}
                      placeholder="Nhập SĐT (10 số, bắt đầu bằng 0)"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ:</label>
                    <input
                      type="text"
                      value={takeawayForm.address}
                      onChange={(e) => setTakeawayForm({
                        ...takeawayForm,
                        address: e.target.value
                      })}
                      placeholder="Nhập địa chỉ (để trống nếu lấy tại quán)"
                    />
                  </div>
                </form>
              </div>
              
              <div className="cart-modal-footer">
                <div className="cart-total">
                  <h6>Tổng cộng:</h6>
                  {/* Chỉ tính tổng tiền món mang về */}
                  <p>{formatPrice(calculateTakeawayTotal(cartItems))}</p>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={handleTakeawaySubmit}
                  disabled={!cartItems.some(item => item.isTakeaway)}
                >Xác nhận đặt hàng</button>
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

      {/* Mobile Bottom Navigation - Chỉ hiển thị khi có món trong giỏ */}
      <div className="mobile-cart-nav d-lg-none">
        {getDineInCount() > 0 && (
          <div 
            className="cart-btn dine-in"
            onClick={() => setShowCart(true)}
          >
            Giỏ hàng tại bàn
            <span className="cart-badge">{getDineInCount()}</span>
          </div>
        )}
        
        {getTakeawayCount() > 0 && (
          <div 
            className="cart-btn takeaway"
            onClick={() => setShowTakeaway(true)}
          >
            Giỏ hàng mang về
            <span className="cart-badge">{getTakeawayCount()}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';
import Orders from './pages/Orders'; // Thêm dòng này

const Admin = () => {
const navigate = useNavigate();
const location = useLocation();
const [currentView, setCurrentView] = useState('dashboard');
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loginForm, setLoginForm] = useState({ username: '', password: '' });
const [products, setProducts] = useState([]);
const [orders, setOrders] = useState([]);
const [tables, setTables] = useState([]);
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

  // Cấu hình axios
  const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });
  

  // Thêm interceptor để tự động gắn token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, tablesRes, usersRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/orders'),
        api.get('/api/tables'),
        api.get('/api/users')
      ]);

      if (productsRes.data.success) {
        // Get products with existing category_name from backend
        setProducts(productsRes.data.data);
      }
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
      if (tablesRes.data.success) {
        setTables(tablesRes.data.data);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Đảm bảo gửi đúng format data theo userController
      const response = await api.post('/api/users/login', {
        username: loginForm.username,
        password: loginForm.password
      });
  
      console.log('Login response:', response.data);
  
      // Kiểm tra response format theo userController
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('adminToken', response.data.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
        setIsLoggedIn(true);
        fetchData();
      } else {
        setError('Đăng nhập thất bại: ' + response.data.message);
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser'); // Also remove user data
    setIsLoggedIn(false);
    setCurrentView('dashboard');
    navigate('/admin/login'); // Navigate to login page instead of dashboard
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="loading-spinner">Loading...</div>
  );

  // Error Message Component
  const ErrorMessage = ({ message }) => (
    message ? <div className="error-message">{message}</div> : null
  );

  // Login form
  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h2>Admin Login</h2>
          <ErrorMessage message={error} />
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="back-button"
            >
              Quay lại
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Component
  const Dashboard = () => (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Products</h3>
          <p>{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Tables</h3>
          <p>{tables.length}</p>
        </div>
        <div className="stat-card">
          <h3>Users</h3>
          <p>{users.length}</p>
        </div>
      </div>
    </div>
  );

  // Products Component
  const Products = () => {
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
          setError('Không thể tải danh mục sản phẩm');
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
    }, []);

    // Thêm hàm handleDeleteProduct
    const handleDeleteProduct = async (productId) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
          await api.delete(`/api/products/${productId}`);
          fetchData(); // Refresh danh sách sau khi xóa
        } catch (err) {
          setError(err.response?.data?.message || 'Không thể xóa sản phẩm');
        }
      }
    };

    // Reset form
    const resetForm = () => {
      setFormData({
        name: '',
        price: '',
        category_id: '',
        description: '',
        image_url: '',
        is_available: true
      });
      setEditingProduct(null);
    };

    // Mở modal thêm mới
    const handleAddClick = () => {
      resetForm();
      setShowModal(true);
    };

    // Mở modal chỉnh sửa
    const handleEditClick = (product) => {
      setFormData({
        name: product.name,
        price: product.price,
        category_id: product.category_id,
        description: product.description,
        image_url: product.image_url,
        is_available: product.is_available
      });
      setEditingProduct(product);
      setShowModal(true);
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Validate dữ liệu trước khi gửi
        if (!formData.name || !formData.price || !formData.category_id) {
          setError('Vui lòng điền đầy đủ thông tin bắt buộc');
          return;
        }

        const productData = {
          name: formData.name,
          description: formData.description || null,
          price: Number(formData.price),
          category_id: Number(formData.category_id),
          image_url: formData.image_url || null,
          is_available: true
        };

        console.log('Sending product data:', productData);

        if (editingProduct) {
          await api.put(`/api/products/${editingProduct.product_id}`, productData);
        } else {
          await api.post('/api/products', productData);
        }
        
        fetchData();
        setShowModal(false);
        resetForm();
      } catch (err) {
        console.error('Error submitting form:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.message || 'Có lỗi xảy ra');
      }
    };

    // Modal form
    const ProductModal = () => (
      <div className="modal" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div className="products-modal-content" >
          <h2>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên sản phẩm: *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Giá: *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Danh mục: *</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mô tả:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>URL Hình ảnh:</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                />
                Còn hàng
              </label>
            </div>

            <div className="modal-actions" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button type="button" onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button type="submit">
                {editingProduct ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );

    return (
      <div className="products-container">
        <h2>Quản lý sản phẩm</h2>
        <button className="add-btn" onClick={handleAddClick}>
          Thêm sản phẩm mới
        </button>
        <table>
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
            {products.map(product => (
              <tr key={product.product_id}>
                <td><img src={product.image_url} alt={product.name} style={{width: '50px', height: '50px', objectFit: 'cover'}} /></td>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString('vi-VN')}đ</td>
                {/* Fix category display by using category_name from joined query */}
                <td>{product.category_name || 'Chưa phân loại'}</td>
                <td>{product.is_available ? 'Còn hàng' : 'Hết hàng'}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(product)}>
                    Sửa
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteProduct(product.product_id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && <ProductModal />}
      </div>
    );
  };

  // Tables Component
  const Tables = () => {
    const handleUpdateTableStatus = async (tableId, status) => {
      try {
        await api.put(`/tables/${tableId}/status`, { status });
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message);
      }
    };

    return (
      <div className="tables-container">
        <h2>Tables Management</h2>
        <button className="add-btn">Add New Table</button>
        <div className="tables-grid">
          {tables.map(table => (
            <div key={table.table_id} className={`table-card ${table.status}`}>
              <h3>Table {table.table_number}</h3>
              <p>Capacity: {table.capacity}</p>
              <p>Status: 
                <select
                  value={table.status}
                  onChange={(e) => handleUpdateTableStatus(table.table_id, e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                </select>
              </p>
              <div className="table-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Users Component
  const Users = () => {
    const handleDeleteUser = async (userId) => {
      if (window.confirm('Are you sure you want to delete this user?')) {
        try {
          await api.delete(`/users/${userId}`);
          fetchData();
        } catch (err) {
          setError(err.response?.data?.message);
        }
      }
    };

    return (
      <div className="users-container">
        <h2>Users Management</h2>
        <button className="add-btn">Add New User</button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteUser(user.user_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Main admin layout
  return (
    <div className="admin-container">
      {loading && <LoadingSpinner />}
      <ErrorMessage message={error} />
      
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Mommom Admin</h3>
        </div>
        <ul className="sidebar-menu">
          <li className={currentView === 'dashboard' ? 'active' : ''} 
              onClick={() => setCurrentView('dashboard')}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </li>
          <li className={currentView === 'products' ? 'active' : ''} 
              onClick={() => setCurrentView('products')}>
            <i className="fas fa-utensils"></i>
            <span>Products</span>
          </li>
          <li className={currentView === 'orders' ? 'active' : ''} 
              onClick={() => setCurrentView('orders')}>
            <i className="fas fa-shopping-cart"></i>
            <span>Orders</span>
          </li>
          <li className={currentView === 'tables' ? 'active' : ''} 
              onClick={() => setCurrentView('tables')}>
            <i className="fas fa-chair"></i>
            <span>Tables</span>
          </li>
          <li className={currentView === 'users' ? 'active' : ''} 
              onClick={() => setCurrentView('users')}>
            <i className="fas fa-users"></i>
            <span>Users</span>
          </li>
        </ul>
      </nav>

      <div className="admin-content">
        <header className="admin-header">
          <div className="header-right">
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </header>

        <main className="admin-main">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'products' && <Products />}
          {currentView === 'orders' && <Orders 
            api={api} 
            orders={orders} 
            fetchData={fetchData}
            loading={loading}
            error={error}
          />}
          {currentView === 'tables' && <Tables />}
          {currentView === 'users' && <Users />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
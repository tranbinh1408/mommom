import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

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

      setProducts(productsRes.data.data);
      setOrders(ordersRes.data.data);
      setTables(tablesRes.data.data);
      setUsers(usersRes.data.data);
      setError(null);
    }  catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        setError('Phiên đăng nhập hết hạn');
      } else {
        setError('Không thể tải dữ liệu');
      }
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
    setIsLoggedIn(false);
    setCurrentView('dashboard');
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
    const handleAddProduct = async (productData) => {
      try {
        await api.post('/products', productData);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message);
      }
    };

    const handleUpdateProduct = async (id, productData) => {
      try {
        await api.put(`/products/${id}`, productData);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message);
      }
    };

    const handleDeleteProduct = async (id) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          await api.delete(`/products/${id}`);
          fetchData();
        } catch (err) {
          setError(err.response?.data?.message);
        }
      }
    };

    return (
      <div className="products-container">
        <h2>Products Management</h2>
        <button className="add-btn">Add New Product</button>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.product_id}>
                <td><img src={product.image_url} alt={product.name} /></td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category_name}</td>
                <td>{product.is_available ? 'Active' : 'Inactive'}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleUpdateProduct(product.product_id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteProduct(product.product_id)}>
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

  // Orders Component
  const Orders = () => {
    const handleUpdateStatus = async (orderId, status) => {
      try {
        await api.put(`/orders/${orderId}/status`, { status });
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message);
      }
    };

    return (
      <div className="orders-container">
        <h2>Orders Management</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_name}</td>
                <td>{order.items}</td>
                <td>${order.total_amount}</td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button className="edit-btn">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          {currentView === 'orders' && <Orders />}
          {currentView === 'tables' && <Tables />}
          {currentView === 'users' && <Users />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
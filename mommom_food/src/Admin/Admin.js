import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import AdminSidebar from './components/AdminSidebar';
import TakeawayOrders from './pages/TakeawayOrders';

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
    baseURL: 'http://localhost:5000', // Remove /api from here
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
      const [
        productsRes,
        ordersRes, 
        tablesRes,
        usersRes
      ] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/orders'),
        api.get('/api/tables'), 
        api.get('/api/users')
      ]);

      if (productsRes.data.success) setProducts(productsRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (tablesRes.data.success) setTables(tablesRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);

    } catch (err) {
      console.error('Fetch error:', err);
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

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          products={products || []}
          orders={orders || []} 
          tables={tables || []}
          users={users || []}
        />;
      case 'products':
        return <Products products={products} api={api} fetchData={fetchData} />;
      case 'orders':
        return <Orders orders={orders} api={api} fetchData={fetchData} />;
      case 'takeaway-orders':
        return <TakeawayOrders orders={orders} api={api} fetchData={fetchData} />;
      case 'tables':
        return <Tables />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  // Main admin layout
  return (
    <div className="admin-container">
      {loading && <LoadingSpinner />}
      <ErrorMessage message={error} />
      
      <AdminSidebar currentView={currentView} setCurrentView={setCurrentView} />

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
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
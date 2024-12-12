import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, []);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    if (loginForm.username === 'admin' && loginForm.password === 'password') {
      localStorage.setItem('adminToken', 'dummy-token');
      setIsLoggedIn(true);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  // Login form
  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h2>Admin Login</h2>
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
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard Components
  const Dashboard = () => (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {/* Add dashboard content */}
    </div>
  );

  const Products = () => (
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
            <tr key={product.id}>
              <td><img src={product.image} alt={product.name} /></td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.status}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const Orders = () => (
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
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.items}</td>
              <td>${order.total}</td>
              <td>{order.status}</td>
              <td>
                <button className="edit-btn">Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const Tables = () => (
    <div className="tables-container">
      <h2>Tables Management</h2>
      <button className="add-btn">Add New Table</button>
      <div className="tables-grid">
        {tables.map(table => (
          <div key={table.id} className={`table-card ${table.status}`}>
            <h3>Table {table.number}</h3>
            <p>Capacity: {table.capacity}</p>
            <p>Status: {table.status}</p>
            <div className="table-actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Users = () => (
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
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Main admin layout
  return (
    <div className="admin-container">
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
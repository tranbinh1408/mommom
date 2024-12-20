import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ currentView, setCurrentView }) => {
  return (
    <div className="admin-sidebar">
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
            <span>Sản phẩm</span>
          </li>
          <li className={currentView === 'orders' ? 'active' : ''} 
              onClick={() => setCurrentView('orders')}>
            <i className="fas fa-shopping-cart"></i>
            <span>Đơn hàng</span>
          </li>
          <li className={currentView === 'tables' ? 'active' : ''} 
              onClick={() => setCurrentView('tables')}>
            <i className="fas fa-chair"></i>
            <span>Bàn ăn</span>
          </li>
          <li className={currentView === 'users' ? 'active' : ''} 
              onClick={() => setCurrentView('users')}>
            <i className="fas fa-users"></i>
            <span>Nhân viên</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
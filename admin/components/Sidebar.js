import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/products', icon: '🍽️', label: 'Sản phẩm' },
    { path: '/admin/orders', icon: '📝', label: 'Đơn hàng' },
    { path: '/admin/tables', icon: '🪑', label: 'Quản lý bàn' }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>MomMom Admin</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
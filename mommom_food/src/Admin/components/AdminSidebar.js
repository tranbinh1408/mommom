import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ currentView, setCurrentView }) => {
  return (
    <div className="admin-sidebar">
      <nav>
        <ul>
          <li className={currentView === 'dashboard' ? 'active' : ''}>
            <Link to="/admin/dashboard" onClick={() => setCurrentView('dashboard')}>
              Dashboard
            </Link>
          </li>
          <li className={currentView === 'products' ? 'active' : ''}>
            <Link to="/admin/products" onClick={() => setCurrentView('products')}>
              Sản phẩm
            </Link>
          </li>
          <li className={currentView === 'orders' ? 'active' : ''}>
            <Link to="/admin/orders" onClick={() => setCurrentView('orders')}>
              Đơn hàng
            </Link>
          </li>
          <li className={currentView === 'tables' ? 'active' : ''}>
            <Link to="/admin/tables" onClick={() => setCurrentView('tables')}>
              Quản lý bàn
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
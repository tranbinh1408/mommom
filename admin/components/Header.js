import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('adminUser'));

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <header className="admin-header">
      <div className="header-title">
        <h1>Quản lý MomMom Food</h1>
      </div>
      <div className="header-user">
        <span className="user-name">{adminUser?.fullName}</span>
        <button onClick={handleLogout} className="logout-btn">
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Header;
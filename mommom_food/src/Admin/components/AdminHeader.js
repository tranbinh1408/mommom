import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('adminUser'));

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <header className="admin-header">
      <h1>MomMom Food Admin</h1>
      <div className="admin-user">
        <span>{adminUser?.username}</span>
        <button onClick={handleLogout}>Đăng xuất</button>
      </div>
    </header>
  );
};

export default AdminHeader;
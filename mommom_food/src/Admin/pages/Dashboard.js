import React from 'react';

const Dashboard = ({ products, orders, tables, users }) => {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Sản phẩm</h3>
          <p>{products?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Đơn hàng</h3>
          <p>{orders?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Bàn</h3>
          <p>{tables?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Người dùng</h3>
          <p>{users?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
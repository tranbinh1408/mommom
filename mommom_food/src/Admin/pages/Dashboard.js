import React from 'react';
import PropTypes from 'prop-types';

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

Dashboard.propTypes = {
  products: PropTypes.array.isRequired,
  orders: PropTypes.array.isRequired,
  tables: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired
};

export default Dashboard;
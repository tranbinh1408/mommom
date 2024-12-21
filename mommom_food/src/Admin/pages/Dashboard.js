import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    tables: 0,
    users: 0,
    recentOrders: [],
    dailyRevenue: [],
    ordersByStatus: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Cấu hình cho biểu đồ doanh thu
  const revenueData = {
    labels: stats.dailyRevenue?.map(item => 
      new Date(item.date).toLocaleDateString('vi-VN')
    ).reverse(),
    datasets: [{
      label: 'Doanh thu (Ngàn VNĐ)',
      data: stats.dailyRevenue?.map(item => item.total).reverse(),
      fill: true,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doanh thu 7 ngày gần nhất',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `${value.toLocaleString()}đ`
        }
      }
    }
  };

  // Thêm cấu hình cho biểu đồ cột
  const orderStatusData = {
    labels: stats.ordersByStatus?.map(item => {
      const statusLabels = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'preparing': 'Đang chuẩn bị',
        'ready': 'Sẵn sàng',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
      };
      return statusLabels[item.status] || item.status;
    }),
    datasets: [{
      label: 'Số lượng đơn hàng',
      data: stats.ordersByStatus?.map(item => item.count),
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',   // Pending
        'rgba(59, 130, 246, 0.7)',   // Confirmed
        'rgba(245, 158, 11, 0.7)',   // Preparing
        'rgba(16, 185, 129, 0.7)',   // Ready
        'rgba(46, 204, 113, 0.7)',   // Completed
        'rgba(231, 76, 60, 0.7)'     // Cancelled
      ],
      borderWidth: 1
    }]
  };

  const orderStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Số lượng đơn hàng theo trạng thái',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Tổng quan</h2>
      
      <div className="stats-grid">
        <div className="stat-card products">
          <div className="stat-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-info">
            <h3>Sản phẩm</h3>
            <p>{stats.products}</p>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-info">
            <h3>Đơn hàng</h3>
            <p>{stats.orders}</p>
          </div>
        </div>

        <div className="stat-card tables">
          <div className="stat-icon">
            <i className="fas fa-chair"></i>
          </div>
          <div className="stat-info">
            <h3>Bàn</h3>
            <p>{stats.tables}</p>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Người dùng</h3>
            <p>{stats.users}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <div style={{ flex: 1, position: 'relative' }}>
            <Line data={revenueData} options={revenueOptions} />
          </div>
        </div>
        <div className="chart-card">
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar data={orderStatusData} options={orderStatusOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
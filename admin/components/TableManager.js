import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TableManager.css';

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/tables', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Không thể tải danh sách bàn');
      setLoading(false);
    }
  };

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5000/api/tables/${tableId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      fetchTables();
    } catch (error) {
      setError('Không thể cập nhật trạng thái bàn');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="table-manager">
      <div className="tables-grid">
        {tables.map(table => (
          <div 
            key={table.id} 
            className={`table-card ${table.status}`}
            onClick={() => setSelectedTable(table)}
          >
            <h3>Bàn {table.table_number}</h3>
            <div className="table-info">
              <p>Sức chứa: {table.capacity} người</p>
              <select
                value={table.status}
                onChange={(e) => handleStatusChange(table.id, e.target.value)}
                className={`status-select ${table.status}`}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="available">Trống</option>
                <option value="occupied">Đang sử dụng</option>
                <option value="reserved">Đã đặt trước</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {selectedTable && (
        <div className="table-details">
          <h2>Chi tiết Bàn {selectedTable.table_number}</h2>
          <div className="details-content">
            <p><strong>Trạng thái:</strong> {selectedTable.status}</p>
            <p><strong>Sức chứa:</strong> {selectedTable.capacity} người</p>
            {/* Thêm thông tin chi tiết khác nếu cần */}
          </div>
          <button 
            className="close-button"
            onClick={() => setSelectedTable(null)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default TableManager;
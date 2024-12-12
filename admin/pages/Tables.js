import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tables.css';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // State cho form
  const [formData, setFormData] = useState({
    table_number: '',
    capacity: '',
    status: 'available'
  });

  // Lấy danh sách bàn
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

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (editingId) {
        await axios.put(`http://localhost:5000/api/tables/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/tables', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchTables();
      setShowModal(false);
      resetForm();
    } catch (error) {
      setError('Có lỗi xảy ra khi lưu thông tin bàn');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      table_number: '',
      capacity: '',
      status: 'available'
    });
    setEditingId(null);
  };

  // Xử lý xóa bàn
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bàn này?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:5000/api/tables/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTables();
      } catch (error) {
        setError('Không thể xóa bàn');
      }
    }
  };

  // Xử lý cập nhật trạng thái
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5000/api/tables/${id}/status`, 
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
    <div className="tables-page">
      <div className="tables-header">
        <h1>Quản lý bàn</h1>
        <button 
          className="add-button"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Thêm bàn mới
        </button>
      </div>

      <div className="tables-grid">
        {tables.map(table => (
          <div key={table.id} className={`table-card ${table.status}`}>
            <h3>Bàn {table.table_number}</h3>
            <div className="table-info">
              <p>Sức chứa: {table.capacity} người</p>
              <select
                value={table.status}
                onChange={(e) => handleStatusChange(table.id, e.target.value)}
                className={`status-select ${table.status}`}
              >
                <option value="available">Trống</option>
                <option value="occupied">Đang sử dụng</option>
                <option value="reserved">Đã đặt trước</option>
              </select>
            </div>
            <div className="table-actions">
              <button
                className="edit-button"
                onClick={() => {
                  setFormData(table);
                  setEditingId(table.id);
                  setShowModal(true);
                }}
              >
                Sửa
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(table.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal thêm/sửa bàn */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingId ? 'Sửa thông tin bàn' : 'Thêm bàn mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Số bàn:</label>
                <input
                  type="text"
                  value={formData.table_number}
                  onChange={(e) => setFormData({
                    ...formData,
                    table_number: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Sức chứa:</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({
                    ...formData,
                    capacity: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({
                    ...formData,
                    status: e.target.value
                  })}
                >
                  <option value="available">Trống</option>
                  <option value="occupied">Đang sử dụng</option>
                  <option value="reserved">Đã đặt trước</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit">
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
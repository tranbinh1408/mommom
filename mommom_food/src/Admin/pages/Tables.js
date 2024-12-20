import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const Tables = ({ tables, api, fetchData }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    table_number: '',
    capacity: '',
    status: 'available'
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.table_number || !formData.capacity) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const tableData = {
        table_number: formData.table_number.trim(),
        capacity: parseInt(formData.capacity),
        status: formData.status || 'available'
      };

      console.log('Sending table data:', tableData);

      if (editingTable) {
        await api.put(`/api/tables/${editingTable.table_id}`, tableData);
      } else {
        const response = await api.post('/api/tables', tableData);
        console.log('Server response:', response.data);
      }
      
      setShowModal(false);
      setEditingTable(null);
      setFormData({ table_number: '', capacity: '', status: 'available' });
      fetchData();
      alert(editingTable ? 'Cập nhật bàn thành công' : 'Thêm bàn mới thành công');
    } catch (error) {
      console.error('Error details:', error.response?.data || error);
      alert(error.response?.data?.message || 'Không thể lưu thông tin bàn');
    }
  };

  const handleDelete = async (tableId) => {
    if (window.confirm('Bạn có chắc muốn xóa bàn này?')) {
      try {
        await api.delete(`/api/tables/${tableId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting table:', error);
        alert('Không thể xóa bàn');
      }
    }
  };

  const handleGenerateQR = (table) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector('.qr-container svg');
    const svgData = new XMLSerializer().serializeToString(canvas);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(svgBlob);
    link.download = `table-${selectedTable.table_number}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="tables-container">
      <h2>Quản lý bàn ăn</h2>
      <button className="add-btn" onClick={() => setShowModal(true)}>
        Thêm bàn mới
      </button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Số bàn</th>
            <th>Sức chứa</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {tables?.map(table => (
            <tr key={table.table_id}>
              <td>{table.table_number}</td>
              <td>{table.capacity} người</td>
              <td>
                <select
                  value={table.status}
                  onChange={async (e) => {
                    try {
                      await api.put(`/api/tables/${table.table_id}/status`, {
                        status: e.target.value
                      });
                      fetchData();
                    } catch (error) {
                      console.error('Error updating status:', error);
                      alert('Không thể cập nhật trạng thái');
                    }
                  }}
                >
                  <option value="available">Trống</option>
                  <option value="occupied">Đã đầy</option>
                  <option value="reserved">Đã đặt trước</option>
                </select>
              </td>
              <td>
                <button 
                  className="edit-btn"
                  onClick={() => {
                    setEditingTable(table);
                    setFormData({
                      table_number: table.table_number,
                      capacity: table.capacity,
                      status: table.status
                    });
                    setShowModal(true);
                  }}
                >
                  Sửa
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(table.table_id)}
                >
                  Xóa
                </button>
                <button 
                  className="qr-btn"
                  onClick={() => handleGenerateQR(table)}
                >
                  QR Code
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingTable ? 'Sửa bàn' : 'Thêm bàn mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Số bàn:</label>
                <input
                  type="text"
                  value={formData.table_number}
                  onChange={(e) => setFormData({...formData, table_number: e.target.value})}
                  placeholder="Nhập số bàn (VD: A1, B2)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Sức chứa:</label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  placeholder="Nhập số người"
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="available">Trống</option>
                  <option value="occupied">Đã đầy</option>
                  <option value="reserved">Đ đặt trước</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingTable ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTable(null);
                    setFormData({ table_number: '', capacity: '', status: 'available' });
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQRModal && selectedTable && (
        <div className="modal">
          <div className="modal-content qr-modal">
            <h3>QR Code cho bàn {selectedTable.table_number}</h3>
            <div className="qr-container">
              <QRCodeSVG 
                value={`http://localhost:3000/table/${selectedTable.table_number.toLowerCase()}`}
                size={256}
                level="H"
              />
            </div>
            <div className="qr-modal-actions">
              <button 
                type="button" 
                className="download-qr-btn"
                onClick={handleDownloadQR}
              >
                Tải QR Code
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedTable(null);
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
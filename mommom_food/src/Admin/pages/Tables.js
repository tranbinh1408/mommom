import React from 'react';

const Tables = ({ tables, handleUpdateTableStatus }) => {
  return (
    <div className="tables-container">
      <h2>Quản lý bàn</h2>
      <button className="add-btn">Thêm bàn mới</button>
      <div className="tables-grid">
        {tables?.map(table => (
          <div key={table.table_id} className={`table-card ${table.status}`}>
            <h3>Bàn {table.table_number}</h3>
            <p>Sức chứa: {table.capacity} người</p>
            <p>
              Trạng thái: 
              <select
                value={table.status}
                onChange={(e) => handleUpdateTableStatus(table.table_id, e.target.value)}
              >
                <option value="available">Trống</option>
                <option value="occupied">Đang sử dụng</option>
                <option value="reserved">Đã đặt</option>
              </select>
            </p>
            <div className="table-actions">
              <button className="edit-btn">Sửa</button>
              <button className="delete-btn">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
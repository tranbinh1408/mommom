import React, { useState, useEffect } from 'react';

const Users = ({ users, api, fetchData }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'staff'
  });

  // Xử lý thêm người dùng mới
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users', formData);
      if (response.data.success) {
        fetchData(); // Refresh data sau khi thêm
        setShowModal(false);
        setFormData({
          username: '',
          password: '',
          fullName: '',
          email: '',
          phone: '',
          role: 'staff'
        });
      }
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
    }
  };

  // Xử lý sửa người dùng
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/users/${editingUser.user_id}`, formData);
      if (response.data.success) {
        fetchData(); // Refresh data sau khi sửa
        setShowModal(false);
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Lỗi khi sửa người dùng:', error);
    }
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const response = await api.delete(`/api/users/${userId}`);
        if (response.data.success) {
          fetchData(); // Refresh data sau khi xóa
        }
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
      }
    }
  };

  return (
    <div className="users-container">
      <h2>Quản lý người dùng</h2>
      <button 
        className="add-btn"
        onClick={() => {
          setEditingUser(null);
          setFormData({
            username: '',
            password: '',
            fullName: '',
            email: '',
            phone: '',
            role: 'staff'
          });
          setShowModal(true);
        }}
      >
        Thêm người dùng mới
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</td>
              <td>
                <button 
                  className="edit-btn"
                  onClick={() => {
                    setEditingUser(user);
                    setFormData({
                      username: user.username,
                      fullName: user.full_name,
                      email: user.email,
                      phone: user.phone || '',
                      role: user.role
                    });
                    setShowModal(true);
                  }}
                >
                  Sửa
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.user_id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}</h3>
            <form onSubmit={editingUser ? handleEditUser : handleAddUser}>
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label>Họ tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="staff">Nhân viên</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {editingUser ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                  }}
                >
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

export default Users;
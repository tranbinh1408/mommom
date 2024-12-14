import React from 'react';

const Users = ({ users, handleDeleteUser }) => {
  return (
    <div className="users-container">
      <h2>Quản lý người dùng</h2>
      <button className="add-btn">Thêm người dùng</button>
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
                <button className="edit-btn">Sửa</button>
                <button className="delete-btn" onClick={() => handleDeleteUser(user.user_id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
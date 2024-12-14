import React from 'react';

const Orders = ({ orders, handleUpdateStatus }) => {
  return (
    <div className="orders-container">
      <h2>Quản lý đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map(order => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.customer_name}</td>
              <td>{order.total_amount.toLocaleString('vi-VN')}đ</td>
              <td>
                <select 
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="preparing">Đang chuẩn bị</option>
                  <option value="ready">Sẵn sàng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </td>
              <td>
                <button className="view-btn">Chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
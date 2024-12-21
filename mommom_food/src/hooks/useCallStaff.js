import { useState } from 'react';
import axios from 'axios';

export const useCallStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tableNumber = localStorage.getItem('selectedTable');
      if (!tableNumber) {
        throw new Error('Không tìm thấy thông tin bàn');
      }

      const response = await axios.post('http://localhost:5000/api/notify/call-staff', {
        tableId: tableNumber
      });

      if (response.data.success) {
        alert('Nhân viên sẽ đến ngay!');
      }
    } catch (err) {
      setError(err.message);
      alert('Không thể gọi nhân viên: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return { callStaff, loading, error };
};
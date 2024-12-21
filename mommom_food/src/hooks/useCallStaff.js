import { useState } from 'react';
import axios from 'axios';

export const useCallStaff = () => {
  const [isLoading, setIsLoading] = useState(false);

  const callStaff = async () => {
    const selectedTable = localStorage.getItem('selectedTable');
    
    if (!selectedTable) {
      alert('Vui lòng quét mã QR bàn trước khi gọi nhân viên');
      return false;
    }

    try {
      setIsLoading(true);
      await axios.post('http://localhost:5000/api/notify/staff', {
        table: selectedTable,
        message: `Bàn ${selectedTable} khách hàng cần trợ giúp`
      });
      alert('Đã gọi nhân viên, nhân viên sẽ đến ngay!');
      return true;
    } catch (error) {
      console.error('Error calling staff:', error);
      alert('Không thể gọi nhân viên, vui lòng thử lại sau');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { callStaff, isLoading };
}; 
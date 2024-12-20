import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TableRedirect = () => {
  const { tableNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (tableNumber) {
      // Lưu số bàn vào localStorage
      localStorage.setItem('selectedTable', tableNumber.toUpperCase());
      // Chuyển hướng về trang chủ
      navigate('/');
    }
  }, [tableNumber, navigate]);

  return null;
};

export default TableRedirect; 
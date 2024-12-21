import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/About.css';
import { useCallStaff } from '../../hooks/useCallStaff';

const About = () => {
  const { callStaff, loading } = useCallStaff();

  useEffect(() => {
    // Khởi tạo các scripts nếu cần
    const initializeScripts = () => {
      const $ = window.jQuery;
      if ($ && typeof $.fn.niceSelect === 'function') {
        $('select').niceSelect();
      }
    };

    // Đợi DOM và scripts load xong
    const timer = setTimeout(() => {
      initializeScripts();
    }, 1000);

    return () => {
      clearTimeout(timer);
      // Cleanup nếu cần
    };
  }, []);

  return (
    <div className="sub_page">
      <section className="about_section layout_padding">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="img-box">
                <img src="images/pho.png" alt="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-box">
                <div className="heading_container">
                  <h2>
                    Mommom food
                  </h2>
                </div>
                <p>
                Phở Việt Nam - tinh hoa ẩm thực truyền thống, hòa quyện hương vị đậm đà từ nước dùng thơm ngọt, bánh phở mềm mịn, và thịt bò hay gà tươi ngon, mang đến trải nghiệm khó quên trong từng bát phở.
                </p>
                <button 
                  className="call-staff-btn"
                  onClick={callStaff}
                  disabled={loading}
                >
                  {loading ? 'Đang gọi...' : 'Gọi nhân viên'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
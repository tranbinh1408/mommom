import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
      <footer className="footer_section">
        <div className="container" >
          <div className="row">
            <div className="col-md-4 footer-col">
              <div className="footer_contact">
                <h4>
                  Về chúng tôi
                </h4>
                <div className="contact_link_box">
                  <a href="">
                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                    <span>
                      Địa chỉ
                    </span>
                  </a>
                  <a href="">
                    <i className="fa fa-phone" aria-hidden="true"></i>
                    <span>
                      Sđt: 123456789
                    </span>
                  </a>
                  <a href="">
                    <i className="fa fa-envelope" aria-hidden="true"></i>
                    <span>
                      Mommomfood@gmail.com
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4 footer-col">
              <div className="footer_detail">
                <a href="" className="footer-logo">
                  Mommom food
                </a>
                <p>
                Thưởng thức hương vị tươi ngon mỗi ngày cùng Mommom Food – Nơi gắn kết yêu thương qua từng món ăn!
                </p>
                {/* <div className="footer_social">
                  <a href="">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                  </a>
                  <a href="">
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                  </a>
                  <a href="">
                    <i className="fa fa-linkedin" aria-hidden="true"></i>
                  </a>
                  <a href="">
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                  </a>
                  <a href="">
                    <i className="fa fa-pinterest" aria-hidden="true"></i>
                  </a>
                </div> */}
              </div>
            </div>
            <div className="col-md-4 footer-col">
              <h4>
                Giờ mở cửa
              </h4>
              <p>
                Các ngày trong tuần
              </p>
              <p>
                10.00 Am -10.00 Pm
              </p>
            </div>
          </div>
          <div className="footer-info">
            <p>
              &copy; <span>{currentYear}</span> {/* Thay đổi ở đây */}
              Mọi quyền được bảo lưu bởi
              Mommom Food<br/><br/>
              <a href="https://yourwebsite.com" target="_blank">Mommom Food Team</a>
            </p>
          </div>
        </div>
    </footer>
  );
}

export default Footer;
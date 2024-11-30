import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
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
      {/* Hero Area */}
      {/* <div className="hero_area">
        <div className="bg-box">
          <img src="images/hero-bg.jpg" alt="" />
        </div>
      </div> */}

      {/* About Section */}
      <section className="about_section layout_padding">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="img-box">
                <img src="images/about-img.png" alt="" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="detail-box">
                <div className="heading_container">
                  <h2>
                    We Are Feane
                  </h2>
                </div>
                <p>
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration
                  in some form, by injected humour, or randomised words which don't look even slightly believable. If you
                  are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in
                  the middle of text. All
                </p>
                <a href="">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
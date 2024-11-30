import React, { useEffect, useState } from 'react';

const BookTable = () => {
  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    persons: '',
    date: ''
  });

  useEffect(() => {
    const initializeScripts = () => {
      const $ = window.jQuery;
      // Khởi tạo Nice Select nếu có
      if ($ && typeof $.fn.niceSelect === 'function') {
        $('select').niceSelect();
      }
    };

    const initializeMap = () => {
      if (window.google && window.google.maps) {
        const map = new window.google.maps.Map(document.getElementById('googleMap'), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
      }
    };

    // Đợi DOM và scripts load xong
    const timer = setTimeout(() => {
      initializeScripts();
      initializeMap();
    }, 1000);

    return () => {
      clearTimeout(timer);
      // Cleanup nice select nếu cần
      const $ = window.jQuery;
      if ($ && $('select').data('niceSelect')) {
        $('select').niceSelect('destroy');
      }
    };
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit form ở đây
    console.log('Form submitted:', formData);
    // TODO: Gửi data đến server
  };
  return (
    <div className="sub_page">
      {/* Hero Area */}
      {/* <div className="hero_area">
        <div className="bg-box">
          <img src="images/hero-bg.jpg" alt="" />
        </div>
      </div> */}

      {/* Book Section */}
      <section className="book_section layout_padding">
        <div className="container">
          <div className="heading_container">
            <h2>
              Book A Table
            </h2>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form_container">
                <form action="">
                  <div>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Your Name" 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Phone Number" 
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Your Email" 
                    />
                  </div>
                  <div>
                    <select className="form-control nice-select wide">
                      <option value="" disabled selected>
                        How many persons?
                      </option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <div>
                    <input 
                      type="date" 
                      className="form-control" 
                    />
                  </div>
                  <div className="btn_box">
                    <button>
                      Book Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <div className="map_container">
                <div id="googleMap"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookTable;
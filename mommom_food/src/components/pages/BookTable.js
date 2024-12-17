import React, { useEffect, useState } from 'react';
import './styles/BookTable.css';
const BookTable = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    persons: '',
    date: ''
  });

  useEffect(() => {
    // Load Google Maps Script
    const loadGoogleMapsScript = () => {
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY`; // Thay YOUR_ACTUAL_API_KEY bằng key thật từ Google Cloud Console
      googleMapScript.async = true;
      googleMapScript.defer = true;
      window.document.body.appendChild(googleMapScript);

      googleMapScript.addEventListener('load', () => {
        initializeMap();
      });
    };

    // Initialize map
    const initializeMap = () => {
      const mapDiv = document.getElementById('googleMap');
      if (mapDiv && window.google) {
        const map = new window.google.maps.Map(mapDiv, {
          center: { lat: 10.8231, lng: 106.6297 }, // Tọa độ TP.HCM
          zoom: 15,
        });

        // Add marker
        new window.google.maps.Marker({
          position: { lat: 10.8231, lng: 106.6297 },
          map: map,
          title: 'Mommom Food'
        });
      }
    };

    // Initialize Nice Select
    const initializeNiceSelect = () => {
      const $ = window.jQuery;
      if ($ && typeof $.fn.niceSelect === 'function') {
        $('select').niceSelect();
      }
    };

    // Load scripts
    const timer = setTimeout(() => {
      loadGoogleMapsScript();
      initializeNiceSelect();
    }, 1000);

    return () => {
      clearTimeout(timer);
      const $ = window.jQuery;
      if ($ && $('select').data('niceSelect')) {
        $('select').niceSelect('destroy');
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="sub_page">
      <section className="book_section layout_padding">
        <div className="container">
          <div className="heading_container">
            <h2>Đặt bàn</h2>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form_container">
                <form onSubmit={handleSubmit}>
                  <div>
                    <input 
                      type="text" 
                      name="name"
                      className="form-control" 
                      placeholder="Tên"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="phone"
                      className="form-control" 
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      name="email"
                      className="form-control" 
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <select 
                      name="persons"
                      className="form-control nice-select wide"
                      value={formData.persons}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Bạn có bao nhiêu người?</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <div>
                    <input 
                      type="date" 
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="btn_box">
                    <button type="submit">Đặt ngay</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <div className="map_container">
                <div id="googleMap" style={{height: '400px', width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookTable;
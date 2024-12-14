import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

const ProductModal = ({ show, handleClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  
  if (!product) return null;
  
  const totalPrice = product.price * quantity;

  return (
    <Modal 
      show={show} 
      onHide={handleClose}
      centered // Thêm prop này để căn giữa
    >
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="product-detail">
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ maxWidth: '200px', marginBottom: '20px', borderRadius: '10px' }}
          />
          <div className="quantity-selector">
            <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
            <span className="quantity">{quantity}</span>
            <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
          </div>
          <div className="price-detail">
            <p>Đơn giá: ${product.price}</p>
            <p>Tổng tiền: ${totalPrice}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose}>Đóng</button>
        <button onClick={() => {
          console.log('Thêm vào giỏ:', { ...product, quantity, totalPrice });
          handleClose();
        }}>Thêm vào giỏ</button>
        <button onClick={() => {
          console.log('Đặt hàng ngay:', { ...product, quantity, totalPrice });
          handleClose();
        }}>Đặt hàng ngay</button>
      </Modal.Footer>
    </Modal>
  );
};
const Home = () => {
  const [activeFilter, setActiveFilter] = useState('*');

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    };
  
  useEffect(() => {
    const initializeScripts = () => {
      const $ = window.jQuery;
      
      // Khởi tạo Isotope
      if ($ && typeof $.fn.isotope === 'function') {
        const grid = $('.grid').isotope({
          itemSelector: '.all',
          layoutMode: 'fitRows'
        });
        
        $('.filters_menu li').on('click', function() {
          $('.filters_menu li').removeClass('active');
          $(this).addClass('active');
          
          const dataFilter = $(this).attr('data-filter');
          setActiveFilter(dataFilter);
          
          grid.isotope({
            filter: dataFilter
          });
        });
      }

      // Khởi tạo Owl Carousel
      if ($ && typeof $.fn.owlCarousel === 'function') {
        $('.client_owl-carousel').owlCarousel({
          loop: true,
          margin: 20,
          dots: false,
          nav: true,
          navText: [],
          autoplay: true,
          autoplayHoverPause: true,
          responsive: {
            0: {
              items: 1
            },
            768: {
              items: 2
            }
          }
        });
      }

      // Khởi tạo Nice Select cho form
      if ($ && typeof $.fn.niceSelect === 'function') {
        $('select').niceSelect();
      }

      // Khởi tạo Google Maps
      const initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('googleMap'), {
          center: { lat: 10.8231, lng: 106.6297 }, // Tọa độ TP.HCM
          zoom: 14,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [
                {
                  saturation: 36
                },
                {
                  color: "#000000"
                },
                {
                  lightness: 40
                }
              ]
            }
          ]
        });

        // Thêm marker
        new window.google.maps.Marker({
          position: { lat: 10.8231, lng: 106.6297 },
          map: map,
          title: 'Our Restaurant'
        });
      };

      // Load Google Maps Script
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`; // Thay YOUR_GOOGLE_MAPS_API_KEY bằng API key của bạn
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    // Đợi DOM và scripts load xong
    const timer = setTimeout(() => {
      initializeScripts();
    }, 1000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      const $ = window.jQuery;
      if ($ && $('.grid').data('isotope')) {
        $('.grid').isotope('destroy');
      }
      if ($ && $('.client_owl-carousel').data('owlCarousel')) {
        $('.client_owl-carousel').owlCarousel('destroy');
      }
    };
  }, []);
  return (
    <div>
      {/* <div className="hero_area">
        <div className="bg-box">
          <img src="images/hero-bg.jpg" alt="" />
        </div>
        <section className="slider_section ">
          <div id="customCarousel1" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="container ">
                  <div className="row">
                    <div className="col-md-7 col-lg-6 ">
                      <div className="detail-box">
                        <h1>
                          Fast Food Restaurant
                        </h1>
                        <p>
                          Doloremque, itaque aperiam facilis rerum, commodi, temporibus sapiente ad mollitia laborum quam quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos nihil ducimus libero ipsam.
                        </p>
                        <div className="btn-box">
                          <a href="" className="btn1">
                            Order Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item ">
                <div className="container ">
                  <div className="row">
                    <div className="col-md-7 col-lg-6 ">
                      <div className="detail-box">
                        <h1>
                          Fast Food Restaurant
                        </h1>
                        <p>
                          Doloremque, itaque aperiam facilis rerum, commodi, temporibus sapiente ad mollitia laborum quam quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos nihil ducimus libero ipsam.
                        </p>
                        <div className="btn-box">
                          <a href="" className="btn1">
                            Order Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="container ">
                  <div className="row">
                    <div className="col-md-7 col-lg-6 ">
                      <div className="detail-box">
                        <h1>
                          Fast Food Restaurant
                        </h1>
                        <p>
                          Doloremque, itaque aperiam facilis rerum, commodi, temporibus sapiente ad mollitia laborum quam quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos nihil ducimus libero ipsam.
                        </p>
                        <div className="btn-box">
                          <a href="" className="btn1">
                            Order Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <ol className="carousel-indicators">
                <li data-target="#customCarousel1" data-slide-to="0" className="active"></li>
                <li data-target="#customCarousel1" data-slide-to="1"></li>
                <li data-target="#customCarousel1" data-slide-to="2"></li>
              </ol>
            </div>
          </div>

        </section>
       
      </div> */}
 {/* end slider section */}
       {/* about section */}

       <section className="about_section layout_padding">
        <div className="container  ">

          <div className="row">
            <div className="col-md-6 ">
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
                <a href="">
                  Thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* end about section */}
      {/* offer section */}

      <section className="offer_section layout_padding-bottom">
        <div className="offer_container">
          <div className="container ">
            <div className="row">
              <div className="col-md-6  ">
                <div className="box ">
                  <div className="img-box">
                    <img src="images/o1.jpg" alt="" / >
                  </div>
                  <div className="detail-box">
                    <h5>
                      Tasty Thursdays
                    </h5>
                    <h6>
                      <span>20%</span> Off
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-6  ">
                <div className="box ">
                  <div className="img-box">
                    <img src="images/o2.jpg" alt="" />
                  </div>
                  <div className="detail-box">
                    <h5>
                      Pizza Days
                    </h5>
                    <h6>
                      <span>15%</span> Off
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* end offer section */}

      {/* food section */}

      <section className="food_section layout_padding-bottom">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Thực đơn
            </h2>
          </div>

          <ul className="filters_menu">
            <li className="active" data-filter="*">Tất cả</li>
            <li data-filter=".burger">Phở/Bún</li>
            <li data-filter=".pizza">Cơm</li>
            <li data-filter=".pasta">Đồ uống</li>
            {/* <li data-filter=".fries">Fries</li> */}
          </ul>

          <div className="filters-content">
            <div className="row grid">
              <div className="col-sm-6 col-lg-4 all burger">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/pho.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Phở bò
                      </h5>
                      {/* <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p> */}
                    <div className="options">
                      <h6>$20</h6>
                      <button 
                        className="cart-btn"
                        onClick={() => handleShowModal({
                          id: 1,
                          name: 'Phở bò',
                          price: 20,
                          image: 'images/pho.png'
                        })}
                      >
                        <i className="fa fa-shopping-cart"></i>
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 all pizza">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/comtam.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Cơm tấm
                      </h5>
                      {/* <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p> */}
                    <div className="options">
                      <h6>$20</h6>
                      <button 
                        className="cart-btn"
                        onClick={() => handleShowModal({
                          id: 1,
                          name: 'Cơm tấm',
                          price: 20,
                          image: 'images/comtam.png'
                        })}
                      >
                        <i className="fa fa-shopping-cart"></i>
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 all pizza">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/comgaxoimo.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Cơm gà xối mỡ
                      </h5>
                      {/* <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p> */}
                    <div className="options">
                      <h6>$20</h6>
                      <button 
                        className="cart-btn"
                        onClick={() => handleShowModal({
                          id: 1,
                          name: 'Cơm gà xối mỡ',
                          price: 15,
                          image: 'images/comgaxoimo.png'
                        })}
                      >
                      <i className="fa fa-shopping-cart"></i>
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-sm-6 col-lg-4 all burger">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/buncha.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Bún chả
                      </h5>
                      <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p>
                      <div className="options">
                        <h6>
                          $18
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="col-sm-6 col-lg-4 all burger">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/bunbohue.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Bún bò huế
                      </h5>
                      {/* <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p> */}
                      <div className="options">
                        <h6>$20</h6>
                        <button 
                          className="cart-btn"
                          onClick={() => handleShowModal({
                            id: 1,
                            name: 'Bún bò huế',
                            price: 20,
                            image: 'images/bunbohue.png'
                          })}
                        >
                          <i className="fa fa-shopping-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 all burger">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/bundau.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Bún đậu
                      </h5>
                      {/* <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p> */}
                      <div className="options">
                        <h6>$15</h6>
                        <button 
                          className="cart-btn"
                          onClick={() => handleShowModal({
                            id: 1,
                            name: 'Bún đậu',
                            price: 15,
                            image: 'images/bundau.png'
                          })}
                          >
                          <i className="fa fa-shopping-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 all burger">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/banhcuon.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Bánh cuốn nóng
                      </h5>
                      {/* <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p> */}
                      <div className="options">
                        <h6>$15</h6>
                        <button 
                          className="cart-btn"
                          onClick={() => handleShowModal({
                            id: 1,
                            name: 'Bánh cuốn nóng',
                            price: 15,
                            image: 'images/banhcuon.png'
                          })}
                        >
                          <i className="fa fa-shopping-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 all burger">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/miquang.png" alt="" / >
                    </div>
                    <div className="detail-box">
                      <h5>
                        Mì quảng
                      </h5>
                      {/* <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p> */}
                    <div className="options">
                      <h6>$20</h6>
                      <button 
                        className="cart-btn"
                        onClick={() => handleShowModal({
                          id: 1,
                          name: 'Mì quảng',
                          price: 20,
                          image: 'images/miquang.png'
                        })}
                      >
                        <i className="fa fa-shopping-cart"></i>
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 all burger">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/buncha.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Bún chả
                      </h5>
                      {/* <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p> */}
                      <div className="options">
                        <h6>$20</h6>
                        <button 
                          className="cart-btn"
                          onClick={() => handleShowModal({
                            id: 1,
                            name: 'Bún chả',
                            price: 20,
                            image: 'images/buncha.png'
                          })}
                        >
                          <i className="fa fa-shopping-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-box">
            <a href="">
              Xem thêm
            </a>
          </div>
        </div>
      </section>
      <ProductModal 
      show={showModal}
      handleClose={() => setShowModal(false)}
      product={selectedProduct}
      />

      {/* end food section */}


      {/* book section */}
      <section className="book_section layout_padding">
        <div className="container">
          <div className="heading_container">
            <h2>
              Đặt bàn
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
                      placeholder="Tên" 
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Số điện thoại" 
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Email" 
                    />
                  </div>
                  <div>
                    <select className="form-control nice-select wide">
                      <option value="" disabled selected>
                        Bạn có bao nhiêu người?
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
                      Đặt ngay
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
      {/* end book section */}

      {/* client section */}

      {/* <section className="client_section layout_padding-bottom">
        <div className="container">
          <div className="heading_container heading_center psudo_white_primary mb_45">
            <h2>
              What Says Our Customers
            </h2>
          </div>
          <div className="carousel-wrap row ">
            <div className="owl-carousel client_owl-carousel">
              <div className="item">
                <div className="box">
                  <div className="detail-box">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                    </p>
                    <h6>
                      Moana Michell
                    </h6>
                    <p>
                      magna aliqua
                    </p>
                  </div>
                  <div className="img-box">
                    <img src="images/client1.jpg" alt="" className="box-img" />
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="box">
                  <div className="detail-box">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                    </p>
                    <h6>
                      Mike Hamell
                    </h6>
                    <p>
                      magna aliqua
                    </p>
                  </div>
                  <div className="img-box">
                    <img src="images/client2.jpg" alt="" className="box-img" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* end client section */}

    </div>
  );
}

export default Home;
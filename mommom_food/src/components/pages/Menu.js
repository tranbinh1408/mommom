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
const Menu = () => {
  const [activeFilter, setActiveFilter] = useState('*');

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShowModal = (product) => {
  setSelectedProduct(product);
  setShowModal(true);
  };

  useEffect(() => {
    const initializeIsotope = () => {
      const $ = window.jQuery;
      if ($ && typeof $.fn.isotope === 'function') {
        const grid = $('.grid').isotope({
          itemSelector: '.all',
          layoutMode: 'fitRows'
        });

        // Khởi tạo filter
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
    };

    // Đợi DOM và scripts load xong
    const timer = setTimeout(() => {
      initializeIsotope();
    }, 1000);

    return () => {
      clearTimeout(timer);
      // Cleanup isotope nếu cần
      const $ = window.jQuery;
      if ($ && $('.grid').data('isotope')) {
        $('.grid').isotope('destroy');
      }
    };
  }, []);

  const menuItems = [
    {
      id: 1,
      category: 'pizza',
      image: 'images/f1.png',
      name: 'Delicious Pizza',
      description: 'Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque',
      price: 20
    },
    {
      id: 2,
      category: 'burger',
      image: 'images/f2.png',
      name: 'Delicious Burger',
      description: 'Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque',
      price: 15
    },
    {
      id: 3,
      category: 'pizza',
      image: 'images/f3.png',
      name: 'Supreme Pizza',
      description: 'Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque',
      price: 17
    },
    {
      id: 4,
      category: 'pasta',
      image: 'images/f4.png',
      name: 'Delicious Pasta',
      description: 'Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque',
      price: 18
    },
    {
      id: 5,
      category: 'fries',
      image: 'images/f5.png',
      name: 'French Fries',
      description: 'Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque',
      price: 10
    },
    {
      id: 6,
      category: 'pizza',
      image: 'images/f6.png',
      name: 'Delicious Pizza',
      description: 'Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque',
      price: 15
    },
    {
      id: 7,
      category: 'burger',
      image: 'images/f7.png',
      name: 'Tasty Burger',
      description: 'Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque',
      price: 12
    },
    {
      id: 8,
      category: 'burger',
      image: 'images/f8.png',
      name: 'Tasty Burger',
      description: 'Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque',
      price: 14
    },
    {
      id: 9,
      category: 'pasta',
      image: 'images/f9.png',
      name: 'Special Pasta',
      description: 'Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque',
      price: 16
    }
  ];

  return (
  <div className="sub_page">
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
  </div>
  );
}

export default Menu;
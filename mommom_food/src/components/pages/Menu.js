import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        if (response.data.success) {
          setProducts(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải danh sách sản phẩm');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const initializeIsotope = () => {
      const $ = window.jQuery;
      if ($ && typeof $.fn.isotope === 'function' && products.length > 0) {
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
    };

    const timer = setTimeout(() => {
      initializeIsotope();
    }, 1000);

    return () => {
      clearTimeout(timer);
      const $ = window.jQuery;
      if ($ && $('.grid').data('isotope')) {
        $('.grid').isotope('destroy');
      }
    };
  }, [products]);

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="sub_page">
      <section className="food_section layout_padding-bottom">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>Thực đơn</h2>
          </div>

          <ul className="filters_menu">
            <li className="active" data-filter="*">Tất cả</li>
            <li data-filter=".burger">Phở/Bún</li>
            <li data-filter=".pizza">Cơm</li>
            <li data-filter=".pasta">Đồ uống</li>
          </ul>

          <div className="filters-content">
            <div className="row grid">
              {products.map(product => (
                <div key={product.product_id} className={`col-sm-6 col-lg-4 all ${product.category_name?.toLowerCase()}`}>
                  <div className="box">
                    <div>
                      <div className="img-box">
                        <img src={product.image_url} alt={product.name} />
                      </div>
                      <div className="detail-box">
                        <h5>{product.name}</h5>
                        <div className="options">
                          <h6>${product.price}</h6>
                          <button 
                            className="cart-btn"
                            onClick={() => handleShowModal({
                              id: product.product_id,
                              name: product.name,
                              price: product.price,
                              image: product.image_url
                            })}
                          >
                            <i className="fa fa-shopping-cart"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
};

export default Menu;
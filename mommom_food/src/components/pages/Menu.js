import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [activeFilter, setActiveFilter] = useState('*');

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
                        <h6>
                          $20
                        </h6>
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
                        <h6>
                          $15
                        </h6>
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
                        <h6>
                          $17
                        </h6>
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
                        <h6>
                          $10
                        </h6>
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
                        <h6>
                          $15
                        </h6>
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
                        <h6>
                          $12
                        </h6>
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
                        <h6>
                          $14
                        </h6>
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
                        <h6>
                          $10
                        </h6>
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
  </div>
  );
}

export default Menu;
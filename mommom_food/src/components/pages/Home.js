import React, { useEffect } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'owl.carousel/dist/owl.carousel.min.js';
import 'jquery-nice-select';
function Home() {
    useEffect(() => {
        const loadScripts = async () => {
        try {
            // Đảm bảo jQuery được load trước
            window.jQuery = window.$ = $;
            
            // Đợi một chút để đảm bảo DOM đã được render
            await new Promise(resolve => setTimeout(resolve, 100));

            // Khởi tạo Owl Carousel
            if (typeof $('.owl-carousel').owlCarousel === 'function') {
            $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
                nav: true,
                responsive: {
                0: { items: 1 },
                600: { items: 3 },
                1000: { items: 5 }
                }
            });
            }

            // Khởi tạo Nice Select
            if (typeof $('select').niceSelect === 'function') {
            $('select').niceSelect();
            }

            // Khởi tạo Google Map
            const initMap = () => {
            const map = new window.google.maps.Map(document.getElementById('googleMap'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });
            };

            if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
            script.async = true;
            script.defer = true;
            script.onload = initMap;
            document.head.appendChild(script);
            } else {
            initMap();
            }
        } catch (error) {
            console.error('Error loading scripts:', error);
        }
        };

        loadScripts();
    }, []);

  return (
    <div>
      <div className="hero_area">
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
        {/* end slider section */}
      </div>

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
              Our Menu
            </h2>
          </div>

          <ul className="filters_menu">
            <li className="active" data-filter="*">All</li>
            <li data-filter=".burger">Burger</li>
            <li data-filter=".pizza">Pizza</li>
            <li data-filter=".pasta">Pasta</li>
            <li data-filter=".fries">Fries</li>
          </ul>

          <div className="filters-content">
            <div className="row grid">
              <div className="col-sm-6 col-lg-4 all pizza">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/f1.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Delicious Pizza
                      </h5>
                      <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p>
                      <div className="options">
                        <h6>
                          $20
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
                      <img src="images/f2.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Delicious Burger
                      </h5>
                      <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p>
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
                      <img src="images/f3.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Delicious Pizza
                      </h5>
                      <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p>
                      <div className="options">
                        <h6>
                          $17
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 all pasta">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/f4.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Delicious Pasta
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
              </div>
              <div className="col-sm-6 col-lg-4 all fries">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/f5.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        French Fries
                      </h5>
                      <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p>
                      <div className="options">
                        <h6>
                          $10
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
                      <img src="images/f6.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Delicious Pizza
                      </h5>
                      <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p>
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
                      <img src="images/f7.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Tasty Burger
                      </h5>
                      <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p>
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
                      <img src="images/f8.png" alt="" / >
                    </div>
                    <div className="detail-box">
                      <h5>
                        Tasty Burger
                      </h5>
                      <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p>
                      <div className="options">
                        <h6>
                          $14
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 all pasta">
                <div className="box">
                  <div>
                    <div className="img-box">
                      <img src="images/f9.png" alt="" />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Delicious Pasta
                      </h5>
                      <p>
                        Veniam debitis quaerat officiis quasi cupiditate quo, quisquam velit, magnam voluptatem repellendus sed eaque
                      </p>
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
              View More
            </a>
          </div>
        </div>
      </section>

      {/* end food section */}

      {/* about section */}

      <section className="about_section layout_padding">
        <div className="container  ">

          <div className="row">
            <div className="col-md-6 ">
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

      {/* end about section */}

      {/* book section */}
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
                    <input type="text" className="form-control" placeholder="Your Name" />
                  </div>
                  <div>
                    <input type="text" className="form-control" placeholder="Phone Number" />
                  </div>
                  <div>
                    <input type="email" className="form-control" placeholder="Your Email" />
                  </div>
                  <div>
                    <select className="form-control nice-select wide">
                      <option value="" disabled selected>
                        How many persons?
                      </option>
                      <option value="">
                        2
                      </option>
                      <option value="">
                        3
                      </option>
                      <option value="">
                        4
                      </option>
                      <option value="">
                        5
                      </option>
                    </select>
                  </div>
                  <div>
                    <input type="date" className="form-control" />
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
              <div className="map_container ">
                <div id="googleMap"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end book section */}

      {/* client section */}

      <section className="client_section layout_padding-bottom">
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
      </section>
      {/* end client section */}

    </div>
  );
}

export default Home;
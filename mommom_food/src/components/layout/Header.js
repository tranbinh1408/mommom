import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header_section">
      <div className="container">
        <nav className="navbar navbar-expand-lg custom_nav-container">
          <Link className="navbar-brand" to="/">
            <span>
              Feane
            </span>
          </Link>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className=""> </span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto">
              <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                <Link className="nav-link" to="/">HOME</Link>
              </li>
              <li className={`nav-item ${location.pathname === '/menu' ? 'active' : ''}`}>
                <Link className="nav-link" to="/menu">MENU</Link>
              </li>
              <li className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
                <Link className="nav-link" to="/about">ABOUT</Link>
              </li>
              <li className={`nav-item ${location.pathname === '/book' ? 'active' : ''}`}>
                <Link className="nav-link" to="/book">BOOK TABLE</Link>
              </li>
            </ul>
            <div className="user_option">
              <Link to="/profile" className="user_link">
                <i className="fa fa-user" aria-hidden="true"></i>
              </Link>
              <Link to="/cart" className="cart_link">
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
              </Link>
              <Link to="/search" className="search_link">
                <i className="fa fa-search" aria-hidden="true"></i>
              </Link>
              <Link to="/order" className="order_online">
                Order Online
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
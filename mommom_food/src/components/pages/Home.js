import React from 'react';
import Menu from './Menu';
import BookTable from './BookTable';
import About from './About';
import './styles/Home.css';
// import Header from '../layout/Header';
// import Footer from '../layout/Footer';

const Home = () => {
  return (
    <div>
      {/* Header */}
      {/* <Header /> */}

      {/* About Section */}
      <About />

      {/* Menu Section */}
      <Menu />

      {/* Book Table Section */}
      <BookTable />

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default Home;
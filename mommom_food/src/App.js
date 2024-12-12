import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Menu from './components/pages/Menu';
import BookTable from './components/pages/BookTable';
import Admin from './Admin/Admin'; // Updated import path

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<><Header /><Home /><Footer /></>} />
        <Route path="/about" element={<><Header /><About /><Footer /></>} />
        <Route path="/menu" element={<><Header /><Menu /><Footer /></>} />
        <Route path="/book" element={<><Header /><BookTable /><Footer /></>} />
        
        {/* Admin route */}
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
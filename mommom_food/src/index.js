// React và ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// jQuery
import $ from 'jquery';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Owl Carousel
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'owl.carousel';

// jQuery Nice Select
import 'jquery-nice-select/css/nice-select.css';
import 'jquery-nice-select';

// Isotope
import 'isotope-layout';

// Local files
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Set jQuery to window object
window.jQuery = window.$ = $;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const tableRoutes = require('./routes/tableRoutes');
const userRoutes = require('./routes/userRoutes');
const takeawayOrderRoutes = require('./routes/takeawayOrderRoutes');
const notifyRoutes = require('./routes/notifyRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Import middleware
const auth = require('./middleware/auth');

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://kind-trust-production.up.railway.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan('dev')); // logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Thêm logging middleware trước khi định nghĩa routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Thêm logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/users', userRoutes);
app.use('/api/takeaway-orders', takeawayOrderRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/stats', statsRoutes);

// Then serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../mommom_food/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../mommom_food/build/index.html'));
  });
}

// Error handling last
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500);
  res.json({
    success: false,
    message: error.message,
    error: process.env.NODE_ENV === 'development' ? error : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;

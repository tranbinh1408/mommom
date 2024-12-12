const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductsByCategory);

// Protected routes - cần quyền admin
router.post('/', auth.verifyToken, auth.checkRole(['admin']), productController.createProduct);
router.put('/:id', auth.verifyToken, auth.checkRole(['admin']), productController.updateProduct);
router.delete('/:id', auth.verifyToken, auth.checkRole(['admin']), productController.deleteProduct);

module.exports = router;
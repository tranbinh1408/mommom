const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes
router.post('/', auth.verifyToken, auth.checkRole(['admin']), categoryController.createCategory);
router.put('/:id', auth.verifyToken, auth.checkRole(['admin']), categoryController.updateCategory);
router.delete('/:id', auth.verifyToken, auth.checkRole(['admin']), categoryController.deleteCategory);

module.exports = router;
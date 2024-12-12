const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/login', userController.login);
router.post('/create-admin', userController.createFirstAdmin); // Thêm route này

// Protected routes
router.get('/profile', auth.verifyToken, userController.getProfile);
router.put('/profile', auth.verifyToken, userController.updateProfile);

// Admin only routes
router.get('/', auth.verifyToken, auth.checkRole(['admin']), userController.getAllUsers);
router.post('/', auth.verifyToken, auth.checkRole(['admin']), userController.createUser);
router.put('/:id', auth.verifyToken, auth.checkRole(['admin']), userController.updateUser);
router.delete('/:id', auth.verifyToken, auth.checkRole(['admin']), userController.deleteUser);

module.exports = router;
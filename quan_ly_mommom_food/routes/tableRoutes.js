const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', tableController.getAllTables);
router.get('/:id', tableController.getTableById);

// Protected routes
router.post('/', auth.verifyToken, auth.checkRole(['admin']), tableController.createTable);
router.put('/:id', auth.verifyToken, auth.checkRole(['admin', 'staff']), tableController.updateTable);
router.put('/:id/status', auth.verifyToken, auth.checkRole(['admin', 'staff']), tableController.updateTableStatus);
router.delete('/:id', auth.verifyToken, auth.checkRole(['admin']), tableController.deleteTable);

module.exports = router;

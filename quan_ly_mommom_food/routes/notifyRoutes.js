const express = require('express');
const router = express.Router();
const controller = require('../controllers/notifyController');

// Debug log
console.log('Controller functions:', Object.keys(controller));

router.post('/staff', controller.notifyStaff);

module.exports = router; 
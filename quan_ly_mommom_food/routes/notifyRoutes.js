const express = require('express');
const router = express.Router();
const notifyController = require('../controllers/notifyController');

router.post('/call-staff', notifyController.callStaff);

module.exports = router;
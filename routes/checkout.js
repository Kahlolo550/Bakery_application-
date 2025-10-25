const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const checkoutController = require('../controllers/checkoutController');

router.post('/', authenticateToken, checkoutController.checkoutCart);

module.exports = router;
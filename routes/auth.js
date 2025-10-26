const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// ✅ Spread middleware arrays to avoid TypeError
router.post('/register/customer', ...authController.registerCustomer);
router.post('/register/retailer', ...authController.registerRetailer);
router.post('/login', ...authController.loginUser);

// ✅ Single function — no array, no spread needed
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
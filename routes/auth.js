const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Registration
router.post('/register/customer', ...authController.registerCustomer);
router.post('/register/retailer', ...authController.registerRetailer);

// Login
router.post('/login', ...authController.loginUser);
router.post('/login/retailer', ...authController.loginRetailer);

// Profile
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
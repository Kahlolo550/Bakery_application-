const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// ✅ DO NOT use parentheses after controller names
router.post('/register/customer', authController.registerCustomer);
router.post('/register/retailer', authController.registerRetailer);
router.post('/login', authController.loginUser);
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
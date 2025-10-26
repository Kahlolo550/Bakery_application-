const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// POST endpoints
router.post('/register/customer', authController.registerCustomer);
router.post('/register/retailer', authController.registerRetailer);
router.post('/login', authController.loginUser); // Single login endpoint

// GET profile endpoint
router.get('/me', verifyToken, authController.getProfile); // Single profile endpoint

module.exports = router;
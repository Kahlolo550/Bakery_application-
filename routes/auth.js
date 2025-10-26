const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// GET endpoints for browser checks
router.get('/register/customer', authController.getCustomerRegister);
router.get('/register/retailer', authController.getRetailerRegister);

// GET profile endpoints
router.get('/me/customer', verifyToken, authController.getCustomerProfile);
router.get('/me/retailer', verifyToken, authController.getRetailerProfile);

// POST endpoints
router.post('/register/customer', authController.registerCustomer);
router.post('/login/customer', authController.loginCustomer);
router.post('/register/retailer', authController.registerRetailer);
router.post('/login/retailer', authController.loginRetailer);

module.exports = router;
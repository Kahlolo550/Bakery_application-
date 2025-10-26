const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.get('/register/customer', authController.getCustomerRegister);
router.get('/register/retailer', authController.getRetailerRegister);

router.get('/me/customer', verifyToken, authController.getCustomerProfile);
router.get('/me/retailer', verifyToken, authController.getRetailerProfile);

router.post('/register/customer', authController.registerCustomer);
router.post('/login/customer', authController.loginCustomer);
router.post('/register/retailer', authController.registerRetailer);
router.post('/login/retailer', authController.loginRetailer);

module.exports = router;
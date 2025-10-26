const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register/customer', authController.getCustomerRegister);
router.get('/register/retailer', authController.getRetailerRegister);

router.post('/register/customer', authController.registerCustomer);
router.post('/login/customer', authController.loginCustomer);
router.post('/register/retailer', authController.registerRetailer);
router.post('/login/retailer', authController.loginRetailer);

module.exports = router;
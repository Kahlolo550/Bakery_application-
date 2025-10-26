const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/login', authController.loginUser);
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
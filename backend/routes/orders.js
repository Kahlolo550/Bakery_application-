const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const ordersController = require('../controllers/ordersController');

router.get('/', authenticateToken, ordersController.getRetailerOrders);
router.get('/customer', authenticateToken, ordersController.getCustomerOrders);
router.post('/', authenticateToken, ordersController.placeOrder);
router.patch('/:id/status', ordersController.updateOrderStatus);
router.delete('/:id', authenticateToken, ordersController.deleteOrder);

module.exports = router;
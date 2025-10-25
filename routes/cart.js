const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const cartController = require('../controllers/cartController');

router.get('/', authenticateToken, cartController.getCartItems);
router.post('/', authenticateToken, cartController.addToCart);
router.put('/:id', authenticateToken, cartController.updateCartItem);
router.delete('/:id', authenticateToken, cartController.removeCartItem);
router.post('/checkout', authenticateToken, cartController.checkoutCart);

module.exports = router;
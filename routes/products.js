const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const productsController = require('../controllers/productsController');

router.post('/', authenticateToken, productsController.createProduct);
router.get('/mine', authenticateToken, productsController.getRetailerProducts);
router.get('/all', productsController.getAllProducts);
router.delete('/:id', authenticateToken, productsController.deleteProduct);

module.exports = router;
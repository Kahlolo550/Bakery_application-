const db = require('../db');

exports.getRetailerProducts = async(req, res) => {
    const retailerId = req.user.id;
    try {
        const [products] = await db.query(
            'SELECT * FROM products WHERE retailerId = ? ORDER BY created_at DESC', [retailerId]
        );
        res.json(products);
    } catch (err) {
        console.error('Product fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

exports.getAllProducts = async(req, res) => {
    try {
        const [products] = await db.query(
            'SELECT p.*, r.storeName AS retailerName FROM products p JOIN retailers r ON p.retailerId = r.id ORDER BY p.created_at DESC'
        );
        const formatted = products.map((p) => ({
            ...p,
            photo: p.photo ? .startsWith('http') ?
                p.photo :
                `http://localhost:5000${p.photo}`,
        }));
        res.json({ count: formatted.length, products: formatted });
    } catch (err) {
        console.error('Customer product fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

exports.deleteProduct = async(req, res) => {
    const productId = req.params.id;
    const retailerId = req.user.id;
    try {
        const [result] = await db.query(
            'DELETE FROM products WHERE id = ? AND retailerId = ?', [productId, retailerId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Delete product error:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
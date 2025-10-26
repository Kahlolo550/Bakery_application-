const db = require('../db');

// Create a new product
exports.createProduct = async(req, res) => {
    const retailerId = req.user.id;
    const { name, price, category, description, photo } = req.body;

    if (!name || !price || !category || !description || !photo) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // ✅ Ensure photo path is stored as relative (e.g. /uploads/filename.jpg)
        const photoPath = photo.startsWith('/uploads') ? photo : `/uploads/${photo}`;

        const [result] = await db.query(
            'INSERT INTO products (name, price, category, description, photo, retailerId) VALUES (?, ?, ?, ?, ?, ?)', [name, price, category, description, photoPath, retailerId]
        );

        res.status(201).json({ message: 'Product created successfully', id: result.insertId });
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

// Get products for the logged-in retailer
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

// Get all products for customers
exports.getAllProducts = async(req, res) => {
    try {
        const [products] = await db.query(
            `SELECT p.*, r.storeName AS retailerName
       FROM products p
       JOIN retailers r ON p.retailerId = r.id
       ORDER BY p.created_at DESC`
        );

        // ✅ Return relative paths only, frontend will prepend API_BASE
        const formatted = products.map((p) => ({
            ...p,
            photo: p.photo,
        }));

        res.json({ count: formatted.length, products: formatted });
    } catch (err) {
        console.error('Customer product fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Delete a product (only by its retailer)
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
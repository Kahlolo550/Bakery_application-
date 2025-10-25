const db = require('../db');

exports.checkoutCart = async(req, res) => {
    const userId = req.user.id;
    const { address, phone, note } = req.body;

    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    if (!address || !phone) return res.status(400).json({ error: 'Address and phone required' });

    try {
        const [cartItems] = await db.query(
            'SELECT productId, quantity FROM cart WHERE userId = ?', [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        for (const item of cartItems) {
            await db.query(
                `INSERT INTO orders (userId, productId, quantity, orderDate, status, address, phone, note, created_at, updated_at)
         VALUES (?, ?, ?, NOW(), 'pending', ?, ?, ?, NOW(), NOW())`, [userId, item.productId, item.quantity, address, phone, note]
            );
        }

        await db.query('DELETE FROM cart WHERE userId = ?', [userId]);

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
        console.error('Checkout error:', err);
        res.status(500).json({ error: 'Failed to place order' });
    }
};
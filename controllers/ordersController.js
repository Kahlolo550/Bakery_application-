const db = require('../db');

function groupOrders(rows, includeCustomer = false) {
    const orders = [];
    const map = new Map();

    rows.forEach(row => {
        if (!map.has(row.orderId)) {
            map.set(row.orderId, {
                id: row.orderId,
                userId: row.userId,
                customerName: includeCustomer ? row.customerName : undefined,
                status: row.status,
                orderDate: row.orderDate,
                address: row.address,
                phone: row.phone,
                products: [],
            });
            orders.push(map.get(row.orderId));
        }
        map.get(row.orderId).products.push({
            id: row.productId,
            name: row.productName,
            photo: row.productPhoto,
            quantity: row.quantity,
        });
    });

    return orders;
}

exports.getRetailerOrders = async(req, res) => {
    const retailerId = req.user.id; // must match products.retailerId

    try {
        const [rows] = await db.query(`
      SELECT 
        o.id AS orderId,
        o.userId,
        o.status,
        o.orderDate,
        o.address,
        o.phone,
        u.fullName AS customerName,
        p.id AS productId,
        p.name AS productName,
        p.photo AS productPhoto,
        o.quantity AS quantity
      FROM orders o
      JOIN users u ON u.id = o.userId
      JOIN products p ON p.id = o.productId
      WHERE p.retailerId = ?        -- ✅ filter by retailerId
      ORDER BY o.orderDate DESC
    `, [retailerId]);

        res.json(groupOrders(rows, true));
    } catch (err) {
        console.error('Retailer order fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch retailer orders' });
    }
};

exports.getCustomerOrders = async(req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await db.query(`
      SELECT 
        o.id AS orderId,
        o.status,
        o.orderDate,
        o.address,
        o.phone,
        p.id AS productId,
        p.name AS productName,
        p.photo AS productPhoto,
        o.quantity AS quantity
      FROM orders o
      JOIN products p ON p.id = o.productId
      WHERE o.userId = ?
      ORDER BY o.orderDate DESC
    `, [userId]);

        res.json(groupOrders(rows));
    } catch (err) {
        console.error('Customer order fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch customer orders' });
    }
};

exports.placeOrder = async(req, res) => {
    const userId = req.user.id;
    const { productId, quantity, address, phone, note } = req.body;

    try {
        const orderDate = new Date();
        const status = 'pending';

        await db.query(
            `INSERT INTO orders 
       (userId, productId, quantity, orderDate, status, address, phone, note, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, [userId, productId, quantity, orderDate, status, address, phone, note]
        );

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
        console.error('Order creation error:', err);
        res.status(500).json({ error: 'Failed to place order' });
    }
};

exports.updateOrderStatus = async(req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        await db.query(
            `UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?`, [status, orderId]
        );
        res.json({ message: 'Order status updated successfully' });
    } catch (err) {
        console.error('Status update error:', err);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

exports.deleteOrder = async(req, res) => {
    const orderId = req.params.id;
    const userId = req.user.id;

    try {
        const [check] = await db.query(
            `SELECT id FROM orders WHERE id = ? AND userId = ?`, [orderId, userId]
        );
        if (check.length === 0) {
            return res.status(403).json({ error: 'Unauthorized or order not found' });
        }

        await db.query(`DELETE FROM orders WHERE id = ?`, [orderId]);
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
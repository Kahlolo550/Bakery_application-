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
    const retailerId = req.user.id;

    try {
        const [rows] = await db.query(`
      SELECT o.id AS orderId, o.userId, o.status, o.orderDate, o.address, o.phone,
             u.fullName AS customerName,
             p.id AS productId, p.name AS productName, p.photo AS productPhoto,
             o.quantity AS quantity
      FROM orders o
      JOIN users u ON u.id = o.userId
      JOIN products p ON p.id = o.productId
      WHERE p.retailerId = ?
      ORDER BY o.orderDate DESC
    `, [retailerId]);

        res.json(groupOrders(rows, true));
    } catch (err) {
        console.error('Retailer order fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch retailer orders' });
    }
};
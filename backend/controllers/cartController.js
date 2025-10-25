const db = require('../db');

exports.getCartItems = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'User not authenticated' });

  try {
    const [rows] = await db.query(
      `SELECT cart.id, cart.quantity, products.name AS productName
       FROM cart
       JOIN products ON cart.productId = products.id
       WHERE cart.userId = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

exports.addToCart = async (req, res) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  if (!userId) return res.status(401).json({ error: 'User not authenticated' });
  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ error: 'Invalid productId or quantity' });
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM cart WHERE userId = ? AND productId = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?',
        [quantity, userId, productId]
      );
    } else {
      await db.query(
        'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

exports.updateCartItem = async (req, res) => {
  const userId = req.user?.id;
  const cartId = req.params.id;
  const { quantity } = req.body;

  if (!userId) return res.status(401).json({ error: 'User not authenticated' });

  try {
    await db.query(
      'UPDATE cart SET quantity = ? WHERE id = ? AND userId = ?',
      [quantity, cartId, userId]
    );
    res.json({ message: 'Quantity updated' });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

exports.removeCartItem = async (req, res) => {
  const userId = req.user?.id;
  const cartId = req.params.id;

  if (!userId) return res.status(401).json({ error: 'User not authenticated' });

  try {
    await db.query('DELETE FROM cart WHERE id = ? AND userId = ?', [cartId, userId]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Delete cart error:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

exports.checkoutCart = async (req, res) => {
  const userId = req.user?.id;
  const { address, phone, note } = req.body;

  if (!userId) return res.status(401).json({ error: 'User not authenticated' });
  if (!address || !phone) return res.status(400).json({ error: 'Address and phone are required' });

  try {
    const [cartItems] = await db.query('SELECT * FROM cart WHERE userId = ?', [userId]);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderDate = new Date();
    const status = 'pending';

    for (const item of cartItems) {
      await db.query(
        `INSERT INTO orders (userId, productId, quantity, orderDate, status, address, phone, note, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, item.productId, item.quantity, orderDate, status, address, phone, note]
      );
    }

    await db.query('DELETE FROM cart WHERE userId = ?', [userId]);

    res.json({ message: 'Order placed successfully!' });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

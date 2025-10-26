const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'sweetcrust_secret';

function generateToken(id) {
    return jwt.sign({ id }, SECRET, { expiresIn: '1h' });
}

// ✅ Middleware helper to log requests
function logRequest(req) {
    console.log(`📝 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
}

// Customer Registration
exports.registerCustomer = async(req, res) => {
    logRequest(req);
    const { username, password, email, fullName } = req.body;
    if (!username || !password || !email || !fullName) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (username, password, email, fullName) VALUES (?, ?, ?, ?)', [username, hashed, email, fullName]
        );
        res.sendStatus(201);
    } catch (err) {
        console.error('Customer registration error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Username or email already exists.' });
        } else {
            res.status(500).json({ error: 'Server error during registration.' });
        }
    }
};

// Customer Login
exports.loginCustomer = async(req, res) => {
    logRequest(req);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        if (!user) return res.status(404).json({ error: 'Email not found.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Incorrect password.' });

        const token = generateToken(user.id);
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (err) {
        console.error('Customer login error:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
};

// Retailer Registration
exports.registerRetailer = async(req, res) => {
    logRequest(req);
    const { username, password, contactEmail, storeName } = req.body;
    if (!username || !password || !contactEmail || !storeName) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO retailers (username, password, contactEmail, storeName) VALUES (?, ?, ?, ?)', [username, hashed, contactEmail, storeName]
        );
        res.sendStatus(201);
    } catch (err) {
        console.error('Retailer registration error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Username or email already exists.' });
        } else {
            res.status(500).json({ error: 'Server error during registration.' });
        }
    }
};

// Retailer Login
exports.loginRetailer = async(req, res) => {
    logRequest(req);
    const { contactEmail, password } = req.body;
    if (!contactEmail || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [retailers] = await db.query('SELECT * FROM retailers WHERE contactEmail = ?', [contactEmail]);
        const retailer = retailers[0];
        if (!retailer) return res.status(404).json({ error: 'Email not found.' });

        const match = await bcrypt.compare(password, retailer.password);
        if (!match) return res.status(401).json({ error: 'Incorrect password.' });

        const token = generateToken(retailer.id);
        res.json({
            token,
            retailer: {
                id: retailer.id,
                username: retailer.username,
                contactEmail: retailer.contactEmail,
                storeName: retailer.storeName
            }
        });
    } catch (err) {
        console.error('Retailer login error:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
};

// GET routes for browser visibility
exports.getCustomerRegister = (req, res) => {
    logRequest(req);
    res.send('Customer registration endpoint is live. Use POST to register.');
};

exports.getRetailerRegister = (req, res) => {
    logRequest(req);
    res.send('Retailer registration endpoint is live. Use POST to register.');
};

// /me routes
exports.getCustomerProfile = async(req, res) => {
    logRequest(req);
    try {
        const [users] = await db.query(
            'SELECT id, username, email, fullName FROM users WHERE id = ?', [req.user.id]
        );
        if (!users.length) return res.status(404).json({ error: 'Customer not found.' });
        res.json(users[0]);
    } catch (err) {
        console.error('Customer profile error:', err);
        res.status(500).json({ error: 'Server error fetching profile.' });
    }
};

exports.getRetailerProfile = async(req, res) => {
    logRequest(req);
    try {
        const [retailers] = await db.query(
            'SELECT id, username, contactEmail, storeName FROM retailers WHERE id = ?', [req.user.id]
        );
        if (!retailers.length) return res.status(404).json({ error: 'Retailer not found.' });
        res.json(retailers[0]);
    } catch (err) {
        console.error('Retailer profile error:', err);
        res.status(500).json({ error: 'Server error fetching profile.' });
    }
};
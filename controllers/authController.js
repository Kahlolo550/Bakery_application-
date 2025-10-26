const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'sweetcrust_secret';

// Customer Registration
exports.registerCustomer = async(req, res) => {
    const { username, password, email, fullName } = req.body;

    if (!username || !password || !email || !fullName) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (username, password, email, fullName, role) VALUES (?, ?, ?, ?, ?)', [username, hashed, email, fullName, 'customer']
        );
        console.log('Customer registered:', email);
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
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ error: 'Email not found. Please register first.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password. Please try again.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Customer login error:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
};

// Retailer Registration
exports.registerRetailer = async(req, res) => {
    const { username, password, contactEmail, storeName } = req.body;

    if (!username || !password || !contactEmail || !storeName) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO retailers (username, password, contactEmail, storeName) VALUES (?, ?, ?, ?)', [username, hashed, contactEmail, storeName]
        );
        console.log('Retailer registered:', contactEmail);
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
    const { contactEmail, password } = req.body;

    if (!contactEmail || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [retailers] = await db.query('SELECT * FROM retailers WHERE contactEmail = ?', [contactEmail]);
        const retailer = retailers[0];

        if (!retailer) {
            return res.status(404).json({ error: 'Email not found. Please register first.' });
        }

        const passwordMatch = await bcrypt.compare(password, retailer.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password. Please try again.' });
        }

        const token = jwt.sign({ id: retailer.id, role: 'retailer' }, SECRET, { expiresIn: '1h' });
        res.json({
            token,
            retailer: {
                id: retailer.id,
                username: retailer.username,
                contactEmail: retailer.contactEmail,
                storeName: retailer.storeName,
                role: 'retailer'
            }
        });
    } catch (err) {
        console.error('Retailer login error:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
};
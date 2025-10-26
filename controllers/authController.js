const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined.');
}

// User validation schemas
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),
});

const retailerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    contactEmail: Joi.string().email().required(),
    storeName: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Middleware for validation
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

function generateToken(id, role) {
    return jwt.sign({ id, role }, SECRET, { expiresIn: '1h' });
}

// Customer Registration
exports.registerCustomer = [validate(userSchema), async(req, res, next) => {
    const { username, password, email, fullName } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (username, password, email, fullName, role) VALUES (?, ?, ?, ?, "customer")', [username, hashed, email, fullName]
        );
        res.status(201).json({ message: 'Customer registered successfully.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username or email already exists.' });
        }
        next(err); // Pass error to the global error handler
    }
}];

// User Login (for both customer and retailer)
exports.loginUser = [validate(loginSchema), async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

        const token = generateToken(user.id, user.role);
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
}];

// Retailer Registration
exports.registerRetailer = [validate(retailerSchema), async(req, res, next) => {
    const { username, password, contactEmail, storeName } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (username, password, email, storeName, role) VALUES (?, ?, ?, ?, "retailer")', [username, hashed, contactEmail, storeName]
        );
        res.status(201).json({ message: 'Retailer registered successfully.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username or email already exists.' });
        }
        next(err);
    }
}];

// User Profile (single endpoint for both)
exports.getProfile = async(req, res, next) => {
    try {
        // The verifyToken middleware already added req.user
        const [users] = await db.query(
            'SELECT id, username, email, fullName, storeName, role FROM users WHERE id = ?', [req.user.id]
        );
        if (!users.length) return res.status(404).json({ error: 'User not found.' });
        res.json(users[0]);
    } catch (err) {
        next(err);
    }
};
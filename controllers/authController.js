const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const SECRET = process.env.JWT_SECRET || process.env.RAILWAY_SECRET_JWT_SECRET;
if (!SECRET) throw new Error('FATAL: JWT_SECRET is not defined');

// Middleware: Joi validation
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

// 🔐 Customer registration schema
const customerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().min(3).required()
});

// 🔐 Retailer registration schema
const retailerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    contactEmail: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    storeName: Joi.string().min(3).required()
});

// ✅ Register Customer
exports.registerCustomer = [
    validate(customerSchema),
    async(req, res, next) => {
        const { username, email, password, fullName } = req.body;
        try {
            const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0)
                return res.status(409).json({ error: 'Email already registered.' });

            const hashed = await bcrypt.hash(password, 10);
            await db.query(
                'INSERT INTO users (username, email, password, fullName) VALUES (?, ?, ?, ?)', [username, email, hashed, fullName]
            );

            res.status(201).json({ message: 'Customer registered successfully.' });
        } catch (err) {
            console.error('Customer registration error:', err.stack);
            next(err);
        }
    }
];

// ✅ Register Retailer
exports.registerRetailer = [
    validate(retailerSchema),
    async(req, res, next) => {
        const { username, contactEmail, password, storeName } = req.body;
        try {
            const [existing] = await db.query('SELECT id FROM retailers WHERE contactEmail = ?', [contactEmail]);
            if (existing.length > 0)
                return res.status(409).json({ error: 'Email already registered.' });

            const hashed = await bcrypt.hash(password, 10);
            await db.query(
                'INSERT INTO retailers (username, contactEmail, password, storeName) VALUES (?, ?, ?, ?)', [username, contactEmail, hashed, storeName]
            );

            res.status(201).json({ message: 'Retailer registered successfully.' });
        } catch (err) {
            console.error('Retailer registration error:', err.stack);
            next(err);
        }
    }
];

// ✅ Login schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// ✅ Login
exports.loginUser = [
    validate(loginSchema),
    async(req, res, next) => {
        const { email, password } = req.body;
        try {
            const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            const user = users[0];
            if (!user)
                return res.status(401).json({ error: 'Invalid email or password.' });

            const match = await bcrypt.compare(password, user.password);
            if (!match)
                return res.status(401).json({ error: 'Invalid email or password.' });

            const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
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
            console.error('Login error:', err.stack);
            next(err);
        }
    }
];

// ✅ Get Profile (/me)
exports.getProfile = async(req, res, next) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, email, fullName FROM users WHERE id = ?', [req.user.id]
        );
        const user = users[0];
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ user });
    } catch (err) {
        console.error('Profile fetch error:', err.stack);
        next(err);
    }
};
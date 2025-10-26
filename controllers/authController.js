const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const SECRET = process.env.JWT_SECRET || process.env.RAILWAY_SECRET_JWT_SECRET;
if (!SECRET) throw new Error('FATAL: JWT_SECRET is not defined');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
};

const customerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().min(3).required()
});

const retailerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    contactEmail: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    storeName: Joi.string().min(3).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const retailerLoginSchema = Joi.object({
    contactEmail: Joi.string().email().required(),
    password: Joi.string().required()
});

exports.registerCustomer = [
    validate(customerSchema),
    async(req, res, next) => {
        const { username, email, password, fullName } = req.body;
        try {
            const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) return res.status(409).json({ error: 'Email already registered.' });
            const hashed = await bcrypt.hash(password, 10);
            await db.query('INSERT INTO users (username, email, password, fullName) VALUES (?, ?, ?, ?)', [username, email, hashed, fullName]);
            res.status(201).json({ message: 'Customer registered successfully.' });
        } catch (err) {
            next(err);
        }
    }
];

exports.registerRetailer = [
    validate(retailerSchema),
    async(req, res, next) => {
        const { username, contactEmail, password, storeName } = req.body;
        try {
            const [existing] = await db.query('SELECT id FROM retailers WHERE contactEmail = ?', [contactEmail]);
            if (existing.length > 0) return res.status(409).json({ error: 'Email already registered.' });
            const hashed = await bcrypt.hash(password, 10);
            await db.query('INSERT INTO retailers (username, contactEmail, password, storeName) VALUES (?, ?, ?, ?)', [username, contactEmail, hashed, storeName]);
            res.status(201).json({ message: 'Retailer registered successfully.' });
        } catch (err) {
            next(err);
        }
    }
];

exports.loginUser = [
    validate(loginSchema),
    async(req, res, next) => {
        const { email, password } = req.body;
        try {
            const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            const user = users[0];
            if (!user) return res.status(401).json({ error: 'Invalid email or password.' });
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ error: 'Invalid email or password.' });
            const token = jwt.sign({ id: user.id, role: 'customer' }, SECRET, { expiresIn: '1h' });
            res.json({ token, user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName } });
        } catch (err) {
            next(err);
        }
    }
];

exports.loginRetailer = [
    validate(retailerLoginSchema),
    async(req, res, next) => {
        const { contactEmail, password } = req.body;
        try {
            const [retailers] = await db.query('SELECT * FROM retailers WHERE contactEmail = ?', [contactEmail]);
            const retailer = retailers[0];
            if (!retailer) return res.status(401).json({ error: 'Invalid email or password.' });
            const match = await bcrypt.compare(password, retailer.password);
            if (!match) return res.status(401).json({ error: 'Invalid email or password.' });
            const token = jwt.sign({ id: retailer.id, role: 'retailer' }, SECRET, { expiresIn: '1h' });
            res.json({ token, retailer: { id: retailer.id, username: retailer.username, contactEmail: retailer.contactEmail, storeName: retailer.storeName } });
        } catch (err) {
            next(err);
        }
    }
];

exports.getProfile = async(req, res, next) => {
    try {
        const [users] = await db.query('SELECT id, username, email, fullName FROM users WHERE id = ?', [req.user.id]);
        const user = users[0];
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ user });
    } catch (err) {
        next(err);
    }
};
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: [
        process.env.REACT_APP_API_BASE || 'http://localhost:3000',
        'https://bakeryapplication-production.up.railway.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Request Body and Static Files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const uploadRoutes = require('./routes/upload');

app.use('/api', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Bakery backend is alive!' });
});

// SPA catch-all route
app.use(express.static(path.join(__dirname, 'build')));
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Centralized Error Handling Middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
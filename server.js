require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();

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

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const uploadRoutes = require('./routes/upload');

app.use('/api', authRoutes); // Matches frontend API: /api/login/customer
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Bakery backend is alive!' });
});

app.use(express.static(path.join(__dirname, 'build')));
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
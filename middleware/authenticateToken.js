const jwt = require('jsonwebtoken');
const SECRET = 'sweetcrust_secret';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.error('❌ Authorization header missing');
        return res.status(401).json({ error: 'Missing token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.error('❌ Token not found after Bearer');
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            console.error('❌ Token verification failed:', err.message);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        console.log(`✅ Authenticated user ID: ${user.id}, role: ${user.role}`);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
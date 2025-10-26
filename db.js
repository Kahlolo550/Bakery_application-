require('dotenv').config();
const mysql = require('mysql2');

// Use Railway's internal hostname override if needed
const dbConfig = {
    host: process.env.DB_HOST || 'mysql.railway.internal',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// Log config for debugging
console.log('🔍 MySQL Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
    password: dbConfig.password ? '***' : '(missing)',
});

const pool = mysql.createPool(dbConfig);

// Test connection with full error logging
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection failed!');
        console.error('🔎 Error object:', err);
        console.error('📄 Stack trace:', err.stack);
    } else {
        console.log('✅ MySQL connected successfully');
        connection.release();
    }
});

module.exports = pool.promise();
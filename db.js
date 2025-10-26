require('dotenv').config();
const mysql = require('mysql2');

const dbConfig = {
    host: 'mysql.railway.internal', // ✅ Force correct internal hostname
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

console.log('🔍 MySQL Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
    password: dbConfig.password ? '***' : '(missing)',
});

const pool = mysql.createPool(dbConfig);

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
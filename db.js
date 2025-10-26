require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Optional: test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err.message);
    } else {
        console.log('✅ MySQL connected successfully');
        connection.release();
    }
});

module.exports = pool.promise();
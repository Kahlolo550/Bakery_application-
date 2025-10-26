require('dotenv').config();
const mysql = require('mysql2');

const dbConfig = {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

console.log('🔍 MySQL Config:', dbConfig);

const pool = mysql.createPool(dbConfig);

// Test connection with detailed error logging
pool.getConnection((err, connection) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('MySQL connection failed!');
            console.error('Error object:', err); // full error
            console.error('Stack trace:', err.stack); // stack trace
            console.error('Config used:', {
                host: process.env.MYSQLHOST,
                port: process.env.MYSQLPORT,
                user: process.env.MYSQLUSER,
                password: process.env.MYSQLPASSWORD ? '***' : '(missing)',
                database: process.env.MYSQLDATABASE,
            });
        } else {
            console.log('MySQL connected successfully');
            connection.release();
        }
    });

});

module.exports = pool.promise();
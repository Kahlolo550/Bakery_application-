require('dotenv').config();
const mysql = require('mysql2');
const { URL } = require('url');

const dbUrl = process.env.DATABASE_URL;
let dbConfig = {};

if (dbUrl) {
    const parsed = new URL(dbUrl);
    dbConfig = {
        host: parsed.hostname,
        port: parsed.port,
        user: parsed.username,
        password: parsed.password,
        database: parsed.pathname.replace('/', ''),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    };
} else {
    console.error('❌ DATABASE_URL is missing from environment');
}

console.log('🔍 MySQL Config:', dbConfig);

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection failed!');
        console.error('🔎 Error object:', err);
    } else {
        console.log('✅ MySQL connected successfully');
        connection.release();
    }
});

module.exports = pool.promise();
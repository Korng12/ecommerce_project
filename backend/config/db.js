// backend/db.js
const mysql = require('mysql2/promise'); // Use the promise version

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '110704', // Your MySQL password
    database: 'ecommerce', // Your database name
});

// Test the connection to the pool
const testConnection = async () => {
    try {
        const connection = await pool.getConnection(); // Get a connection from the pool
        console.log('Connected to MySQL Database');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit the process if there's a failure
    }
};

// Test connection on startup
testConnection();

module.exports = pool; // Export the pool for use in your routes
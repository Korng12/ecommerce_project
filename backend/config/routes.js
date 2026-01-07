// backend/routes.js
const express = require('express');
const router = express.Router();
const db = require('./db'); // Using the promise-compatible pool

// Register a user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [username, email, password]); // Await the query

        res.status(201).json({ 
            message: 'User registered successfully', 
            userId: result.insertId 
        });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [results] = await db.query(sql, [email]); // Await the query

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // IMPORTANT: Use bcrypt to hash and compare passwords in production
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return success response
        res.json({ 
            message: 'Login successful', 
            userId: user.id,
            username: user.username 
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;
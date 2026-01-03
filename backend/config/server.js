// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes'); // Import your routes

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.use('/api', routes); // Use routes defined in routes.js

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
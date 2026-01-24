const express = require('express');
const router = express.Router();
const { getUserStatistics } = require('../controllers/statisticsController');
const { verifyToken } = require('../controllers/profileController');

// Apply token verification
router.use(verifyToken);

// GET /api/statistics - Get user statistics
router.get('/', getUserStatistics);

module.exports = router;

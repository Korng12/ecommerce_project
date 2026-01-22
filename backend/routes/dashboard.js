const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')
const verifyJwt = require('../middleware/authJwt')

router.get('/stats', verifyJwt, dashboardController.getStats)

module.exports = router

// backend/routes/api/analytics.js
const express = require("express");
const router = express.Router();
const analyticsController = require("../../controllers/analyticsController");
const verifyJWT = require("../../middleware/authJwt");
const verifyRole = require("../../middleware/verifyRoles");

// All analytics endpoints require authentication and admin role
router.use(verifyJWT);
router.use(verifyRole(1));

// Get key metrics (Total Revenue, Orders, Users, Cart Abandonment)
router.get("/metrics", analyticsController.getKeyMetrics);

// Get top performing products
router.get("/top-products", analyticsController.getTopProducts);

// Get revenue by category
router.get("/revenue-category", analyticsController.getRevenueByCategory);

// Get revenue by brand
router.get("/revenue-brand", analyticsController.getRevenueByBrand);

// Get revenue trend (last 6 months)
router.get("/revenue-trend", analyticsController.getRevenueTrend);
// Get daily orders (last 7 days)
router.get("/daily-orders", analyticsController.getDailyOrders);

module.exports = router;

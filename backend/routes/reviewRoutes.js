const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyJWT = require('../middleware/verifyJWT');

// Public routes
// Get all reviews for a product with pagination
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes (require authentication)
// Create a review
router.post('/product/:productId', verifyJWT, reviewController.createReview);

// Get current user's reviews
router.get('/user/my-reviews', verifyJWT, reviewController.getUserReviews);

// Update user's own review
router.put('/:reviewId', verifyJWT, reviewController.updateReview);

// Delete user's own review
router.delete('/:reviewId', verifyJWT, reviewController.deleteReview);

// Mark review as helpful
router.post('/:reviewId/helpful', reviewController.markHelpful);

module.exports = router;

const db = require("../models/index.js");
const { Op } = require("sequelize");
const Review = db.review;
const Product = db.product;
const User = db.user;
const sequelize = db.sequelize;

/* ================= GET REVIEWS FOR PRODUCT ================= */
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { count, rows } = await Review.findAndCountAll({
      where: {
        productId: productId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    // Calculate average rating
    const avgRating = await Review.findOne({
      where: {
        productId: productId,
      },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalReviews"],
      ],
      raw: true,
    });

    // Get rating distribution
    const ratingDistribution = await Review.findAll({
      where: {
        productId: productId,
      },
      attributes: [
        "rating",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["rating"],
      raw: true,
      order: [["rating", "DESC"]],
    });

    res.json({
      reviews: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
      stats: {
        averageRating: parseFloat(avgRating?.averageRating || 0).toFixed(1),
        totalReviews: parseInt(avgRating?.totalReviews || 0),
        ratingDistribution: ratingDistribution || [],
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE REVIEW ================= */
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // From JWT middleware

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    // Create review
    const review = await Review.create({
      userId: userId,
      productId: productId,
      rating: parseInt(rating),
      comment: comment || null,
    });

    // Fetch created review with user info
    const createdReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(201).json({
      message: "Review created successfully",
      review: createdReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE REVIEW ================= */
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review
    if (review.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You can only edit your own reviews" });
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    await review.update({
      rating: rating || review.rating,
      comment: comment !== undefined ? comment : review.comment,
    });

    res.json({
      message: "Review updated successfully",
      review: review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE REVIEW ================= */
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review
    if (review.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own reviews" });
    }

    await review.destroy();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= MARK REVIEW AS HELPFUL ================= */
const markHelpful = async (req, res) => {
  res.json({ message: "Feature coming soon" });
};

/* ================= GET USER'S REVIEWS ================= */
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { userId: userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    res.json({
      reviews: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getUserReviews,
};

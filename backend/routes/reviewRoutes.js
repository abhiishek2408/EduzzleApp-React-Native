import express from "express";
import Review from "../models/Review.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /api/reviews/submit
 * Submit a new review
 */
router.post("/submit", async (req, res) => {
  try {
    const { userId, rating, feedback } = req.body;

    // Validate required fields
    if (!userId || !rating) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID and rating are required" 
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating must be between 1 and 5" 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Determine if positive review (4-5 stars)
    const isPositive = rating >= 4;
    const redirectedToPlayStore = isPositive;

    // Create review
    const review = await Review.create({
      userId,
      rating,
      feedback: feedback || "",
      isPositive,
      redirectedToPlayStore,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal Server Error" 
    });
  }
});

/**
 * GET /api/reviews/stats
 * Get review statistics (average rating, total reviews, etc.)
 */
router.get("/stats", async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const reviews = await Review.find();

    if (totalReviews === 0) {
      return res.json({
        success: true,
        stats: {
          totalReviews: 0,
          averageRating: 0,
          positiveReviews: 0,
          negativeReviews: 0,
        },
      });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / totalReviews).toFixed(2);
    const positiveReviews = reviews.filter(r => r.isPositive).length;
    const negativeReviews = totalReviews - positiveReviews;

    res.json({
      success: true,
      stats: {
        totalReviews,
        averageRating: parseFloat(averageRating),
        positiveReviews,
        negativeReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal Server Error" 
    });
  }
});

/**
 * GET /api/reviews/user/:userId
 * Get all reviews by a specific user
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal Server Error" 
    });
  }
});

export default router;

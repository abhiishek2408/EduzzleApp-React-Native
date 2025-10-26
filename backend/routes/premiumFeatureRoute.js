import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkSubscription } from "../middleware/checkSubscription.js";

const router = express.Router();

// 🟢 Only active subscribers can access
router.get("/exclusive-content", authenticate, checkSubscription, (req, res) => {
  res.status(200).json({
    message: "🎉 Welcome to the Premium Zone! You have access.",
    content: "This is your exclusive premium feature or content area."
  });
});

export default router;

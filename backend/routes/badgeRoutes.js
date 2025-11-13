// routes/badgeRoutes.js
import express from "express";
import Badge from "../models/Badge.js";

const router = express.Router();

// Get all badges for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const badges = await Badge.find({ userId }).sort({ unlockedAt: -1 });
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: "Error fetching badges" });
  }
});

// Claim badge reward (optional)
router.patch("/claim/:badgeId", async (req, res) => {
  try {
    const { badgeId } = req.params;
    const badge = await Badge.findById(badgeId);
    if (!badge) return res.status(404).json({ message: "Badge not found" });

    if (badge.claimed) return res.json({ message: "Badge reward already claimed" });

    badge.claimed = true;
    await badge.save();

    res.json({ message: "Badge reward claimed successfully", badge });
  } catch (err) {
    res.status(500).json({ message: "Error claiming badge" });
  }
});

export default router;

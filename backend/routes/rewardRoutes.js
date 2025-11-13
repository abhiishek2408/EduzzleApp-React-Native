// routes/rewardRoutes.js
import express from "express";
import Reward from "../models/Reward.js";

const router = express.Router();

// Fetch all rewards for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const rewards = await Reward.find({ userId }).sort({ createdAt: -1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rewards" });
  }
});

// Claim a reward
router.patch("/claim/:rewardId", async (req, res) => {
  try {
    const { rewardId } = req.params;
    const reward = await Reward.findById(rewardId);

    if (!reward) return res.status(404).json({ message: "Reward not found" });
    if (reward.claimed) return res.json({ message: "Reward already claimed" });

    reward.claimed = true;
    await reward.save();

    res.json({ message: "Reward claimed successfully!", reward });
  } catch (err) {
    res.status(500).json({ message: "Error claiming reward" });
  }
});

export default router;

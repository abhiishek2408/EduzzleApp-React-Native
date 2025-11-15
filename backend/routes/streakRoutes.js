// routes/streakRoutes.js
import express from "express";
import Streak from "../models/Streak.js";
import DailyQuest from "../models/DailyQuest.js";
import Badge from "../models/Badge.js";
import Reward from "../models/Reward.js";
import User from "../models/User.js";

const router = express.Router();

// Get user's current streak
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let streak = await Streak.findOne({ userId });
    
    if (!streak) {
      streak = await Streak.create({ userId });
    }
    
    res.json({
      success: true,
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastCompletedDate: streak.lastCompletedDate,
        milestonesAchieved: streak.milestonesAchieved,
      },
    });
  } catch (error) {
    console.error("Error fetching streak:", error);
    res.status(500).json({ success: false, message: "Failed to fetch streak" });
  }
});

// Update streak (called when daily quest is completed)
router.post("/:userId/update", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await Streak.findOne({ userId });
    if (!streak) {
      streak = await Streak.create({ userId });
    }

    // Check if there's a completed quest today
    const todayQuest = await DailyQuest.findOne({
      userId,
      date: today,
      completed: true,
    });

    if (!todayQuest) {
      return res.status(400).json({
        success: false,
        message: "No completed quest for today",
      });
    }

    // Check if already updated today
    if (streak.lastCompletedDate) {
      const lastDate = new Date(streak.lastCompletedDate);
      lastDate.setHours(0, 0, 0, 0);
      if (lastDate.getTime() === today.getTime()) {
        return res.json({
          success: true,
          message: "Streak already updated today",
          streak: {
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
          },
        });
      }
    }

    // Check if yesterday was completed (for streak continuation)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayQuest = await DailyQuest.findOne({
      userId,
      date: yesterday,
      completed: true,
    });

    if (yesterdayQuest) {
      // Continue streak
      streak.currentStreak += 1;
    } else {
      // Reset streak
      streak.currentStreak = 1;
    }

    // Update longest streak
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.lastCompletedDate = new Date();
    streak.updatedAt = new Date();

    // Check for milestone achievements and award badges
    const milestones = [
      { days: 3, name: "Bronze", coins: 50 },
      { days: 7, name: "Silver", coins: 150 },
      { days: 15, name: "Gold", coins: 300 },
      { days: 30, name: "Diamond", coins: 1000 },
    ];

    const currentStreakDays = streak.currentStreak;
    const matchedMilestone = milestones.find((m) => m.days === currentStreakDays);

    if (matchedMilestone) {
      // Check if this milestone was already achieved
      const alreadyAchieved = streak.milestonesAchieved.some(
        (m) => m.days === matchedMilestone.days
      );

      if (!alreadyAchieved) {
        // Add milestone to streak record
        streak.milestonesAchieved.push({
          days: matchedMilestone.days,
          achievedAt: new Date(),
          badgeName: matchedMilestone.name,
        });

        // Check if badge already exists
        const existingBadge = await Badge.findOne({
          userId,
          name: matchedMilestone.name,
        });

        if (!existingBadge) {
          // Create badge
          await Badge.create({
            userId,
            name: matchedMilestone.name,
            streakDays: matchedMilestone.days,
            rewardCoins: matchedMilestone.coins,
          });

          // Create reward record
          await Reward.create({
            userId,
            type: "streakReward",
            title: `${matchedMilestone.name} Badge Unlocked`,
            description: `You reached a ${currentStreakDays}-day streak!`,
            value: matchedMilestone.coins,
          });

          // Award coins to user
          await User.findByIdAndUpdate(userId, {
            $inc: { coins: matchedMilestone.coins },
          });
        }
      }
    }

    await streak.save();

    res.json({
      success: true,
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastCompletedDate: streak.lastCompletedDate,
        newMilestone: matchedMilestone || null,
      },
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    res.status(500).json({ success: false, message: "Failed to update streak" });
  }
});

// Reset streak (admin or testing purposes)
router.post("/:userId/reset", async (req, res) => {
  try {
    const { userId } = req.params;
    const streak = await Streak.findOne({ userId });
    
    if (!streak) {
      return res.status(404).json({ success: false, message: "Streak not found" });
    }

    streak.currentStreak = 0;
    streak.lastCompletedDate = null;
    streak.updatedAt = new Date();
    await streak.save();

    res.json({ success: true, message: "Streak reset successfully" });
  } catch (error) {
    console.error("Error resetting streak:", error);
    res.status(500).json({ success: false, message: "Failed to reset streak" });
  }
});

export default router;

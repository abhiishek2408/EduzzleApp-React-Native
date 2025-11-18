import express from "express";
import User from "../models/User.js";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

/**
 * 🏆 GET FRIENDS LEADERBOARD
 * Returns leaderboard with friends' quiz stats sorted by total points
 */
router.get("/leaderboard/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get current user with friends list
    const currentUser = await User.findById(userId).select("friends");
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Include current user + all friends
    const userIds = [userId, ...currentUser.friends.map(id => id.toString())];

    // Aggregate quiz attempts to get stats for each user
    const stats = await QuizAttempt.aggregate([
      {
        $match: {
          userId: { $in: userIds.map(id => id) }
        }
      },
      {
        $group: {
          _id: "$userId",
          quizzesSolved: { $addToSet: "$quizId" }, // unique quizzes
          totalPoints: { $sum: "$totalScore" }
        }
      },
      {
        $project: {
          userId: "$_id",
          quizzesSolved: { $size: "$quizzesSolved" },
          totalPoints: 1
        }
      },
      {
        $sort: { totalPoints: -1, quizzesSolved: -1 } // sort by points desc, then quizzes desc
      }
    ]);

    // Get user details for each entry
    const leaderboard = await Promise.all(
      stats.map(async (stat) => {
        const user = await User.findById(stat.userId).select("name profilePic");
        return {
          userId: stat.userId,
          name: user?.name || "Unknown",
          profilePic: user?.profilePic || "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
          quizzesSolved: stat.quizzesSolved,
          totalPoints: stat.totalPoints
        };
      })
    );

    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

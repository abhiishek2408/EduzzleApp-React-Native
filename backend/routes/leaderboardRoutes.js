import express from "express";
import User from "../models/User.js";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

/**
 * Get Friends Leaderboard for a specific user
 * Returns sorted list of friends with their quiz stats
 */
router.get("/friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user with friends populated
    const user = await User.findById(userId).populate("friends", "name profilePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Include the user themselves in the leaderboard
    const friendIds = [...user.friends.map(f => f._id), userId];

    // Aggregate quiz attempts for all friends
    const leaderboardData = await Promise.all(
      friendIds.map(async (friendId) => {
        const attempts = await QuizAttempt.find({ userId: friendId });
        
        // Get unique quiz IDs (quizzes solved)
        const uniqueQuizzes = [...new Set(attempts.map(a => a.quizId.toString()))];
        
        // Calculate total points from all attempts
        const totalPoints = attempts.reduce((sum, attempt) => sum + (attempt.totalScore || 0), 0);

        // Get friend details
        const friend = friendIds.length > 1 
          ? user.friends.find(f => f._id.toString() === friendId.toString()) || user
          : user;

        return {
          userId: friendId,
          name: friend.name,
          profilePic: friend.profilePic,
          quizzesSolved: uniqueQuizzes.length,
          totalPoints: totalPoints,
        };
      })
    );

    // Sort by total points (descending), then by quizzes solved
    leaderboardData.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return b.quizzesSolved - a.quizzesSolved;
    });

    // Assign ranks
    leaderboardData.forEach((item, index) => {
      item.rank = index + 1;
    });

    res.json({
      success: true,
      leaderboard: leaderboardData,
    });
  } catch (error) {
    console.error("Error fetching friends leaderboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

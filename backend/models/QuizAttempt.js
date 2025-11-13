// models/QuizAttempt.js
import mongoose from "mongoose";
import Reward from "./Reward.js";
import Badge from "./Badge.js";
import DailyQuest from "./DailyQuest.js";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Quiz.questions" },
  selectedOption: { type: String, required: true },
  correctOption: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number }, // in seconds
  pointsEarned: { type: Number, default: 0 },
});

// Per Level Attempt Schema
const levelAttemptSchema = new mongoose.Schema({
  levelName: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  startedAt: { type: Date },
  endedAt: { type: Date },
  timeTaken: { type: Number }, // auto-calculate from above
  totalQuestions: { type: Number },
  correctAnswers: { type: Number },
  wrongAnswers: { type: Number },
  unanswered: { type: Number },
  score: { type: Number },
  passed: { type: Boolean },
  answers: [answerSchema],
});

// Quiz Attempt Schema (per user per attempt)
const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  attemptNumber: { type: Number, default: 1 },

  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  totalTimeTaken: { type: Number }, // seconds
  totalScore: { type: Number },
  result: { type: String, enum: ["Passed", "Failed"] },

  levelAttempts: [levelAttemptSchema],

  // Optional fields
  feedback: { type: String, default: "" },
  rating: { type: Number, min: 0, max: 5, default: 0 },

  createdAt: { type: Date, default: Date.now },
});


quizAttemptSchema.post("save", async function (doc) {
  try {
    const userId = doc.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let quest = await DailyQuest.findOne({ userId, date: today });
    if (!quest) {
      quest = await DailyQuest.create({
        userId,
        date: today,
        quizzesAttempted: 1,
      });
    } else {
      quest.quizzesAttempted += 1;
    }

    // ✅ When quest completed
    if (quest.quizzesAttempted >= 5 && !quest.completed) {
      quest.completed = true;
      quest.lastCompletedDate = new Date();

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayQuest = await DailyQuest.findOne({
        userId,
        date: yesterday,
        completed: true,
      });

      if (yesterdayQuest) {
        quest.currentStreak = (yesterdayQuest.currentStreak || 0) + 1;
      } else {
        quest.currentStreak = 1;
      }

      // ✅ Daily reward
      await Reward.create({
        userId,
        type: "coin",
        title: "Daily Quest Completed",
        description: "You completed 5 quizzes today!",
        value: 10,
        
      });

      if (reward.value > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { coins: reward.value },
      });
    }

      // ✅ Streak rewards
      const streak = quest.currentStreak;
      const badgeRewards = [
        { streak: 3, name: "Bronze", coins: 50 },
        { streak: 7, name: "Silver", coins: 150 },
        { streak: 15, name: "Gold", coins: 300 },
        { streak: 30, name: "Diamond", coins: 1000 },
      ];

      const matchedBadge = badgeRewards.find(b => b.streak === streak);
      if (matchedBadge) {
        // Check if user already has this badge
        const existing = await Badge.findOne({ userId, name: matchedBadge.name });
        if (!existing) {
          await Badge.create({
            userId,
            name: matchedBadge.name,
            streakDays: matchedBadge.streak,
            rewardCoins: matchedBadge.coins,
          });

          // Also give a reward record
          await Reward.create({
            userId,
            type: "streakReward",
            title: `${matchedBadge.name} Badge Unlocked`,
            description: `You reached a ${streak}-day streak!`,
            value: matchedBadge.coins,
          });
        }
      }
    }

    quest.updatedAt = new Date();
    await quest.save();
  } catch (err) {
    console.error("Error updating quest/badge/reward:", err);
  }
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);

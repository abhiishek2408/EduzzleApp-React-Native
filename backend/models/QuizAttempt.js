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

      // ✅ Daily reward
      const reward = await Reward.create({
        userId,
        type: "coin",
        title: "Daily Quest Completed",
        description: "You completed 5 quizzes today!",
        value: 10,
      });

      if (reward.value > 0) {
        const User = mongoose.model("User");
        await User.findByIdAndUpdate(userId, {
          $inc: { coins: reward.value },
        });
      }

      // ✅ Update streak via streak system
      // Import Streak model dynamically to avoid circular dependencies
      const Streak = mongoose.model("Streak");
      const axios = (await import("axios")).default;
      
      // Call the streak update endpoint (or update directly)
      try {
        // Direct update approach
        let streak = await Streak.findOne({ userId });
        if (!streak) {
          streak = await Streak.create({ userId });
        }

        // Check if already updated today
        let shouldUpdate = true;
        if (streak.lastCompletedDate) {
          const lastDate = new Date(streak.lastCompletedDate);
          lastDate.setHours(0, 0, 0, 0);
          if (lastDate.getTime() === today.getTime()) {
            shouldUpdate = false;
          }
        }

        if (shouldUpdate) {
          // Check yesterday's quest
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayQuest = await DailyQuest.findOne({
            userId,
            date: yesterday,
            completed: true,
          });

          if (yesterdayQuest) {
            streak.currentStreak += 1;
          } else {
            streak.currentStreak = 1;
          }

          if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
          }

          streak.lastCompletedDate = new Date();
          streak.updatedAt = new Date();

          // Check for milestone achievements
          const milestones = [
            { days: 3, coins: 5 },
            { days: 5, coins: 10 },
            { days: 10, coins: 15 },
          ];

          const currentStreakDays = streak.currentStreak;
          const matchedMilestone = milestones.find((m) => m.days === currentStreakDays);

          if (matchedMilestone) {
            const alreadyAchieved = streak.milestonesAchieved.some(
              (m) => m.days === matchedMilestone.days
            );

            if (!alreadyAchieved) {
              streak.milestonesAchieved.push({
                days: matchedMilestone.days,
                achievedAt: new Date(),
                coinsAwarded: matchedMilestone.coins,
              });

              await Reward.create({
                userId,
                type: "streakReward",
                title: `${currentStreakDays}-Day Streak Reward`,
                description: `You earned ${matchedMilestone.coins} coins for your ${currentStreakDays}-day streak!`,
                value: matchedMilestone.coins,
              });

              const User = mongoose.model("User");
              await User.findByIdAndUpdate(userId, {
                $inc: { coins: matchedMilestone.coins },
              });
            }
          }

          await streak.save();
        }
      } catch (streakError) {
        console.error("Error updating streak:", streakError);
      }
    }

    quest.updatedAt = new Date();
    await quest.save();
  } catch (err) {
    console.error("Error updating quest/badge/reward:", err);
  }
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);

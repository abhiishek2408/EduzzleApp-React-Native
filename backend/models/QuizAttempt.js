// models/QuizAttempt.js
import mongoose from "mongoose";
import DailyQuest from "./DailyQuest.js";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
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

    // Get today's normalized date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's DailyQuest (only ONE document per user)
    let quest = await DailyQuest.findOne({ userId });

    if (!quest) {
      // First time user → create base quest document
      quest = await DailyQuest.create({
        userId,
        lastQuestDate: today,
        quizzesAttemptedToday: 1,
        streak: 0,
        completedToday: false,
      });
    } else {
      // Compare today with lastQuestDate
      const last = quest.lastQuestDate
        ? new Date(quest.lastQuestDate).setHours(0, 0, 0, 0)
        : null;

      if (last !== today.getTime()) {
        // New day → reset
        quest.quizzesAttemptedToday = 0;
        quest.completedToday = false;
      }

      // Update daily quiz count
      quest.quizzesAttemptedToday += 1;
      quest.lastQuestDate = today;
    }

    // 🎯 Reward logic
    if (quest.quizzesAttemptedToday >= 5 && !quest.completedToday) {
      quest.completedToday = true;

      // Streak update
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const last = new Date(quest.lastQuestDate).setHours(0, 0, 0, 0);

      if (last === yesterday.getTime()) {
        quest.streak += 1;
      } else {
        quest.streak = 1;
      }

      // Reward coins to user
      const User = mongoose.model("User");
      await User.findByIdAndUpdate(userId, { $inc: { coins: 10 } });
    }

    quest.updatedAt = new Date();
    await quest.save();
  } catch (err) {
    console.error("Error updating daily quest:", err);
  }
});


export default mongoose.model("QuizAttempt", quizAttemptSchema);

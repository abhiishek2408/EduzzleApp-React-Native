// models/QuizAttempt.js
import mongoose from "mongoose";
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

      // ✅ Daily reward - award 10 coins
      const User = mongoose.model("User");
      await User.findByIdAndUpdate(userId, {
        $inc: { coins: 10 },
      });
    }

    quest.updatedAt = new Date();
    await quest.save();
  } catch (err) {
    console.error("Error updating quest/badge/reward:", err);
  }
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);

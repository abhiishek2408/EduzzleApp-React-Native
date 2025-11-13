// models/DailyQuest.js
import mongoose from "mongoose";

const dailyQuestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  date: { type: Date, required: true }, // e.g., 2025-11-10
  quizzesAttempted: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },

  // Streak tracking
  currentStreak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

dailyQuestSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("DailyQuest", dailyQuestSchema);

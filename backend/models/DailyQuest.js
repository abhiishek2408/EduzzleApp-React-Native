import mongoose from "mongoose";

const dailyQuestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  lastQuestDate: { type: Date, default: null },   // last time user did quest
  quizzesAttemptedToday: { type: Number, default: 0 },

  streak: { type: Number, default: 0 },           // how many days continuously user completed
  completedToday: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// One quest document per user
dailyQuestSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model("DailyQuest", dailyQuestSchema);

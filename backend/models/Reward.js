// models/Reward.js
import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  type: {
    type: String,
    enum: ["coin", "badge", "freeQuizUnlock", "streakReward"],
    required: true,
  },

  title: { type: String, required: true },
  description: { type: String },
  value: { type: Number, default: 0 }, // e.g. 50 coins
  streakCount: { type: Number }, // e.g. 3-day streak reward

  claimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Reward", rewardSchema);

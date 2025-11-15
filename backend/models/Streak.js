// models/Streak.js
import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },
  
  // Track milestone achievements (coins only)
  milestonesAchieved: [{
    days: { type: Number }, // 3, 5, 10
    achievedAt: { type: Date },
    coinsAwarded: { type: Number },
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

streakSchema.index({ userId: 1 });

// Static method to update streak when daily quest is completed
streakSchema.statics.updateUserStreak = async function(userId) {
  const DailyQuest = mongoose.model("DailyQuest");
  const User = mongoose.model("User");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = await this.findOne({ userId });
  if (!streak) {
    streak = await this.create({ userId });
  }

  // Check if already updated today
  if (streak.lastCompletedDate) {
    const lastDate = new Date(streak.lastCompletedDate);
    lastDate.setHours(0, 0, 0, 0);
    if (lastDate.getTime() === today.getTime()) {
      return streak; // Already updated today
    }
  }

  // Check yesterday's quest
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

      // Award coins to user automatically
      await User.findByIdAndUpdate(userId, {
        $inc: { coins: matchedMilestone.coins },
      });
    }
  }

  await streak.save();
  return streak;
};

export default mongoose.model("Streak", streakSchema);

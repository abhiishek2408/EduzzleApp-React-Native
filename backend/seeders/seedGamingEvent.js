// seeders/seedGamingEvent.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import GamingQuizEvent from "../models/GamingQuizEvent.js";

async function run() {
  try {
    await connectDB();

    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    const payload = {
      title: "Tech Trivia Blitz",
      description: "Fast-paced event on tech trends, languages, and history.",
      category: "Technology",
      difficulty: "medium",
      startTime,
      endTime,
      totalQuestions: 8,
      perQuestionTimerSec: 30,
      totalTimerSec: 480, // 8 mins total
      randomizeQuestions: true,
      questionBankFilter: {
        categories: ["Technology"],
        difficulties: ["Medium", "Easy"],
        tags: ["js", "web", "history"],
      },
      scoring: { correct: 10, wrong: 0, streakBonus: 5, streakEvery: 5 },
      rewards: [
        { placement: 1, coins: 100, badge: "Quiz Master" },
        { placement: 2, coins: 60 },
        { placement: 3, coins: 30 },
      ],
      entryCostCoins: 0,
      mode: "solo",
      isActive: true,
    };

    const created = await GamingQuizEvent.create(payload);
    console.log("✅ Seeded GamingQuizEvent:", created._id.toString());
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();

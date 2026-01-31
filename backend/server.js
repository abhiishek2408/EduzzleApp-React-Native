import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import cron from "node-cron";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import friendRoutes from "./routes/friendRoutes.js";
import puzzleRoutes from "./routes/QuizRoutes.js";
import fetchPuzzleRoutes from "./routes/fetchQuizzes.js";
import puzzleAttemptRoutes from "./routes/QuizAttemptRoutes.js";
import attemptCountRoutes from "./routes/attemptStatsRoutes.js";
import { connectDB } from "./config/db.js";
import subscriptionRoutes from "./routes/subscriptionRoute.js";
import gamingQuizEventRoutes from "./routes/gamingQuizEventRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import dailyQuestRoutes from "./routes/dailyQuestRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import mcqRoutes from "./routes/mcqRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

/* ✅ IMPORTANT for Render and Express Rate Limit
   Prevents ValidationError: X-Forwarded-For header issue */
app.set("trust proxy", 1);

// ---- Security ----
app.use(helmet());

// ---- CORS ----
const allowedOrigins = [
  "http://localhost:8081",
  "http://10.159.191.56:8081",
  "http://10.0.2.2:8081",
  "https://eduzzleapp-react-native.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ---- JSON parser ----
app.use(express.json());

// ---- Rate limiter ----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/puzzles", puzzleRoutes);
app.use("/api/fetch-puzzles", fetchPuzzleRoutes);
app.use("/api/puzzle-attempts", puzzleAttemptRoutes);
app.use("/api/attempts", attemptCountRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/gaming-events", gamingQuizEventRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/daily-quests", dailyQuestRoutes);
app.use("/api/streaks", streakRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/mcqs", mcqRoutes);
app.use("/api/payment", paymentRoutes);

// 3️⃣ Update GamingQuizEvent status every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const GamingQuizEvent = (await import("./models/GamingQuizEvent.js")).default;
    // Set scheduled for upcoming events
    await GamingQuizEvent.updateMany(
      { status: { $nin: ["disabled", "completed"] }, startTime: { $gt: now } },
      { $set: { status: "scheduled" } }
    );
    // Set live
    await GamingQuizEvent.updateMany(
      { status: { $ne: "disabled" }, startTime: { $lte: now }, endTime: { $gte: now } },
      { $set: { status: "live" } }
    );
    // Set completed
    await GamingQuizEvent.updateMany(
      { status: { $ne: "disabled" }, endTime: { $lt: now } },
      { $set: { status: "completed" } }
    );
  } catch (error) {
    console.error("Error updating GamingQuizEvent status:", error);
  }
});


// ======================= CRON JOBS =======================
// 1️⃣ Auto-expire subscriptions at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const User = (await import("./models/User.js")).default;
    const expired = await User.updateMany(
      { "subscription.isActive": true, "subscription.endDate": { $lte: now } },
      { $set: { "subscription.isActive": false } }
    );
    if (expired.modifiedCount > 0)
      console.log(`⏰ ${expired.modifiedCount} subscriptions expired and deactivated`);
  } catch (error) {
    console.error("Error in subscription expiration cron job:", error);
  }
});

// 2️⃣ Send renewal reminders at 9 AM daily
cron.schedule("0 9 * * *", async () => {
  try {
    const now = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(now.getDate() + 2);

    const User = (await import("./models/User.js")).default;
    const SubscriptionPlan = (await import("./models/SubscriptionPlan.js")).default;
    const { sendEmail } = await import("./utils/sendEmail.js");

    const usersExpiringSoon = await User.find({
      "subscription.isActive": true,
      "subscription.endDate": { $gte: now, $lte: twoDaysLater }
    }).populate("subscription.planId");

    for (const user of usersExpiringSoon) {
      const planName = user.subscription.planId?.name || "your plan";
      const expiryDate = new Date(user.subscription.endDate).toLocaleDateString();

      const emailContent = `
        <div style="font-family:Arial;padding:15px;background:#f9f9f9;">
          <h2 style="color:#4a044e;">Renew Your Eduzzle Premium Plan</h2>
          <p>Hi <b>${user.name}</b>,</p>
          <p>Your <b>${planName}</b> subscription is expiring on <b>${expiryDate}</b>.</p>
          <p>Renew now to continue enjoying uninterrupted premium access!</p>
          <a href="https://yourappdomain.com/renew" style="display:inline-block;margin-top:10px;padding:10px 20px;background:#4a044e;color:#fff;text-decoration:none;border-radius:8px;">Renew Now</a>
          <p style="margin-top:15px;color:#555;">Thank you for being part of Eduzzle ❤️</p>
        </div>
      `;

      await sendEmail(user.email, "Your Premium Plan is Expiring Soon!", emailContent);
    }

    if (usersExpiringSoon.length > 0)
      console.log(`📧 Sent renewal reminders to ${usersExpiringSoon.length} users`);
  } catch (error) {
    console.error("Error in renewal reminder cron job:", error);
  }
});

// ---- Test endpoint ----
app.get("/", (req, res) =>
  res.json({ message: "Educational Puzzle App API is running" })
);

// ---- Create HTTP server + Socket.IO ----
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Auto-register user from query parameter
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    console.log("🟢 User auto-registered for socket:", userId);
  }

  socket.on("registerUser", (userId) => {
    socket.join(userId);
    console.log("🟢 User manually registered for socket:", userId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Make io accessible in routes
app.set("io", io);

// ---- Connect DB and start server ----
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    httpServer.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

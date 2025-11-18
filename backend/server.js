// // server.js
// import express from "express";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import cors from "cors";
// import rateLimit from "express-rate-limit";
// import { Server } from "socket.io";
// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/user.js";
// import friendRoutes from "./routes/friendRoutes.js";
// import puzzleRoutes from "./routes/puzzle.js";
// import fetchPuzzleRoutes from "./routes/fetchPuzzles.js";
// import puzzleAttemptRoutes from "./routes/puzzleAttemptRoutes.js";
// import attemptCountRoutes from "./routes/attemptStatsRoutes.js";
// import { connectDB } from "./config/db.js";

// dotenv.config();

// const app = express();

// // ---- Security ----
// app.use(helmet());

// // ---- CORS ----
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://10.159.191.56:8081" ;
// app.use(cors({
//   origin: FRONTEND_URL,
//   credentials: true,
// }));

// // ---- JSON parser ----
// app.use(express.json());

// // ---- Rate limiter ----
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200,                 // limit each IP to 200 requests per window
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// // ---- Routes ----
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/puzzles", puzzleRoutes);
// app.use("/api/fetch-puzzles", fetchPuzzleRoutes);
// app.use("/api/puzzle-attempts", puzzleAttemptRoutes);
// app.use("/api/attempts", attemptCountRoutes);


// const io = new Server(server, {
//   cors: { origin: "*", methods: ["GET", "POST"] },
// });

// io.on("connection", (socket) => {
//   console.log("⚡ User connected:", socket.id);

//   socket.on("registerUser", (userId) => {
//     socket.join(userId); // join room by userId
//     console.log("🟢 User registered for socket:", userId);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 User disconnected:", socket.id);
//   });
// });

// app.set("io", io);
// app.use("/api/friends", friendRoutes);

// // ---- Test endpoint ----
// app.get("/", (req, res) => res.json({ message: "Educational Puzzle App API is running" }));

// // ---- Start server ----
// const PORT = process.env.PORT || 3000;

// connectDB()
//   .then(() => {
//     console.log("MongoDB connected successfully");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1); // exit if DB connection fails
//   });




// import express from "express";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import cors from "cors";
// import rateLimit from "express-rate-limit";
// import { createServer } from "http"; // ✅ Needed to create HTTP server for Socket.IO
// import { Server } from "socket.io";

// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/user.js";
// import friendRoutes from "./routes/friendRoutes.js";
// import puzzleRoutes from "./routes/puzzle.js";
// import fetchPuzzleRoutes from "./routes/fetchPuzzles.js";
// import puzzleAttemptRoutes from "./routes/puzzleAttemptRoutes.js";
// import attemptCountRoutes from "./routes/attemptStatsRoutes.js";
// import { connectDB } from "./config/db.js";

// dotenv.config();

// const app = express();

// // ---- Security ----
// app.use(helmet());

// // ---- CORS ----
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://10.159.191.56:8081";
// app.use(
//   cors({
//     origin: FRONTEND_URL,
//     credentials: true,
//   })
// );

// // ---- JSON parser ----
// app.use(express.json());

// // ---- Rate limiter ----
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 200,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// // ---- Routes ----
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/puzzles", puzzleRoutes);
// app.use("/api/fetch-puzzles", fetchPuzzleRoutes);
// app.use("/api/puzzle-attempts", puzzleAttemptRoutes);
// app.use("/api/attempts", attemptCountRoutes);
// app.use("/api/friends", friendRoutes);

// // ---- Test endpoint ----
// app.get("/", (req, res) =>
//   res.json({ message: "Educational Puzzle App API is running" })
// );

// // ---- Create HTTP server and attach Socket.IO ----
// const PORT = process.env.PORT || 3000;
// const httpServer = createServer(app); // ✅ Create HTTP server for Socket.IO
// const io = new Server(httpServer, {
//   cors: { origin: "*", methods: ["GET", "POST"] },
// });

// io.on("connection", (socket) => {
//   console.log("⚡ User connected:", socket.id);

//   socket.on("registerUser", (userId) => {
//     socket.join(userId);
//     console.log("🟢 User registered for socket:", userId);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 User disconnected:", socket.id);
//   });
// });

// // Make io accessible in routes
// app.set("io", io);

// // ---- Connect DB and start server ----
// connectDB()
//   .then(() => {
//     console.log("MongoDB connected successfully");
//     httpServer.listen(PORT, () =>
//       console.log(`Server running on port ${PORT}`)
//     );
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });


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
        console.warn(`❌ Blocked by CORS: ${origin}`);
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
// 3️⃣ Update GamingQuizEvent status every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const GamingQuizEvent = (await import("./models/GamingQuizEvent.js")).default;
    // Set live
    await GamingQuizEvent.updateMany(
      { isActive: true, status: { $ne: "disabled" }, startTime: { $lte: now }, endTime: { $gte: now } },
      { $set: { status: "live" } }
    );
    // Set completed
    await GamingQuizEvent.updateMany(
      { isActive: true, status: { $ne: "disabled" }, endTime: { $lt: now } },
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
          <h2 style="color:#a21caf;">Renew Your Eduzzle Premium Plan</h2>
          <p>Hi <b>${user.name}</b>,</p>
          <p>Your <b>${planName}</b> subscription is expiring on <b>${expiryDate}</b>.</p>
          <p>Renew now to continue enjoying uninterrupted premium access!</p>
          <a href="https://yourappdomain.com/renew" style="display:inline-block;margin-top:10px;padding:10px 20px;background:#a21caf;color:#fff;text-decoration:none;border-radius:8px;">Renew Now</a>
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
  // Automatically join room based on handshake query userId (for notifications)
  const userIdFromQuery = socket.handshake.query?.userId;
  if (userIdFromQuery) {
    socket.join(userIdFromQuery);
    console.log("🟢 User auto-joined room:", userIdFromQuery);
  }

  socket.on("registerUser", (userId) => {
    // Fallback manual registration
    socket.join(userId);
    console.log("🟢 User registered for socket (manual):", userId);
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

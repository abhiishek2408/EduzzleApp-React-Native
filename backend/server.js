// server.js
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import puzzleRoutes from "./routes/puzzle.js";
import fetchPuzzleRoutes from "./routes/fetchPuzzles.js";
import puzzleAttemptRoutes from "./routes/puzzleAttemptRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// ---- Security ----
app.use(helmet());

// ---- CORS ----
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8081";
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// ---- JSON parser ----
app.use(express.json());

// ---- Rate limiter ----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                 // limit each IP to 200 requests per window
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

// ---- Test endpoint ----
app.get("/", (req, res) => res.json({ message: "Educational Puzzle App API is running" }));

// ---- Start server ----
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // exit if DB connection fails
  });




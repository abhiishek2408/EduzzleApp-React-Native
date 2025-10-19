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




import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createServer } from "http"; // ✅ Needed to create HTTP server for Socket.IO
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import friendRoutes from "./routes/friendRoutes.js";
import puzzleRoutes from "./routes/puzzle.js";
import fetchPuzzleRoutes from "./routes/fetchPuzzles.js";
import puzzleAttemptRoutes from "./routes/puzzleAttemptRoutes.js";
import attemptCountRoutes from "./routes/attemptStatsRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// ---- Security ----
app.use(helmet());

// ---- CORS ----
const FRONTEND_URL = process.env.FRONTEND_URL || "http://10.159.191.56:8081";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// ---- JSON parser ----
app.use(express.json());

// ---- Rate limiter ----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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

// ---- Test endpoint ----
app.get("/", (req, res) =>
  res.json({ message: "Educational Puzzle App API is running" })
);

// ---- Create HTTP server and attach Socket.IO ----
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app); // ✅ Create HTTP server for Socket.IO
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("registerUser", (userId) => {
    socket.join(userId);
    console.log("🟢 User registered for socket:", userId);
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
    console.log("MongoDB connected successfully");
    httpServer.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

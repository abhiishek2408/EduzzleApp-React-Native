// routes/gamingQuizEventRoutes.js
import express from "express";
import mongoose from "mongoose";
import GamingQuizEvent from "../models/GamingQuizEvent.js";
import GamingQuizEventAttempt from "../models/GamingQuizEventAttempt.js";

const router = express.Router();

// Check if user has completed a specific event
router.get("/check-completed/:eventId/:userId", async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const attempt = await GamingQuizEventAttempt.findOne({ eventId, userId, finishedAt: { $ne: null } });
    if (attempt) {
      return res.json({ completed: true, attemptId: attempt._id });
    } else {
      return res.json({ completed: false });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to check completion", error: e.message });
  }
});

// Utility: is event active
function isWithinWindow(event) {
  const now = new Date();
  return now >= new Date(event.startTime) && now <= new Date(event.endTime);
}

// Admin: create event
router.post("/admin", async (req, res) => {
  try {
    const event = await GamingQuizEvent.create(req.body);
    return res.status(201).json(event);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "Failed to create event", error: e.message });
  }
});

// Admin: update event
router.put("/admin/:id", async (req, res) => {
  try {
    const event = await GamingQuizEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json(event);
  } catch (e) {
    return res.status(400).json({ message: "Failed to update event", error: e.message });
  }
});

// Admin: delete event
router.delete("/admin/:id", async (req, res) => {
  try {
    await GamingQuizEvent.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(400).json({ message: "Failed to delete event", error: e.message });
  }
});

// Public: list events (filters by status/time)
router.get("/", async (req, res) => {
  try {
    const { scope } = req.query; // upcoming|live|past
    const now = new Date();
    let filter = { status: { $ne: "disabled" } };
    if (scope === "upcoming") filter.startTime = { $gt: now };
    else if (scope === "live") filter.$and = [{ startTime: { $lte: now } }, { endTime: { $gte: now } }];
    else if (scope === "past") filter.endTime = { $lt: now };
    const events = await GamingQuizEvent.find(filter).sort({ startTime: 1 });
    res.json(events);
  } catch (e) {
    res.status(500).json({ message: "Failed to list events" });
  }
});

// Public: get event by id
router.get("/:id", async (req, res) => {
  const ev = await GamingQuizEvent.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  res.json(ev);
});

// Join event (creates attempt record, handles entry cost)
router.post("/:id/join", async (req, res) => {
  try {
    const { userId } = req.body;
    const ev = await GamingQuizEvent.findById(req.params.id);
    if (!ev || ev.status === "disabled") return res.status(404).json({ message: "Event not available" });
    if (!isWithinWindow(ev) && ev.status !== "live") return res.status(403).json({ message: "Event not live" });

    const existing = await GamingQuizEventAttempt.findOne({ eventId: ev._id, userId });
    if (existing) {
      if (!ev.allowMultipleAttempts) {
        // If already attempted and finished, don't allow rejoin
        if (existing.finishedAt) {
          return res.status(409).json({
            message: "You have already completed this event",
            attemptId: existing._id,
            finished: true,
          });
        }

        // If attempt window expired, block re-join
        const maxDurationSec = (ev.questions || []).reduce((sum, q) => sum + (Number(q.timeLimit) || 0), 0);
        if (maxDurationSec > 0 && existing.startedAt) {
          const elapsedSec = Math.floor((Date.now() - new Date(existing.startedAt)) / 1000);
          if (elapsedSec > maxDurationSec) {
            return res.status(403).json({ message: "Time over for this attempt" });
          }
        }

        // If joined but not finished and within time, allow them to continue
        return res.status(200).json({
          success: true,
          attemptId: existing._id,
          message: "Continue your attempt",
        });
      }
    }

    const attempt = await GamingQuizEventAttempt.create({ eventId: ev._id, userId, startedAt: new Date() });
    res.status(201).json({ success: true, attemptId: attempt._id });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to join event", error: e.message });
  }
});

// Fetch randomized questions for an event
router.get("/:id/questions", async (req, res) => {
  try {
    const ev = await GamingQuizEvent.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: "Event not found" });
    if (!isWithinWindow(ev) && ev.status !== "live") return res.status(403).json({ message: "Event not live" });

  // Use embedded questions; optionally randomize (no artificial cap)
  let qs = Array.isArray(ev.questions)
    ? ev.questions.map((q, index) => ({ q, index }))
    : [];
  if (!qs.length) return res.status(404).json({ message: "No questions configured for event" });
  if (ev.randomizeQuestions) qs.sort(() => Math.random() - 0.5);

    const payload = qs.map(({ q, index }) => ({
      questionIndex: index,
      question: q.question || q.text,
      text: q.text,
      options: q.options,
      image: q.image,
      timeLimit: q.timeLimit,
    }));
    const totalTimerSec = qs.reduce((sum, q) => sum + (Number(q.timeLimit) || 0), 0);
    res.json({ questions: payload, totalTimerSec });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to fetch questions" });
  }
});

// Submit answers and compute score
router.post("/:id/submit", async (req, res) => {
  try {
    const { userId, answers = [] } = req.body; // answers: [{questionIndex, selectedOption}]
    const ev = await GamingQuizEvent.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: "Event not found" });

    const attempt = await GamingQuizEventAttempt.findOne({ eventId: ev._id, userId });
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    if (attempt.finishedAt) return res.status(409).json({ message: "Already submitted" });

    // Enforce server-side event window
    if (!isWithinWindow(ev) && ev.status !== "live") {
      return res.status(403).json({ message: "Event not live" });
    }

    // Enforce duration limit based on sum of question time limits (server time)
    const maxDurationSec = (ev.questions || []).reduce((sum, q) => sum + (Number(q.timeLimit) || 0), 0);
    const startedAt = attempt.startedAt ? new Date(attempt.startedAt) : new Date();
    const elapsedSec = Math.floor((Date.now() - startedAt.getTime()) / 1000);
    if (maxDurationSec > 0 && elapsedSec > maxDurationSec) {
      return res.status(403).json({ message: "Time over for this attempt" });
    }

    // Score
    let score = 0, correct = 0, wrong = 0, streak = 0;
    const computedAnswers = answers.map((a) => {
      let correctAns;
      if (Number.isInteger(a.questionIndex)) {
        const q = (ev.questions || [])[a.questionIndex];
        correctAns = q?.answer;
      } else if (a.questionId) {
        const q = (ev.questions || []).find((qq) => String(qq._id) === String(a.questionId));
        correctAns = q?.answer;
      }
      const isCorrect = String(a.selectedOption) === String(correctAns);
      if (isCorrect) {
        score += ev.scoring.correct;
        correct += 1;
        streak += 1;
      } else {
        score += ev.scoring.wrong;
        wrong += 1;
        streak = 0;
      }
      return { ...a, isCorrect };
    });

    attempt.score = score;
    attempt.correctCount = correct;
    attempt.wrongCount = wrong;
    attempt.answers = computedAnswers;
    attempt.finishedAt = new Date();
    if (maxDurationSec > 0) {
      attempt.durationSec = maxDurationSec > 0 ? Math.min(elapsedSec, maxDurationSec) : elapsedSec;
    } else {
        attempt.durationSec = elapsedSec;
    }
    await attempt.save();

    // Optional: basic reward for top placements can be handled after leaderboard aggregation
    const io = req.app.get("io");
    if (io) io.emit("event:score-updated", { eventId: String(ev._id), userId: String(userId), score });

    res.json({ success: true, score, correct, wrong });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Failed to submit answers" });
  }
});

// Leaderboard
router.get("/:id/leaderboard", async (req, res) => {
  try {
      const { limit = 50 } = req.query;
      const rows = await GamingQuizEventAttempt.find({ eventId: req.params.id, disqualified: false })
        .sort({ score: -1, durationSec: 1, createdAt: 1 })
        .limit(parseInt(limit))
        .populate("userId", "name profilePic");
      res.json(rows);
  } catch (e) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

// Analytics summary
router.get("/:id/analytics", async (req, res) => {
  try {
    const eventId = new mongoose.Types.ObjectId(req.params.id);
    const [summary] = await GamingQuizEventAttempt.aggregate([
      { $match: { eventId, disqualified: false, finishedAt: { $ne: null } } },
      { $addFields: {
          correctCount: { $ifNull: ["$correctCount", 0] },
          wrongCount: { $ifNull: ["$wrongCount", 0] },
          score: { $ifNull: ["$score", 0] },
          durationSec: { $ifNull: ["$durationSec", 0] }
        }
      },
      { $addFields: {
          totalAnswered: { $add: ["$correctCount", "$wrongCount"] }
        }
      },
      { $group: {
          _id: "$eventId",
          participants: { $sum: 1 },
          avgScore: { $avg: "$score" },
          avgDuration: { $avg: "$durationSec" },
          avgAccuracy: {
            $avg: {
              $cond: [
                { $gt: ["$totalAnswered", 0] },
                { $divide: ["$correctCount", "$totalAnswered"] },
                null
              ]
            }
          }
        }
      }
    ]);
    res.json(summary || { participants: 0, avgScore: 0, avgDuration: 0, avgAccuracy: 0 });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch analytics", error: e.message });
  }
});

export default router;

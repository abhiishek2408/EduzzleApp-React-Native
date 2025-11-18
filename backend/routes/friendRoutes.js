import express from "express";
import User from "../models/User.js";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

/**
 * 📩 SEND FRIEND REQUEST
 */
router.post("/send/:userId", async (req, res) => {
  try {
    const io = req.app.get("io");
    const senderId = req.body.senderId;
    const receiverId = req.params.userId;

    if (senderId === receiverId)
      return res.status(400).json({ message: "You cannot send a request to yourself" });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ message: "User not found" });

    if (sender.friends.includes(receiverId))
      return res.status(400).json({ message: "Already friends" });

    if (sender.sentRequests.includes(receiverId))
      return res.status(400).json({ message: "Request already sent" });

    if (receiver.friendRequests.includes(senderId))
      return res.status(400).json({ message: "Request already received" });

    sender.sentRequests.push(receiverId);
    receiver.friendRequests.push(senderId);

    await sender.save();
    await receiver.save();

    // ⚡ Real-time notification to receiver
    if (io.sockets.sockets.get(receiverId)) {
      io.to(receiverId).emit("friendRequestReceived", {
        from: { _id: sender._id, name: sender.name, profilePic: sender.profilePic },
      });
    }

    res.json({ message: "Friend request sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * ✅ ACCEPT FRIEND REQUEST
 */
router.post("/accept/:userId", async (req, res) => {
  try {
    const io = req.app.get("io");
    const receiverId = req.body.receiverId; // current logged-in user
    const senderId = req.params.userId;     // sender of request

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver.friendRequests.includes(senderId))
      return res.status(400).json({ message: "No pending request from this user" });

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);

    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    await receiver.save();
    await sender.save();

    // ⚡ Real-time updates
    if (io.sockets.sockets.get(senderId)) {
      io.to(senderId).emit("friendRequestAccepted", {
        by: { _id: receiver._id, name: receiver.name, profilePic: receiver.profilePic },
      });
    }
    if (io.sockets.sockets.get(receiverId)) {
      io.to(receiverId).emit("friendAdded", {
        friend: { _id: sender._id, name: sender.name, profilePic: sender.profilePic },
      });
    }

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * ❌ REJECT FRIEND REQUEST
 */
router.post("/reject/:userId", async (req, res) => {
  try {
    const io = req.app.get("io");
    const receiverId = req.body.receiverId; // current logged-in user
    const senderId = req.params.userId;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);

    await receiver.save();
    await sender.save();

    // ⚡ Real-time notification to sender
    if (io.sockets.sockets.get(senderId)) {
      io.to(senderId).emit("friendRequestRejected", {
        by: { _id: receiver._id, name: receiver.name, profilePic: receiver.profilePic },
      });
    }

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * 🚫 CANCEL SENT FRIEND REQUEST (by sender)
 */
router.post("/cancel/:userId", async (req, res) => {
  try {
    const io = req.app.get("io");
    const senderId = req.body.senderId;   // current logged-in user (sender)
    const receiverId = req.params.userId; // receiver whose pending list has the request

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) return res.status(404).json({ message: "User not found" });

    // Remove request if exists
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);
    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);

    await sender.save();
    await receiver.save();

    // ⚡ Notify receiver that request was cancelled
    if (io.sockets.sockets.get(receiverId)) {
      io.to(receiverId).emit("friendRequestCancelled", {
        by: { _id: sender._id, name: sender.name, profilePic: sender.profilePic },
      });
    }

    res.json({ message: "Friend request cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * 🧑‍🤝‍🧑 GET FRIEND LIST
 */
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("friends", "name email profilePic");

    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * 🔄 REMOVE (UNFRIEND)
 */
router.post("/remove/:friendId", async (req, res) => {
  try {
    const io = req.app.get("io");
    const userId = req.body.userId;
    const friendId = req.params.friendId;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) return res.status(404).json({ message: "User not found" });
    if (!user.friends.includes(friendId)) return res.status(400).json({ message: "Not friends" });

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    // ⚡ Notify removed friend
    if (io.sockets.sockets.get(friendId)) {
      io.to(friendId).emit("friendRemoved", {
        by: { _id: user._id, name: user.name, profilePic: user.profilePic },
      });
    }

    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * 🕓 GET PENDING FRIEND REQUESTS
 */
router.get("/pending/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("friendRequests", "name email profilePic")
      .populate("sentRequests", "name email profilePic");

    res.json({
      received: user.friendRequests,
      sent: user.sentRequests,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🤝 CHECK IF TWO USERS ARE FRIENDS
 * Returns: { isFriend: boolean }
 */
router.get("/is-friend/:userId/:otherId", async (req, res) => {
  try {
    const { userId, otherId } = req.params;
    const user = await User.findById(userId).select("friends");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isFriend = user.friends?.some(id => id.toString() === otherId);
    res.json({ isFriend: !!isFriend });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🏆 GET FRIENDS LEADERBOARD
 * Returns leaderboard with friends' quiz stats sorted by total points
 */
router.get("/leaderboard/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get current user with friends list
    const currentUser = await User.findById(userId).select("friends");
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Include current user + all friends
    const userIds = [userId, ...currentUser.friends.map(id => id.toString())];

    // Aggregate quiz attempts to get stats for each user
    const stats = await QuizAttempt.aggregate([
      {
        $match: {
          userId: { $in: userIds.map(id => id) }
        }
      },
      {
        $group: {
          _id: "$userId",
          quizzesSolved: { $addToSet: "$quizId" }, // unique quizzes
          totalPoints: { $sum: "$totalScore" }
        }
      },
      {
        $project: {
          userId: "$_id",
          quizzesSolved: { $size: "$quizzesSolved" },
          totalPoints: 1
        }
      },
      {
        $sort: { totalPoints: -1, quizzesSolved: -1 } // sort by points desc
      }
    ]);

    // Get user details for each entry
    const leaderboard = await Promise.all(
      stats.map(async (stat) => {
        const user = await User.findById(stat.userId).select("name profilePic");
        return {
          userId: stat.userId,
          name: user?.name || "Unknown",
          profilePic: user?.profilePic || "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg",
          quizzesSolved: stat.quizzesSolved,
          totalPoints: stat.totalPoints
        };
      })
    );

    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

// import express from "express";
// import upload from "../middlewares/uploadMiddleware.js";
// import cloudinary from "../config/cloudinary.js";
// import  authenticate  from "../middlewares/auth.js";
// import User from "../models/User.js";

// const router = express.Router();

// // get profile (auth required)
// router.get("/profile", authenticate, async (req, res) => {
//   const u = req.user;
//   res.json({ id: u._id, name: u.name, email: u.email, role: u.role, isVerified: u.isVerified });
// });


// router.put("/profile-pic", authenticate, upload.single("profilePic"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     // Upload to Cloudinary
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: "user_profiles" },
//       async (error, result) => {
//         if (error) return res.status(500).json({ message: "Upload failed", error });

//         // Update in MongoDB using token's user ID
//         const user = await User.findByIdAndUpdate(
//           req.user._id,
//           { profilePic: result.secure_url },
//           { new: true }
//         );

//         res.status(200).json({
//           message: "Profile picture updated successfully",
//           user
//         });
//       }
//     );

//     uploadStream.end(req.file.buffer);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



// // example admin-only route
// // router.get("/admin/users", authenticate, authorizeRoles("admin"), async (req, res) => {
// //   const users = await User.find().select("-password -otp -resetPasswordToken");
// //   res.json(users);
// // });

// export default router;


// routes/userRoutes.js
import express from "express";
import { upload } from "../middlewares/multer.js";
import cloudinary from "../config/cloudinary.js";
import authenticate from "../middlewares/auth.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ GET user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const u = req.user;
    res.json({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      isVerified: u.isVerified,
      profilePic: u.profilePic || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ UPDATE profile picture
router.put(
  "/profile-pic",
  authenticate,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      // Check auth
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("File received:", req.file.originalname, req.file.mimetype);
      console.log("Cloudinary config loaded:", !!process.env.CLOUDINARY_API_KEY);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_profiles" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else resolve(result);
          }
        );

        if (!req.file.buffer) return reject(new Error("File buffer missing"));

        stream.end(req.file.buffer);
      });

      // Update MongoDB
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePic: result.secure_url },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "Profile picture updated successfully",
        user,
      });
    } catch (err) {
      console.error("Profile-pic upload error:", err);
      res.status(500).json({
        message: "Server error",
        error: err.message,
        stack: err.stack,
      });
    }
  }
);


router.get("/search", authenticate, async (req, res) => {
  try {
    const query = req.query.query || "";
    if (!query) return res.json([]);

    // Search by name or email (case-insensitive)
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("name email profilePic"); // return only necessary fields

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Change password
router.put("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // Get user with password field
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

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
import upload from "../middlewares/uploadMiddleware.js";
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
router.put("/profile-pic", authenticate, upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "user_profiles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Update user profilePic in MongoDB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated successfully",
      user,
    });
  } catch (err) {
    console.error("Profile-pic upload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

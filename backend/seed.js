// seedUser.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // adjust path if needed

dotenv.config();

const seedUser = async () => {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = "abhishekydv2408@gmail.com"; // unique email for seed user

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("⚠️  User already exists:", existingUser.email);
    } else {
      // ✅ Hash password
      const hashedPassword = await bcrypt.hash("User@#890", 10);

      // ✅ Create new seed user
      const user = new User({
        name: "Abhishek Yadav",
        email,
        password: hashedPassword,
        role: "user",
        isVerified: true,
        profilePic:
          "https://res.cloudinary.com/demo/image/upload/v1710000000/default-profile.png",
      });

      await user.save();
      console.log("✅ New user seeded successfully:", user.email);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding user:", error);
    mongoose.connection.close();
  }
};

seedUser();

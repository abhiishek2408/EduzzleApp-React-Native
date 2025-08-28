// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       autoIndex: true
//     });
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connect error:", err);
//     process.exit(1);
//   }
// };


// import mongoose from "mongoose";

// export const connectDB = async () => {
//   const mongoUri = process.env.MONGO_URI;
//   if (!mongoUri) throw new Error("MONGO_URI not set in env");
//   await mongoose.connect(mongoUri, {
//     // mongoose 7+ uses sensible defaults
//   });
//   console.log("MongoDB connected");
// };


// config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/edu-puzzle";
    const conn = await mongoose.connect(mongoURI); // no need for useNewUrlParser / useUnifiedTopology
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};


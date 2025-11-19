import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  feedback: { 
    type: String, 
    default: "" 
  },
  isPositive: { 
    type: Boolean, 
    default: false 
  },
  redirectedToPlayStore: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;

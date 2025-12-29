
import mongoose from 'mongoose';



const MCQSchema = new mongoose.Schema({
  question: {
    text: { type: String, required: true },
    images: [{ type: String }],
    latex: { type: String },
  },
  options: [
    {
      text: { type: String, required: true },
      image: { type: String },
      latex: { type: String },
      isCorrect: { type: Boolean },
    }
  ],
  answer: { type: String, required: true },
  solution: {
    text: { type: String },
    images: [{ type: String }],
    latex: { type: String },
    video: { type: String },
  },
  course: {
    name: { type: String, required: true },
    subjects: [
      {
        name: { type: String, required: true },
        syllabus: [
          {
            name: { type: String, required: true },
            categories: [
              {
                name: { type: String, required: true },
                topics: [{ type: String }]
              }
            ]
          }
        ]
      }
    ]
  },
  tags: [{ type: String }],
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  explanation: { type: String },
  author: { type: String },
  isActive: { type: Boolean, default: true },
  stats: {
    attempts: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
  },
}, { timestamps: true });

const MCQ = mongoose.model('MCQ', MCQSchema);
export default MCQ;

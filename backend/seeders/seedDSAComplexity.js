import mongoose from "mongoose";
import dotenv from "dotenv";
import MCQ from "../models/MCQ.js";

dotenv.config();


// Helper to build nested structure for each MCQ
function buildNested(course, subject, syllabus, category, topic) {
  return {
    name: course,
    subjects: [
      {
        name: subject,
        syllabus: [
          {
            name: syllabus,
            categories: [
              {
                name: category,
                topics: [topic]
              }
            ]
          }
        ]
      }
    ]
  };
}

// Example data for DSA/Time and Complexity
const courses = ['DSA'];
const subjects = ['Computer Science'];
const syllabi = ['Time and Complexity'];
const categories = ['Array', 'Linked List', 'Stack', 'Queue', 'Heap', 'Graph', 'Tree'];
const topics = ['Time Complexity', 'Space Complexity'];

// Generate 50 MCQs with nested structure
const mcqs = [];
let count = 0;
for (let c of courses) {
  for (let s of subjects) {
    for (let sy of syllabi) {
      for (let cat of categories) {
        for (let t of topics) {
          if (count >= 50) break;
          mcqs.push({
            question: { text: `Sample MCQ ${count + 1} for ${cat} (${t})`, images: [] },
            options: [
              { text: 'O(1)', isCorrect: Math.random() > 0.5 },
              { text: 'O(n)', isCorrect: Math.random() > 0.5 },
              { text: 'O(log n)', isCorrect: Math.random() > 0.5 },
              { text: 'O(n^2)', isCorrect: Math.random() > 0.5 },
            ],
            answer: 'O(1)',
            solution: { text: `Explanation for ${cat} (${t})`, images: [] },
            course: buildNested(c, s, sy, cat, t),
            tags: ['dsa', cat.toLowerCase(), t.toLowerCase()],
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
            author: 'Seeder',
          });
          count++;
        }
      }
    }
  }
}

// Seeding logic
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");
    await MCQ.deleteMany({});
    await MCQ.insertMany(mcqs);
    console.log('Seeded DSA Time and Complexity MCQs!');
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding MCQs:", error);
    process.exit(1);
  }
}

seed();

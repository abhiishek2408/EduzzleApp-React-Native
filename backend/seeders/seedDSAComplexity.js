import mongoose from "mongoose";
import dotenv from "dotenv";
import MCQ from "../models/MCQ.js";

dotenv.config();

// Syllabus topics as provided
const syllabusList = [
  "Introduction to DSA",
  "Time & Space Complexity",
  "Arrays",
  "Strings",
  "Recursion",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Hashing",
  "Trees",
  "Binary Search Trees",
  "Heaps / Priority Queues",
  "Graphs",
  "Sorting Algorithms",
  "Searching Algorithms",
  "Greedy Algorithms",
  "Dynamic Programming",
  "Backtracking",
  "Divide and Conquer",
  "Bit Manipulation",
  "Tries",
  "Disjoint Set (Union-Find)",
  "Segment Trees",
  "Fenwick Tree (Binary Indexed Tree)",
];

// Helper to build nested structure for each MCQ
function courseBlock(category, syllabus, topic = "Time Complexity") {
  return {
    name: "Computer Science",
    subjects: [
      {
        name: "Data Structures and Algorithms",
        syllabus: [
          {
            name: syllabus,
            categories: [{ name: category, topics: [topic] }],
          },
        ],
      },
    ],
  };
}

// Example MCQs for a few syllabus topics
const mcqs = [
  {
    question: { text: "What is DSA?", images: [] },
    options: [
      { text: "Data Structures and Algorithms", isCorrect: true },
      { text: "Digital Signal Analysis", isCorrect: false },
      { text: "Direct System Access", isCorrect: false },
      { text: "None of the above", isCorrect: false },
    ],
    answer: "Data Structures and Algorithms",
    solution: { text: "DSA stands for Data Structures and Algorithms.", images: [] },
    course: courseBlock("General", syllabusList[0]),
    tags: ["dsa", "intro"],
    difficulty: "easy",
    author: "Seeder",
  },
  {
    question: { text: "What is the time complexity of linear search?", images: [] },
    options: [
      { text: "O(1)", isCorrect: false },
      { text: "O(n)", isCorrect: true },
      { text: "O(log n)", isCorrect: false },
      { text: "O(n^2)", isCorrect: false },
    ],
    answer: "O(n)",
    solution: { text: "Linear search checks each element once.", images: [] },
    course: courseBlock("Array", syllabusList[2]),
    tags: ["array", "search"],
    difficulty: "easy",
    author: "Seeder",
  },
  {
    question: { text: "Which data structure uses LIFO?", images: [] },
    options: [
      { text: "Queue", isCorrect: false },
      { text: "Stack", isCorrect: true },
      { text: "Array", isCorrect: false },
      { text: "Tree", isCorrect: false },
    ],
    answer: "Stack",
    solution: { text: "Stack uses Last-In-First-Out principle.", images: [] },
    course: courseBlock("Stack", syllabusList[6]),
    tags: ["stack"],
    difficulty: "easy",
    author: "Seeder",
  },
  {
    question: { text: "Which algorithm is used for shortest path in graphs?", images: [] },
    options: [
      { text: "Dijkstra's Algorithm", isCorrect: true },
      { text: "Bubble Sort", isCorrect: false },
      { text: "Binary Search", isCorrect: false },
      { text: "DFS", isCorrect: false },
    ],
    answer: "Dijkstra's Algorithm",
    solution: { text: "Dijkstra's is a classic shortest path algorithm.", images: [] },
    course: courseBlock("Graph", syllabusList[12]),
    tags: ["graph", "dijkstra"],
    difficulty: "medium",
    author: "Seeder",
  },
  // ...add more MCQs for other syllabus topics as needed...
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");

    await MCQ.deleteMany({});
    await MCQ.insertMany(mcqs);

    console.log("Seeded DSA MCQs for all syllabus topics!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding MCQs:", error);
    process.exit(1);
  }
}

seed();
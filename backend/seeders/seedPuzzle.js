const mongoose = require('mongoose');
const Puzzle = require('../models/Puzzle'); // Make sure this path is correct

mongoose.connect('mongodb://10.124.194.56:27017/edu-puzzle', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  seedPuzzle();
}).catch(err => console.error('❌ Connection Error:', err));

async function seedPuzzle() {
  try {
    await Puzzle.deleteMany();

    const puzzle = new Puzzle({
      name: "Math Mastery",
      description: "Challenge yourself with math puzzles from basic to advanced.",
      category: "Mathematics",
      numberOfLevels: 3,
      author: "Admin",
      totalMarks: 60,
      tags: ["math", "quiz", "arithmetic"],
      allowedUsers: ["686e2f30d18973d82b1f0231"], // Visible to all users by default
      levels: [
        {
          name: "Easy",
          timeLimit: 60,
          maxMarks: 10,
          passingMarks: 5,
          difficulty: "easy",
          instructions: "Solve basic arithmetic problems.",
          order: 1,
          questions: [
            {
              question: "What is 2 + 2?",
              options: ["3", "4", "5", "6"],
              answer: "4",
              explanation: "2 + 2 = 4",
              hint: "Add both numbers.",
              points: 2
            },
            {
              question: "What is 10 - 4?",
              options: ["6", "5", "7", "4"],
              answer: "6",
              explanation: "10 minus 4 equals 6",
              hint: "Subtract 4 from 10.",
              points: 2
            },
            {
              question: "Which number is even?",
              options: ["3", "5", "8", "7"],
              answer: "8",
              explanation: "8 is divisible by 2.",
              hint: "Even numbers are divisible by 2.",
              points: 2
            },
            {
              question: "What is 5 + 3?",
              options: ["6", "7", "8", "9"],
              answer: "8",
              explanation: "5 plus 3 equals 8.",
              hint: "Add them step by step.",
              points: 2
            },
            {
              question: "What is 1 more than 9?",
              options: ["10", "11", "8", "12"],
              answer: "10",
              explanation: "9 + 1 = 10",
              hint: "Add one.",
              points: 2
            }
          ]
        },

        {
          name: "Medium",
          timeLimit: 90,
          maxMarks: 20,
          passingMarks: 10,
          difficulty: "medium",
          instructions: "Work with multiplication and division.",
          order: 2,
          questions: [
            {
              question: "What is 12 ÷ 3?",
              options: ["4", "3", "6", "5"],
              answer: "4",
              explanation: "12 divided by 3 is 4.",
              hint: "3 times what is 12?",
              points: 4
            },
            {
              question: "What is 7 × 6?",
              options: ["42", "36", "48", "49"],
              answer: "42",
              explanation: "7 times 6 equals 42.",
              hint: "Use multiplication tables.",
              points: 4
            },
            {
              question: "What is half of 100?",
              options: ["40", "50", "60", "25"],
              answer: "50",
              explanation: "100 ÷ 2 = 50",
              hint: "Divide by 2.",
              points: 4
            },
            {
              question: "Which number is a multiple of 9?",
              options: ["18", "20", "15", "10"],
              answer: "18",
              explanation: "9 × 2 = 18",
              hint: "Check divisibility by 9.",
              points: 4
            },
            {
              question: "What is 36 ÷ 6?",
              options: ["5", "6", "7", "8"],
              answer: "6",
              explanation: "6 × 6 = 36",
              hint: "Try dividing step-by-step.",
              points: 4
            }
          ]
        },

        {
          name: "Hard",
          timeLimit: 120,
          maxMarks: 30,
          passingMarks: 15,
          difficulty: "hard",
          instructions: "Tackle multi-step and logic-based math problems.",
          order: 3,
          questions: [
            {
              question: "What is (5 + 3) × 2?",
              options: ["16", "10", "8", "12"],
              answer: "16",
              explanation: "5 + 3 = 8, then 8 × 2 = 16",
              hint: "Use brackets first.",
              points: 6
            },
            {
              question: "If x = 4, what is 2x + 3?",
              options: ["11", "10", "9", "8"],
              answer: "11",
              explanation: "2×4 = 8, then 8 + 3 = 11",
              hint: "Use substitution.",
              points: 6
            },
            {
              question: "What is the square of 9?",
              options: ["81", "72", "99", "91"],
              answer: "81",
              explanation: "9 × 9 = 81",
              hint: "Square means number × itself.",
              points: 6
            },
            {
              question: "What is (15 ÷ 3) + (4 × 2)?",
              options: ["13", "14", "11", "12"],
              answer: "13",
              explanation: "15 ÷ 3 = 5, 4 × 2 = 8, 5 + 8 = 13",
              hint: "Solve inside brackets first.",
              points: 6
            },
            {
              question: "If y = 5, what is y² + 2y?",
              options: ["35", "30", "25", "40"],
              answer: "35",
              explanation: "5² = 25, 2×5 = 10, 25 + 10 = 35",
              hint: "Use exponents.",
              points: 6
            }
          ]
        }
      ]
    });

    await puzzle.save();
    console.log("✅ Puzzle seeded successfully with 5 questions in each level!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

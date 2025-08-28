const mongoose = require('mongoose');
const Puzzle = require('../models/Puzzle'); // Ensure correct path

mongoose.connect('mongodb://10.124.194.56:27017/edu-puzzle', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  seedPuzzle();
}).catch(err => console.error('❌ Connection Error:', err));

async function seedPuzzle() {
  try {
    const puzzles = [
     {
  name: "Math Wizards",
  description: "Sharpen your mind with fun and tricky math problems.",
  category: "Mathematics",
  numberOfLevels: 3,
  author: "Admin",
  totalMarks: 60,
  tags: ["math", "arithmetic", "logic", "kids"],
  allowedUsers: ["686e2f30d18973d82b1f0231"],
  levels: [
    {
      name: "Easy",
      timeLimit: 60,
      maxMarks: 10,
      passingMarks: 5,
      difficulty: "easy",
      instructions: "Simple arithmetic and number sense.",
      order: 1,
      questions: [
        {
          question: "What is 5 + 3?",
          options: ["6", "7", "8", "9"],
          answer: "8",
          explanation: "5 plus 3 equals 8.",
          hint: "Count fingers!",
          points: 2
        },
        {
          question: "Which number is even?",
          options: ["3", "7", "4", "9"],
          answer: "4",
          explanation: "Even numbers are divisible by 2.",
          hint: "Check division by 2.",
          points: 2
        },
        {
          question: "Which shape has 3 sides?",
          options: ["Circle", "Triangle", "Square", "Rectangle"],
          answer: "Triangle",
          explanation: "Triangle has 3 sides and 3 angles.",
          hint: "Tri = 3.",
          points: 2
        },
        {
          question: "What is 10 - 4?",
          options: ["6", "5", "4", "7"],
          answer: "6",
          explanation: "10 minus 4 is 6.",
          hint: "Subtract backward.",
          points: 2
        },
        {
          question: "Which number comes after 12?",
          options: ["10", "11", "13", "14"],
          answer: "13",
          explanation: "After 12 comes 13.",
          hint: "Count ahead.",
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
      instructions: "Solve intermediate math questions with logic.",
      order: 2,
      questions: [
        {
          question: "What is 9 x 3?",
          options: ["27", "21", "24", "30"],
          answer: "27",
          explanation: "9 multiplied by 3 is 27.",
          hint: "Use tables.",
          points: 4
        },
        {
          question: "What is half of 100?",
          options: ["25", "50", "40", "60"],
          answer: "50",
          explanation: "Half of 100 is 50.",
          hint: "Divide by 2.",
          points: 4
        },
        {
          question: "How many sides does a hexagon have?",
          options: ["4", "5", "6", "8"],
          answer: "6",
          explanation: "Hexa means 6.",
          hint: "Hex = 6.",
          points: 4
        },
        {
          question: "Which number is a multiple of both 3 and 5?",
          options: ["10", "15", "20", "25"],
          answer: "15",
          explanation: "15 is divisible by 3 and 5.",
          hint: "3 x 5 = ?",
          points: 4
        },
        {
          question: "What is 12 divided by 4?",
          options: ["2", "3", "4", "5"],
          answer: "3",
          explanation: "12 ÷ 4 = 3.",
          hint: "Think groups.",
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
      instructions: "Logic puzzles and advanced arithmetic for sharp minds.",
      order: 3,
      questions: [
        {
          question: "What is the square of 6?",
          options: ["36", "12", "18", "30"],
          answer: "36",
          explanation: "6 x 6 = 36.",
          hint: "Multiply the number by itself.",
          points: 6
        },
        {
          question: "Which number completes the pattern: 2, 4, 8, 16, __?",
          options: ["18", "20", "24", "32"],
          answer: "32",
          explanation: "Doubles each time: 2×2=4, 4×2=8, etc.",
          hint: "Keep doubling.",
          points: 6
        },
        {
          question: "A pizza is cut into 8 slices. If I eat 3, how many are left?",
          options: ["4", "5", "6", "3"],
          answer: "5",
          explanation: "8 - 3 = 5 slices left.",
          hint: "Simple subtraction.",
          points: 6
        },
        {
          question: "Which number is both a square and cube?",
          options: ["4", "9", "64", "16"],
          answer: "64",
          explanation: "64 = 8² and 4³.",
          hint: "Think 8 and 4.",
          points: 6
        },
        {
          question: "What is the perimeter of a square with side 5 cm?",
          options: ["10", "15", "20", "25"],
          answer: "20",
          explanation: "Perimeter = 4 × side = 20 cm.",
          hint: "Add all sides.",
          points: 6
        }
      ]
    }
  ]
}
,
    ];

    // Paste full "levels" array for each puzzle above

    await Puzzle.insertMany(puzzles);
    console.log("✅ Multiple puzzles seeded successfully without deleting existing data!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}



 
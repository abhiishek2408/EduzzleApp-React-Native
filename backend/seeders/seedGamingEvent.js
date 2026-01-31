// seeders/seedGamingEvent.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import GamingQuizEvent from "../models/GamingQuizEvent.js";

async function run() {
  try {
    await connectDB();

    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    // Seed a focused set of questions into QuestionBank for this event theme
    const questions = [
      {
        text: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "Hyperlinks and Text Markup Language",
          "Home Tool Markup Language",
          "Hyper Transfer Makeup Language",
        ],
        answer: "HyperText Markup Language",
        explanation: "HTML stands for HyperText Markup Language.",
        difficulty: "easy",
        timeLimit: 30,
      },
      {
        text: "Which company created JavaScript?",
        options: ["Netscape", "Microsoft", "Sun Microsystems", "Oracle"],
        answer: "Netscape",
        explanation: "JavaScript was created at Netscape by Brendan Eich in 1995.",
        difficulty: "easy",
        timeLimit: 30,
      },
      {
        text: "Node.js is built on which JavaScript engine?",
        options: ["V8", "SpiderMonkey", "Chakra", "JavaScriptCore"],
        answer: "V8",
        explanation: "Node.js uses Google's V8 JavaScript engine.",
        difficulty: "easy",
        timeLimit: 30,
      },
      {
        text: "Which HTTP status code means 'Created'?",
        options: ["200", "201", "204", "301"],
        answer: "201",
        explanation: "201 Created indicates that a new resource has been created.",
        difficulty: "medium",
        timeLimit: 30,
      },
      {
        text: "Who invented the World Wide Web?",
        options: [
          "Tim Berners-Lee",
          "Vint Cerf",
          "Linus Torvalds",
          "Dennis Ritchie",
        ],
        answer: "Tim Berners-Lee",
        explanation: "Tim Berners-Lee proposed the WWW in 1989 while at CERN.",
        difficulty: "medium",
        timeLimit: 30,
      },
      {
        text: "Which version control system is distributed?",
        options: ["Git", "Subversion (SVN)", "CVS", "Perforce"],
        answer: "Git",
        explanation: "Git is a distributed VCS created by Linus Torvalds.",
        difficulty: "easy",
        timeLimit: 30,
      },
      {
        text: "ECMAScript 2015 (ES6) introduced which feature?",
        options: ["let and const", "document.write", "var hoisting", "XMLHttpRequest"],
        answer: "let and const",
        explanation: "ES6 added block-scoped declarations like let/const and many more features.",
        difficulty: "medium",
        timeLimit: 30,
      },
      {
        text: "Which HTML element represents a section of navigation links?",
        options: ["nav", "section", "aside", "menu"],
        answer: "nav",
        explanation: "The <nav> element represents a section of navigation links.",
        difficulty: "easy",
        timeLimit: 30,
      },
      {
        text: "CSS property to change text color is?",
        options: ["color", "font-color", "text-color", "foreground"],
        answer: "color",
        explanation: "The CSS 'color' property sets the text color.",
        difficulty: "easy",
        timeLimit: 30,
      },
      {
        text: "The first widely used graphical web browser Mosaic was released in which year?",
        options: ["1991", "1993", "1995", "1998"],
        answer: "1993",
        explanation: "NCSA Mosaic was released in 1993 and helped popularize the web.",
        difficulty: "medium",
        timeLimit: 30,
      },
      {
        text: "Which database is a document-oriented NoSQL database?",
        options: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
        answer: "MongoDB",
        explanation: "MongoDB stores data as flexible JSON-like documents.",
        difficulty: "easy",
        timeLimit: 30,
      },
      {
        text: "Which method converts a JSON string into a JavaScript object?",
        options: ["JSON.parse", "JSON.stringify", "toJSON", "parseJSON"],
        answer: "JSON.parse",
        explanation: "JSON.parse converts a JSON string to a JS object.",
        difficulty: "easy",
        timeLimit: 30,
      },
    ];


    const payload = {
      title: "Tech Trivia Blitz",
      description: "Fast-paced event on tech trends, languages, and history.",
      category: "Technology",
      difficulty: "medium",
      startTime,
      endTime,
  totalQuestions: questions.length,
      randomizeQuestions: true,
      questions: questions.map(q => ({
        text: q.text,
        difficulty: q.difficulty,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        image: q.image,
        timeLimit: q.timeLimit || 30,
      })),
      scoring: { correct: 10, wrong: 0 },
    };

    const created = await GamingQuizEvent.create(payload);
    console.log("✅ Seeded GamingQuizEvent:", created._id.toString());
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();

const express = require('express');
const router = express.Router();
const MCQ = require('../models/MCQ');

// Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await MCQ.distinct('subject');
    res.json({ success: true, subjects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all courses for a subject
router.get('/courses', async (req, res) => {
  try {
    const { subject } = req.query;
    const courses = await MCQ.find(subject ? { subject } : {}).distinct('course');
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all syllabuses for a course
router.get('/syllabus', async (req, res) => {
  try {
    const { course } = req.query;
    const syllabus = await MCQ.find(course ? { course } : {}).distinct('syllabus');
    res.json({ success: true, syllabus });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all categories for a syllabus
router.get('/categories', async (req, res) => {
  try {
    const { syllabus } = req.query;
    const categories = await MCQ.find(syllabus ? { syllabus } : {}).distinct('category');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all topics for a category
router.get('/topics', async (req, res) => {
  try {
    const { category } = req.query;
    const topics = await MCQ.find(category ? { category } : {}).distinct('topic');
    res.json({ success: true, topics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Get MCQs by advanced filters
router.get('/', async (req, res) => {
  try {
    const { subject, course, syllabus, category, topic, tags, difficulty, isActive, q, limit = 50, skip = 0 } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (course) filter.course = course;
    if (syllabus) filter.syllabus = syllabus;
    if (category) filter.category = category;
    if (topic) filter.topic = topic;
    if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (difficulty) filter.difficulty = difficulty;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (q) filter['question.text'] = { $regex: q, $options: 'i' };
    const mcqs = await MCQ.find(filter).limit(Number(limit)).skip(Number(skip));
    res.json({ success: true, mcqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create a new MCQ
router.post('/', async (req, res) => {
  try {
    const mcq = new MCQ(req.body);
    await mcq.save();
    res.status(201).json({ success: true, mcq });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update an MCQ by ID
router.put('/:id', async (req, res) => {
  try {
    const mcq = await MCQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mcq) return res.status(404).json({ success: false, error: 'MCQ not found' });
    res.json({ success: true, mcq });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete an MCQ by ID
router.delete('/:id', async (req, res) => {
  try {
    const mcq = await MCQ.findByIdAndDelete(req.params.id);
    if (!mcq) return res.status(404).json({ success: false, error: 'MCQ not found' });
    res.json({ success: true, message: 'MCQ deleted' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;

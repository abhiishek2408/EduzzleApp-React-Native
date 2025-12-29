
import express from 'express';
import MCQ from '../models/MCQ.js';
const router = express.Router();

// Get all subjects

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await MCQ.distinct('course.name');
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all subjects for a course
router.get('/subjects', async (req, res) => {
  try {
    const { course } = req.query;
    if (!course) return res.json({ success: true, subjects: [] });
    const docs = await MCQ.find({ 'course.name': course }, { 'course.subjects': 1 });
    const subjectsSet = new Set();
    docs.forEach(doc => {
      doc.course.subjects.forEach(subj => subjectsSet.add(subj.name));
    });
    res.json({ success: true, subjects: Array.from(subjectsSet) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all syllabus for a subject in a course
router.get('/syllabus', async (req, res) => {
  try {
    const { course, subject } = req.query;
    if (!course || !subject) return res.json({ success: true, syllabus: [] });
    const docs = await MCQ.find({ 'course.name': course, 'course.subjects.name': subject }, { 'course.subjects.$': 1 });
    const syllabusSet = new Set();
    docs.forEach(doc => {
      doc.course.subjects.forEach(subj => {
        if (subj.name === subject) {
          subj.syllabus.forEach(syl => syllabusSet.add(syl.name));
        }
      });
    });
    res.json({ success: true, syllabus: Array.from(syllabusSet) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all categories for a syllabus in a subject in a course
router.get('/categories', async (req, res) => {
  try {
    const { course, subject, syllabus } = req.query;
    if (!course || !subject || !syllabus) return res.json({ success: true, categories: [] });
    const docs = await MCQ.find({ 'course.name': course, 'course.subjects.name': subject, 'course.subjects.syllabus.name': syllabus }, { 'course.subjects.$': 1 });
    const categoriesSet = new Set();
    docs.forEach(doc => {
      doc.course.subjects.forEach(subj => {
        if (subj.name === subject) {
          subj.syllabus.forEach(syl => {
            if (syl.name === syllabus) {
              syl.categories.forEach(cat => categoriesSet.add(cat.name));
            }
          });
        }
      });
    });
    res.json({ success: true, categories: Array.from(categoriesSet) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all topics for a category in a syllabus in a subject in a course
router.get('/topics', async (req, res) => {
  try {
    const { course, subject, syllabus, category } = req.query;
    if (!course || !subject || !syllabus || !category) return res.json({ success: true, topics: [] });
    const docs = await MCQ.find({ 'course.name': course, 'course.subjects.name': subject, 'course.subjects.syllabus.name': syllabus, 'course.subjects.syllabus.categories.name': category }, { 'course.subjects.$': 1 });
    const topicsSet = new Set();
    docs.forEach(doc => {
      doc.course.subjects.forEach(subj => {
        if (subj.name === subject) {
          subj.syllabus.forEach(syl => {
            if (syl.name === syllabus) {
              syl.categories.forEach(cat => {
                if (cat.name === category && Array.isArray(cat.topics)) {
                  cat.topics.forEach(topic => topicsSet.add(topic));
                }
              });
            }
          });
        }
      });
    });
    res.json({ success: true, topics: Array.from(topicsSet) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Get MCQs by advanced filters

// Get MCQs by advanced filters (nested)
router.get('/', async (req, res) => {
  try {
    const { course, subject, syllabus, category, topic, tags, difficulty, isActive, q, limit = 50, skip = 0 } = req.query;
    const filter = {};
    if (course) filter['course.name'] = course;
    if (subject) filter['course.subjects.name'] = subject;
    if (syllabus) filter['course.subjects.syllabus.name'] = syllabus;
    if (category) filter['course.subjects.syllabus.categories.name'] = category;
    if (topic) filter['course.subjects.syllabus.categories.topics'] = topic;
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

export default router;

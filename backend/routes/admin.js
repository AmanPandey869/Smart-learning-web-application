const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

// All admin routes require authentication + admin role


// ========== COURSE MANAGEMENT ==========

// @route   POST /api/admin/courses
// @desc    Create a new course
// @access  Admin
router.post('/courses', protect, admin, async (req, res) => {
  try {
    const { title, description, thumbnail, category, instructor, lessons } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category is required' });
    }
  

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail || '',
      category: category.trim(),
      instructor: instructor || req.user.name || "Admin",
      lessons: lessons || [],
      createdBy: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Create course error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/courses/:id
// @desc    Update a course
// @access  Admin
  router.put('/courses/:id', protect, admin, async (req, res) =>  {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Update course error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/courses/:id
// @desc    Delete a course
// @access  Admin
router.delete('/courses/:id', protect, admin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete associated quizzes
    await Quiz.deleteMany({ course: course._id });

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course and associated quizzes deleted' });
  } catch (error) {
    console.error('Delete course error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/courses
// @desc    Get all courses (admin view)
// @access  Admin

router.get('/courses', protect, admin, async (req, res) =>  {
  try {
    const courses = await Course.find().populate('quizzes').sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Admin get courses error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ========== QUIZ MANAGEMENT ==========

// @route   POST /api/admin/quizzes
// @desc    Create a new quiz
// @access  Admin
router.post('/quizzes', protect, admin, async (req, res) =>  {
  try {
    const { title, course, questions } = req.body;

    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const quiz = await Quiz.create({ title, course, questions });

    // Add quiz reference to course
    courseDoc.quizzes.push(quiz._id);
    await courseDoc.save();

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Create quiz error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/quizzes/:id
// @desc    Delete a quiz
// @access  Admin
router.delete('/quizzes/:id', protect, admin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Remove quiz reference from course
    await Course.findByIdAndUpdate(quiz.course, {
      $pull: { quizzes: quiz._id },
    });

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    console.error('Delete quiz error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

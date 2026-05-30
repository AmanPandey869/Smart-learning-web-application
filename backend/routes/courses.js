const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query)
      .select('-lessons.content')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (any authenticated user; admin recommended)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, thumbnail, instructor, lessons } = req.body;

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
      category: category.trim(),
      thumbnail: thumbnail || '',
      instructor: instructor || req.user.name || 'Admin',
      lessons: lessons || [],
      createdBy: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Create course error:', error.message);
    res.status(500).json({ message: 'Server error while creating course' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course with lessons
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('quizzes');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    const isEnrolled = req.user.enrolledCourses.includes(course._id);

    res.json({ ...course.toObject(), isEnrolled });
  } catch (error) {
    console.error('Get course error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already enrolled (check both sides for safety)
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(course._id);
    await user.save();

    // Add user to course's students array (prevents duplicate via $addToSet)
    await Course.findByIdAndUpdate(course._id, {
      $addToSet: { students: user._id },
    });

    // Create progress record
    await Progress.create({
      user: user._id,
      course: course._id,
      completedLessons: [],
      quizScores: [],
      percentage: 0,
    });

    res.json({
      message: 'Successfully enrolled',
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    console.error('Enroll error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

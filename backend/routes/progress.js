const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

// @route   GET /api/progress/dashboard
// @desc    Get progress for all enrolled courses (dashboard view)
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const progressList = await Progress.find({ user: req.user._id })
      .populate('course', 'title thumbnail category lessons instructor')
      .populate('quizScores.quiz', 'title');

    res.json(progressList);
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/:courseId
// @desc    Get progress for a specific course
// @access  Private
router.get('/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId,
    }).populate('quizScores.quiz', 'title');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found. Are you enrolled?' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/progress/complete-lesson
// @desc    Mark a lesson as complete
// @access  Private
router.post('/complete-lesson', protect, async (req, res) => {
  try {
    const { courseId, lessonIndex } = req.body;

    if (courseId === undefined || lessonIndex === undefined) {
      return res.status(400).json({ message: 'courseId and lessonIndex are required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let progress = await Progress.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!progress) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    // Add lesson to completed if not already there
    if (!progress.completedLessons.includes(lessonIndex)) {
      progress.completedLessons.push(lessonIndex);
    }

    // Recalculate percentage
    const totalLessons = course.lessons.length;
    const totalQuizzes = course.quizzes ? course.quizzes.length : 0;
    const totalItems = totalLessons + totalQuizzes;

    const completedLessonsCount = progress.completedLessons.length;
    const completedQuizzesCount = progress.quizScores.length;

    progress.percentage = totalItems > 0
      ? Math.round(((completedLessonsCount + completedQuizzesCount) / totalItems) * 100)
      : 0;

    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error('Complete lesson error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

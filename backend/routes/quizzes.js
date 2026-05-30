const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// @route   GET /api/quizzes/:courseId
// @desc    Get all quizzes for a course
// @access  Private
router.get('/:courseId', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quizzes/:quizId/submit
// @desc    Submit quiz answers and get score
// @access  Private
router.post('/:quizId/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected option indices

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    const total = quiz.questions.length;
    const results = [];

    quiz.questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) score++;
      results.push({
        question: question.question,
        selectedAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    });

    // Update progress with quiz score
    const progress = await Progress.findOne({
      user: req.user._id,
      course: quiz.course,
    });

    if (progress) {
      // Check if quiz was already attempted, update the score
      const existingAttempt = progress.quizScores.findIndex(
        (qs) => qs.quiz.toString() === quiz._id.toString()
      );

      if (existingAttempt >= 0) {
        progress.quizScores[existingAttempt].score = score;
        progress.quizScores[existingAttempt].total = total;
        progress.quizScores[existingAttempt].attemptedAt = new Date();
      } else {
        progress.quizScores.push({
          quiz: quiz._id,
          score,
          total,
          attemptedAt: new Date(),
        });
      }

      await progress.save();
    }

    res.json({
      score,
      total,
      percentage: Math.round((score / total) * 100),
      results,
    });
  } catch (error) {
    console.error('Submit quiz error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

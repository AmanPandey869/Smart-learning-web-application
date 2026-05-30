const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'note'],
    required: true,
  },
  content: {
    type: String, // URL for videos, markdown/text for notes
    required: true,
  },
  duration: {
    type: String, // e.g., "10:30" or "5 min read"
    default: '',
  },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  thumbnail: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    default: 'Admin',
  },
  lessons: [lessonSchema],
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  }],
  // Array of enrolled students (mirrors User.enrolledCourses for quick lookup)
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);

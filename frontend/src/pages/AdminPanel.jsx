import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import {
  HiPlus, HiTrash, HiBookOpen, HiLightningBolt,
  HiX, HiChevronDown, HiChevronUp
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminPanel = () => {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', thumbnail: '', category: 'Frontend', instructor: '',
    lessons: [{ title: '', type: 'video', content: '', duration: '' }],
  });

  // Quiz form state
  const [quizForm, setQuizForm] = useState({
    title: '', course: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
  });

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await adminAPI.getCourses();
      setCourses(data);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // ===== Course handlers =====
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCourse(courseForm);
      toast.success('Course created!');
      setShowCourseForm(false);
      setCourseForm({
        title: '', description: '', thumbnail: '', category: 'Frontend', instructor: '',
        lessons: [{ title: '', type: 'video', content: '', duration: '' }],
      });
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course and all its quizzes?')) return;
    try {
      await adminAPI.deleteCourse(id);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const addLesson = () => {
    setCourseForm({
      ...courseForm,
      lessons: [...courseForm.lessons, { title: '', type: 'video', content: '', duration: '' }],
    });
  };

  const removeLesson = (idx) => {
    setCourseForm({
      ...courseForm,
      lessons: courseForm.lessons.filter((_, i) => i !== idx),
    });
  };

  const updateLesson = (idx, field, value) => {
    const updated = [...courseForm.lessons];
    updated[idx][field] = value;
    setCourseForm({ ...courseForm, lessons: updated });
  };

  // ===== Quiz handlers =====
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createQuiz(quizForm);
      toast.success('Quiz created!');
      setShowQuizForm(false);
      setQuizForm({
        title: '', course: '',
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
      });
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create quiz');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await adminAPI.deleteQuiz(id);
      toast.success('Quiz deleted');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to delete quiz');
    }
  };

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }],
    });
  };

  const removeQuestion = (idx) => {
    setQuizForm({
      ...quizForm,
      questions: quizForm.questions.filter((_, i) => i !== idx),
    });
  };

  const updateQuestion = (idx, field, value) => {
    const updated = [...quizForm.questions];
    updated[idx][field] = value;
    setQuizForm({ ...quizForm, questions: updated });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const updated = [...quizForm.questions];
    updated[qIdx].options[oIdx] = value;
    setQuizForm({ ...quizForm, questions: updated });
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Admin <span className="gradient-text">Panel</span>
        </h1>
        <p className="text-gray-400 text-lg">Manage courses and quizzes</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 animate-slide-up">
        <button
  onClick={() => { 
    setShowCourseForm(!showCourseForm); 
    setShowQuizForm(false); 
  }}
  className="btn-primary flex items-center gap-2"
>
  <HiPlus className="w-5 h-5" />
  Add Course
</button>
        <button
          onClick={() => { setShowQuizForm(!showQuizForm); setShowCourseForm(false); }}
          className="btn-secondary flex items-center gap-2"
          id="add-quiz-btn"
        >
          <HiLightningBolt className="w-5 h-5" />
          Add Quiz
        </button>
      </div>

      {/* Course Form */}
      {showCourseForm && (
         
        <div className="glass-card mb-8 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Create New Course</h2>
              <div>

   

  </div>
            <button onClick={() => setShowCourseForm(false)} className="text-gray-400 hover:text-white">
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="input-field"
                  placeholder="Course title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  className="input-field"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                className="input-field min-h-[80px]"
                placeholder="Course description"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={courseForm.thumbnail}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Instructor</label>
                <input
                  type="text"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  className="input-field"
                  placeholder="Instructor name"
                />
              </div>
            </div>

            {/* Lessons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Lessons</label>
                <button type="button" onClick={addLesson} className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
                  <HiPlus className="w-4 h-4" /> Add Lesson
                </button>
              </div>
              {courseForm.lessons.map((lesson, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 mb-3 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Lesson {idx + 1}</span>
                    {courseForm.lessons.length > 1 && (
                      <button type="button" onClick={() => removeLesson(idx)} className="text-red-400 hover:text-red-300">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text" value={lesson.title}
                      onChange={(e) => updateLesson(idx, 'title', e.target.value)}
                      className="input-field text-sm" placeholder="Lesson title" required
                    />
                    <select
                      value={lesson.type}
                      onChange={(e) => updateLesson(idx, 'type', e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="video">Video</option>
                      <option value="note">Note</option>
                    </select>
                    <input
                      type="text" value={lesson.duration}
                      onChange={(e) => updateLesson(idx, 'duration', e.target.value)}
                      className="input-field text-sm" placeholder="Duration"
                    />
                  </div>
                  <textarea
                    value={lesson.content}
                    onChange={(e) => updateLesson(idx, 'content', e.target.value)}
                    className="input-field text-sm mt-3 min-h-[60px]"
                    placeholder={lesson.type === 'video' ? 'YouTube embed URL' : 'Markdown content'}
                    required
                  />
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary w-full">
  Add Course
</button>
          </form>
        </div>
      )}

      {/* Quiz Form */}
      {showQuizForm && (
        <div className="glass-card mb-8 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Create New Quiz</h2>
            <button onClick={() => setShowQuizForm(false)} className="text-gray-400 hover:text-white">
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateQuiz} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Quiz Title</label>
                <input
                  type="text" value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  className="input-field" placeholder="Quiz title" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Course</label>
                <select
                  value={quizForm.course}
                  onChange={(e) => setQuizForm({ ...quizForm, course: e.target.value })}
                  className="input-field" required
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Questions</label>
                <button type="button" onClick={addQuestion} className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
                  <HiPlus className="w-4 h-4" /> Add Question
                </button>
              </div>
              {quizForm.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-white/5 rounded-xl p-4 mb-3 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400">Question {qIdx + 1}</span>
                    {quizForm.questions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(qIdx)} className="text-red-400 hover:text-red-300">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text" value={q.question}
                    onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                    className="input-field text-sm mb-3" placeholder="Question text" required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio" name={`correct-${qIdx}`}
                          checked={q.correctAnswer === oIdx}
                          onChange={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                          className="accent-brand-500"
                        />
                        <input
                          type="text" value={opt}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          className="input-field text-sm flex-1" placeholder={`Option ${oIdx + 1}`} required
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Select the radio button next to the correct answer</p>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary w-full">Create Quiz</button>
          </form>
        </div>
      )}

      {/* Course List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">All Courses ({courses.length})</h2>
        {courses.length === 0 ? (
          <div className="glass-card text-center py-12">
            <HiBookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No courses created yet</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="glass-card !p-0 overflow-hidden">
              <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)}
              >
                <div className="flex items-center gap-4">
                  {course.thumbnail && (
                    <img src={course.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{course.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>{course.category}</span>
                      <span>{course.lessons?.length || 0} lessons</span>
                      <span>{course.quizzes?.length || 0} quizzes</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course._id); }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                  {expandedCourse === course._id ? (
                    <HiChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <HiChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedCourse === course._id && (
                <div className="border-t border-white/10 p-5 animate-slide-down">
                  <p className="text-sm text-gray-400 mb-3">{course.description}</p>

                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Lessons:</h4>
                  <div className="space-y-1 mb-4">
                    {course.lessons?.map((lesson, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-5 h-5 bg-white/5 rounded flex items-center justify-center text-xs">{idx + 1}</span>
                        <span>{lesson.title}</span>
                        <span className="badge-primary text-[10px] !py-0">{lesson.type}</span>
                      </div>
                    ))}
                  </div>

                  {course.quizzes?.length > 0 && (
                    <>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Quizzes:</h4>
                      <div className="space-y-1">
                        {course.quizzes.map((quiz) => (
                          <div key={quiz._id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              <HiLightningBolt className="w-4 h-4 text-amber-400" />
                              {quiz.title} ({quiz.questions?.length || 0} questions)
                            </div>
                            <button
                              onClick={() => handleDeleteQuiz(quiz._id)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <HiTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

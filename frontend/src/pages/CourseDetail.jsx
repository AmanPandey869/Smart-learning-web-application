import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
 import { quizzesAPI } from "../services/api";
import { coursesAPI, progressAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import Markdown from 'react-markdown';
import {
  HiPlay, HiDocumentText, HiCheck, HiChevronLeft,
  HiLightningBolt, HiClock, HiAcademicCap, HiLockClosed
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);  
  const [loading, setLoading] = useState(true); 
  const [enrolling, setEnrolling] = useState(false);  

  useEffect(() => {
    fetchCourse();
  }, [id]);



// state

// useEffect
useEffect(() => {
  const fetchQuiz = async () => {
    try {
      const { data } = await quizzesAPI.getByCourse(id);

      if (Array.isArray(data) && data.length > 0) {
        setQuiz(data[0]); // first quiz
      } else {
        setQuiz(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchQuiz();
}, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await coursesAPI.getOne(id);
      setCourse(data);

      if (data.isEnrolled) {
        try {
          const { data: prog } = await progressAPI.getByCourse(id);
          setProgress(prog);
        } catch (e) {
          // Progress not found is ok
        }
      }
    } catch (err) {
      toast.error('Failed to load course');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await coursesAPI.enroll(id);
      toast.success('Enrolled successfully!');
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteLesson = async (lessonIdx) => {
    try {
      const { data } = await progressAPI.completeLesson(id, lessonIdx);
      setProgress(data);
      toast.success('Lesson marked as complete!');
    } catch (err) {
      toast.error('Failed to mark lesson complete');
    }
  };

  const isLessonComplete = (idx) => progress?.completedLessons?.includes(idx);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const currentLesson = course.lessons[activeLesson];

  return (
    <div className="page-container animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <HiChevronLeft className="w-5 h-5" />
        Back
      </button>

      {/* Course Header */}
      <div className="glass-card mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Thumbnail */}
          <div className="lg:w-80 flex-shrink-0">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 lg:h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-48 lg:h-full bg-gradient-to-br from-brand-600 to-purple-600 rounded-xl flex items-center justify-center">
                <HiAcademicCap className="w-16 h-16 text-white/30" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-primary">{course.category}</span>
              {course.isEnrolled && <span className="badge-success">Enrolled</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{course.title}</h1>
            <p className="text-gray-400 mb-4 leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              {/* 🔥 Start Quiz Button */}
{quiz && (
  <button
    onClick={() => navigate(`/courses/${id}/quiz/${quiz._id}`)}
    className="mt-4 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
  >
    🚀 Start Quiz
  </button>
)}
              <span className="flex items-center gap-1.5">
                <HiPlay className="w-4 h-4 text-brand-400" />
                {course.lessons?.filter((l) => l.type === 'video').length} videos
              </span>
              <span className="flex items-center gap-1.5">
                <HiDocumentText className="w-4 h-4 text-purple-400" />
                {course.lessons?.filter((l) => l.type === 'note').length} notes
              </span>
              <span className="flex items-center gap-1.5">
                <HiLightningBolt className="w-4 h-4 text-amber-400" />
                {course.quizzes?.length || 0} quiz{(course.quizzes?.length || 0) !== 1 ? 'zes' : ''}
              </span>
              {course.instructor && (
                <span className="flex items-center gap-1.5">
                  <HiAcademicCap className="w-4 h-4 text-emerald-400" />
                  {course.instructor}
                </span>
              )}
            </div>

            {course.isEnrolled && progress && (
              <ProgressBar percentage={progress.percentage} size="md" className="mb-4" />
            )}

            {!course.isEnrolled && (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="btn-primary flex items-center gap-2"
                id="enroll-btn"
              >
                {enrolling ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <HiAcademicCap className="w-5 h-5" />
                    Enroll Now — Free
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {course.isEnrolled ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lesson Content */}
          <div className="lg:col-span-2">
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">{currentLesson?.title}</h2>
                <div className="flex items-center gap-2">
                  {currentLesson?.duration && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <HiClock className="w-3.5 h-3.5" />
                      {currentLesson.duration}
                    </span>
                  )}
                  {currentLesson?.type === 'video' ? (
                    <span className="badge-primary">
                      <HiPlay className="w-3 h-3 mr-1" /> Video
                    </span>
                  ) : (
                    <span className="badge bg-purple-500/20 text-purple-300">
                      <HiDocumentText className="w-3 h-3 mr-1" /> Note
                    </span>
                  )}
                </div>
              </div>

              {/* Lesson content */}
              {currentLesson?.type === 'video' ? (
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                  <iframe
                    src={currentLesson.content}
                    className="w-full h-full"
                    title={currentLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="markdown-content bg-gray-900/50 rounded-xl p-6 mb-4 max-h-[60vh] overflow-y-auto">
                  <Markdown>{currentLesson?.content || ''}</Markdown>
                </div>
              )}

              {/* Mark complete button */}
              {!isLessonComplete(activeLesson) ? (
                <button
                  onClick={() => handleCompleteLesson(activeLesson)}
                  className="btn-primary flex items-center gap-2"
                >
                  <HiCheck className="w-5 h-5" />
                  Mark as Complete
                </button>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <HiCheck className="w-5 h-5" />
                  Lesson completed
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Lesson List */}
          <div>
            <div className="glass-card !p-0">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Course Content</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {progress?.completedLessons?.length || 0}/{course.lessons.length} completed
                </p>
              </div>

              <div className="divide-y divide-white/5">
                {course.lessons.map((lesson, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveLesson(idx)}
                    className={`w-full text-left p-4 flex items-center gap-3 transition-all hover:bg-white/5 ${
                      idx === activeLesson ? 'bg-brand-500/10 border-l-2 border-brand-500' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isLessonComplete(idx)
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : idx === activeLesson
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'bg-white/5 text-gray-500'
                    }`}>
                      {isLessonComplete(idx) ? (
                        <HiCheck className="w-4 h-4" />
                      ) : lesson.type === 'video' ? (
                        <HiPlay className="w-4 h-4" />
                      ) : (
                        <HiDocumentText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        idx === activeLesson ? 'text-brand-300' : 'text-gray-300'
                      }`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-600">{lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quizzes */}
              {course.quizzes?.length > 0 && (
                <>
                  <div className="p-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <HiLightningBolt className="w-4 h-4 text-amber-400" />
                      Quizzes
                    </h4>
                  </div>
                  <div className="divide-y divide-white/5">
                    {course.quizzes.map((quiz) => (
                      <Link
                        key={quiz._id}
                        to={`/courses/${id}/quiz/${quiz._id}`}
                        className="w-full text-left p-4 flex items-center gap-3 transition-all hover:bg-white/5 block"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                          <HiLightningBolt className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-300 truncate">{quiz.title}</p>
                          <p className="text-xs text-gray-600">{quiz.questions?.length || 0} questions</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Locked lesson preview */
        <div className="glass-card text-center py-12">
          <HiLockClosed className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Enroll to Access Content</h3>
          <p className="text-gray-500 mb-6">
            Enroll in this course to access all {course.lessons?.length} lessons and quizzes.
          </p>
          <button onClick={handleEnroll} disabled={enrolling} className="btn-primary">
            Enroll Now
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;

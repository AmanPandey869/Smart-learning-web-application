import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import { HiBookOpen, HiAcademicCap, HiChartBar, HiLightningBolt, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await progressAPI.getDashboard();
      setProgressData(data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const totalCourses = progressData.length;
  const avgProgress = totalCourses > 0
    ? Math.round(progressData.reduce((sum, p) => sum + (p.percentage || 0), 0) / totalCourses)
    : 0;
  const completedCourses = progressData.filter((p) => p.percentage === 100).length;
  const totalQuizzes = progressData.reduce((sum, p) => sum + (p.quizScores?.length || 0), 0);

  const stats = [
    { label: 'Enrolled Courses', value: totalCourses, icon: HiBookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Avg Progress', value: `${avgProgress}%`, icon: HiChartBar, color: 'from-brand-500 to-purple-500' },
    { label: 'Completed', value: completedCourses, icon: HiAcademicCap, color: 'from-emerald-500 to-teal-500' },
    { label: 'Quizzes Taken', value: totalQuizzes, icon: HiLightningBolt, color: 'from-orange-500 to-amber-500' },
  ];

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-gray-400 text-lg">Here's your learning overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card animate-slide-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      {totalCourses > 0 && (
        <div className="glass-card mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-lg font-semibold text-white mb-4">Overall Learning Progress</h2>
          <ProgressBar percentage={avgProgress} size="lg" />
        </div>
      )}

      {/* Enrolled Courses */}
      <div className="mb-8 animate-slide-up" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">My Courses</h2>
          <Link
            to="/courses"
            className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Browse All <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {totalCourses === 0 ? (
          <div className="glass-card text-center py-12">
            <HiBookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">Start your learning journey by enrolling in a course.</p>
            <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
              Browse Courses <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {progressData.map((progress) => (
              <CourseCard
                key={progress._id}
                course={progress.course}
                progress={progress.percentage}
                enrolled={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Quiz Scores */}
      {totalQuizzes > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          <h2 className="text-xl font-bold text-white mb-5">Recent Quiz Scores</h2>
          <div className="glass-card overflow-hidden !p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider p-4">Quiz</th>
                  <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider p-4">Course</th>
                  <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider p-4">Score</th>
                  <th className="text-left text-xs text-gray-400 font-medium uppercase tracking-wider p-4 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {progressData
                  .flatMap((p) =>
                    p.quizScores.map((qs) => ({
                      ...qs,
                      courseName: p.course?.title || 'Unknown',
                    }))
                  )
                  .sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt))
                  .slice(0, 5)
                  .map((qs, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm text-gray-200">{qs.quiz?.title || 'Quiz'}</td>
                      <td className="p-4 text-sm text-gray-400">{qs.courseName}</td>
                      <td className="p-4">
                        <span className={`badge ${qs.score / qs.total >= 0.7 ? 'badge-success' : 'badge-warning'}`}>
                          {qs.score}/{qs.total}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(qs.attemptedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

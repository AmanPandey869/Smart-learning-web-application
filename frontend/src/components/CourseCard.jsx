import { Link } from 'react-router-dom';
import { HiPlay, HiDocumentText, HiClock } from 'react-icons/hi';

const CourseCard = ({ course, progress, enrolled = false }) => {
  const totalLessons = course.lessons?.length || 0;
  const videoCount = course.lessons?.filter((l) => l.type === 'video').length || 0;
  const noteCount = course.lessons?.filter((l) => l.type === 'note').length || 0;

  const categoryColors = {
    Frontend: 'from-blue-500 to-cyan-500',
    Backend: 'from-emerald-500 to-teal-500',
    Database: 'from-orange-500 to-amber-500',
    DevOps: 'from-red-500 to-pink-500',
    Mobile: 'from-purple-500 to-violet-500',
  };

  const gradientClass = categoryColors[course.category] || 'from-brand-500 to-purple-500';

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group glass-card block overflow-hidden !p-0"
      id={`course-card-${course._id}`}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <HiPlay className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`badge bg-gradient-to-r ${gradientClass} text-white text-xs font-semibold shadow-lg`}>
            {course.category}
          </span>
        </div>
        {enrolled && progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div
              className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-700`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            {videoCount > 0 && (
              <span className="flex items-center gap-1">
                <HiPlay className="w-3.5 h-3.5 text-brand-400" />
                {videoCount} video{videoCount > 1 ? 's' : ''}
              </span>
            )}
            {noteCount > 0 && (
              <span className="flex items-center gap-1">
                <HiDocumentText className="w-3.5 h-3.5 text-purple-400" />
                {noteCount} note{noteCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1">
            <HiClock className="w-3.5 h-3.5" />
            {totalLessons} lesson{totalLessons > 1 ? 's' : ''}
          </span>
        </div>

        {course.instructor && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
              {course.instructor.charAt(0)}
            </div>
            <span className="text-xs text-gray-400">{course.instructor}</span>
          </div>
        )}

        {enrolled && progress !== undefined && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">Progress</span>
            <span className={`text-xs font-semibold ${progress === 100 ? 'text-emerald-400' : 'text-brand-400'}`}>
              {progress}%
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;

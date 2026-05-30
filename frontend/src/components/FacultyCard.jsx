import { Link } from 'react-router-dom';
import { HiAcademicCap, HiStar, HiUsers, HiBookOpen, HiArrowRight } from 'react-icons/hi';

const FacultyCard = ({ faculty, index }) => {
  const initials = faculty.name
    .split(' ')
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n.charAt(0))
    .join('');

  // Gradient pairs for the avatar backgrounds
  const gradients = [
    'from-brand-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-indigo-600',
    'from-fuchsia-500 to-pink-600',
    'from-lime-500 to-green-600',
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <Link
      to={`/faculty/${faculty.id}`}
      id={`faculty-card-${faculty.id}`}
      className="group glass-card flex flex-col h-full cursor-pointer relative overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-purple-500/0 group-hover:from-brand-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-2xl" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top section — Avatar + Quick stats */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-brand-300 transition-colors duration-300">
              {faculty.name}
            </h3>
            <p className="text-sm text-brand-400 font-medium truncate">{faculty.subject}</p>
            <div className="flex items-center gap-1 mt-1">
              <HiStar className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">{faculty.rating}</span>
              <span className="text-xs text-gray-500 ml-1">rating</span>
            </div>
          </div>
        </div>

        {/* Qualification badge */}
        <div className="flex items-center gap-2 mb-3">
          <HiAcademicCap className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-xs text-gray-400 truncate">{faculty.qualification}</span>
        </div>

        {/* Bio preview */}
        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3 flex-1">
          {faculty.bio}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/5 rounded-xl p-2.5 text-center">
            <p className="text-sm font-bold text-white">{faculty.experience}+</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Years</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1">
              <HiUsers className="w-3 h-3 text-gray-400" />
              <p className="text-sm font-bold text-white">{(faculty.totalStudents / 1000).toFixed(1)}K</p>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Students</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1">
              <HiBookOpen className="w-3 h-3 text-gray-400" />
              <p className="text-sm font-bold text-white">{faculty.coursesCount}</p>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Courses</p>
          </div>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {faculty.specializations.slice(0, 3).map((spec) => (
            <span key={spec} className="badge-primary !text-[10px] !px-2 !py-0.5">
              {spec}
            </span>
          ))}
          {faculty.specializations.length > 3 && (
            <span className="badge bg-white/10 text-gray-400 !text-[10px] !px-2 !py-0.5">
              +{faculty.specializations.length - 3}
            </span>
          )}
        </div>

        {/* View profile CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
          <span className="text-xs text-gray-500">View full profile</span>
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:translate-x-1 transition-all duration-300">
            <HiArrowRight className="w-4 h-4 text-brand-400" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FacultyCard;

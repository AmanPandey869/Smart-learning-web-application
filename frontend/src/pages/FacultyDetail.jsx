import { useParams, Link } from 'react-router-dom';
import {
  HiArrowLeft,
  HiAcademicCap,
  HiStar,
  HiUsers,
  HiBookOpen,
  HiMail,
  HiClock,
  HiBadgeCheck,
  HiLightningBolt,
  HiChevronRight,
} from 'react-icons/hi';
import facultyData from '../data/facultyData';

const FacultyDetail = () => {
  const { id } = useParams();
  const faculty = facultyData.find((f) => f.id === id);

  if (!faculty) {
    return (
      <div className="page-container animate-fade-in text-center py-32">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <HiAcademicCap className="w-10 h-10 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-200 mb-3">Faculty Not Found</h2>
        <p className="text-gray-500 mb-6">The faculty member you're looking for doesn't exist.</p>
        <Link to="/faculty" className="btn-primary !py-2.5 !px-6 text-sm inline-flex items-center gap-2">
          <HiArrowLeft className="w-4 h-4" />
          Back to Faculty
        </Link>
      </div>
    );
  }

  const initials = faculty.name
    .split(' ')
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n.charAt(0))
    .join('');

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
  const gradient = gradients[(parseInt(id) - 1) % gradients.length];

  return (
    <div className="page-container animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" id="faculty-detail-breadcrumb">
        <Link to="/faculty" className="hover:text-brand-400 transition-colors">Faculty</Link>
        <HiChevronRight className="w-4 h-4" />
        <span className="text-gray-300 truncate">{faculty.name}</span>
      </nav>

      {/* Hero section */}
      <div className="glass rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
        {/* Background decorative gradient */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-3xl`} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-brand-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-2xl shrink-0`}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1" id="faculty-detail-name">
              {faculty.name}
            </h1>
            <p className="text-brand-400 font-medium text-lg mb-3">{faculty.subject}</p>

            {/* Qualification */}
            <div className="flex items-center gap-2 mb-4">
              <HiAcademicCap className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-sm text-gray-300">{faculty.qualification}</span>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1.5">
                <HiStar className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">{faculty.rating}</span>
                <span className="text-xs text-amber-400/60">rating</span>
              </div>
              <div className="flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full px-3 py-1.5">
                <HiUsers className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-semibold text-brand-300">{faculty.totalStudents.toLocaleString()}</span>
                <span className="text-xs text-brand-400/60">students</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
                <HiBookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">{faculty.coursesCount}</span>
                <span className="text-xs text-emerald-400/60">courses</span>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1.5">
                <HiLightningBolt className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">{faculty.experience}+</span>
                <span className="text-xs text-purple-400/60">years</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Bio & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-brand-500 to-purple-500 rounded-full" />
              About
            </h2>
            <p className="text-gray-300 leading-relaxed">{faculty.bio}</p>
          </div>

          {/* Achievements */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
              Achievements & Recognition
            </h2>
            <div className="space-y-3">
              {faculty.achievements.map((achievement, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-colors duration-200"
                >
                  <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <HiBadgeCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-gray-300 text-sm leading-relaxed">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
              Specializations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {faculty.specializations.map((spec) => (
                <div
                  key={spec}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-200"
                >
                  <div className="w-2 h-2 bg-brand-400 rounded-full shrink-0" />
                  <span className="text-sm text-gray-300">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Contact & Office hours */}
        <div className="space-y-6">
          {/* Contact card */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
              Contact
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <HiMail className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-sm text-gray-300 break-all">{faculty.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <HiClock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Office Hours</p>
                  <p className="text-sm text-gray-300">{faculty.officeHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience highlight */}
          <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white relative overflow-hidden`}>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <p className="text-4xl font-black mb-1">{faculty.experience}+</p>
              <p className="text-sm opacity-80 font-medium">Years of Experience</p>
              <div className="mt-4 h-px bg-white/20" />
              <p className="text-xs opacity-60 mt-3 leading-relaxed">
                Bringing industry expertise and academic rigor to every lecture and lab session.
              </p>
            </div>
          </div>

          {/* Back to Faculty button */}
          <Link
            to="/faculty"
            className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
            id="back-to-faculty-btn"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to All Faculty
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetail;

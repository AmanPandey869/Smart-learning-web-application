import { useState } from 'react';
import { HiSearch, HiAcademicCap, HiUsers } from 'react-icons/hi';
import FacultyCard from '../components/FacultyCard';
import facultyData from '../data/facultyData';

const FacultyList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaculty = facultyData.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalStudents = facultyData.reduce((sum, f) => sum + f.totalStudents, 0);

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <HiAcademicCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text" id="faculty-page-title">
            Our Faculty
          </h1>
        </div>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Learn from industry veterans and academic experts who bring years of real-world experience to the classroom.
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap items-center gap-4 mt-5">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <HiAcademicCap className="w-4 h-4 text-brand-400" />
            <span className="text-sm text-gray-300">
              <span className="font-semibold text-white">{facultyData.length}</span> Expert Faculty
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <HiUsers className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-300">
              <span className="font-semibold text-white">{(totalStudents / 1000).toFixed(1)}K+</span> Students Taught
            </span>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md mb-8">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, subject, or specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field !pl-12"
          id="faculty-search-input"
        />
      </div>

      {/* Faculty grid */}
      {filteredFaculty.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFaculty.map((faculty, index) => (
            <FacultyCard key={faculty.id} faculty={faculty} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiSearch className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No faculty found</h3>
          <p className="text-gray-500 text-sm">
            Try adjusting your search query or browse all faculty members.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="btn-secondary !py-2 !px-5 text-sm mt-4"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default FacultyList;

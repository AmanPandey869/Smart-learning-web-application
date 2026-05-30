import { useState, useEffect } from 'react';
import { coursesAPI } from '../services/api';
import CourseCard from '../components/CourseCard';
import { HiSearch, HiFilter, HiBookOpen } from 'react-icons/hi';
import toast from 'react-hot-toast';

const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Mobile'];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await coursesAPI.getAll(params);
      setCourses(data);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Explore <span className="gradient-text">Courses</span>
        </h1>
        <p className="text-gray-400 text-lg">Discover courses to boost your skills</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12 pr-4"
            placeholder="Search courses..."
            id="search-courses"
          />
        </form>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <HiFilter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                category === cat
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'glass text-gray-400 hover:text-gray-200 hover:bg-white/10'
              }`}
              id={`filter-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-card text-center py-16 animate-fade-in">
          <HiBookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No courses found</h3>
          <p className="text-gray-500">
            {search
              ? `No results for "${search}". Try a different search term.`
              : 'No courses available in this category yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <div key={course._id} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      {!loading && courses.length > 0 && (
        <p className="text-center text-gray-500 text-sm mt-8">
          Showing {courses.length} course{courses.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default Courses;

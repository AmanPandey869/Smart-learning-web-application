import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import QuizPage from './pages/QuizPage';
import AdminPanel from './pages/AdminPanel';
import FacultyList from './pages/FacultyList';
import FacultyDetail from './pages/FacultyDetail';
import Contact from "./pages/Contact";
import About from "./pages/About";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/courses" element={
          <ProtectedRoute><Courses /></ProtectedRoute>
        } />

        <Route path="/courses/:id" element={
          <ProtectedRoute><CourseDetail /></ProtectedRoute>
        } />
        <Route path="/courses/:id/quiz/:quizId" element={
          <ProtectedRoute><QuizPage /></ProtectedRoute>
        } />
        <Route path="/faculty" element={
          <ProtectedRoute><FacultyList /></ProtectedRoute>
        } />
        <Route path="/faculty/:id" element={
          <ProtectedRoute><FacultyDetail /></ProtectedRoute>
        } />
        <Route path="/contact" element={<Contact />} />

        <Route path="/about" element={<About />} />
      


        {/* Admin route */}
       <Route path="/admin" element={
  <ProtectedRoute><AdminPanel /></ProtectedRoute>
} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
    </div>
  );
};

export default App;

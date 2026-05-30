import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login/signup
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========== Auth API ==========
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// ========== Courses API ==========
export const coursesAPI = {
  getAll: (params) => API.get('/courses', { params }),
  getOne: (id) => API.get(`/courses/${id}`),
  enroll: (id) => API.post(`/courses/${id}/enroll`),
  create: (data) => API.post('/courses', data),
};

// ========== Quizzes API ==========
export const quizzesAPI = {
  getByCourse: (courseId) => API.get(`/quizzes/${courseId}`),
  submit: (quizId, answers) => API.post(`/quizzes/${quizId}/submit`, { answers }),
};

// ========== Progress API ==========
export const progressAPI = {
  getDashboard: () => API.get('/progress/dashboard'),
  getByCourse: (courseId) => API.get(`/progress/${courseId}`),
  completeLesson: (courseId, lessonIndex) =>
    API.post('/progress/complete-lesson', { courseId, lessonIndex }),
};

// ========== Admin API ==========
export const adminAPI = {
  getCourses: () => API.get('/admin/courses'),
  createCourse: (data) => API.post('/admin/courses', data),
  updateCourse: (id, data) => API.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => API.delete(`/admin/courses/${id}`),
  createQuiz: (data) => API.post('/admin/quizzes', data),
  deleteQuiz: (id) => API.delete(`/admin/quizzes/${id}`),
};

export default API;

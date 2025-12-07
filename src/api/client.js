import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <--- Add this line if cookies are needed
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create a navigation callback that can be set from your app
let navigationCallback = null;

export const setNavigationCallback = (callback) => {
  navigationCallback = callback;
};

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRequest = error.config?.url?.includes('/api/auth/');
      const hasToken = localStorage.getItem('token');
      
      // Don't redirect on auth requests (login, register, etc.)
      if (isAuthRequest) {
        console.log('Authentication request failed - letting component handle it');
        return Promise.reject(error);
      }
      
      // Only redirect if user had a token (meaning they were logged in)
      if (hasToken) {
        console.log('Authenticated request failed - token expired');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Use React Router navigation if available, otherwise fall back to window.location
        if (navigationCallback) {
          navigationCallback('/login');
        } else {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (userData) => apiClient.post('/api/auth/register', userData),
  logout: () => apiClient.post('/api/auth/logout'),
  forgotPassword: (email) => apiClient.post(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`),
  verifyOTP: (email, otp) => apiClient.post(`/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`),
  resetPassword: (data) => apiClient.post('/api/auth/reset-password', data),
};

// User API
export const userAPI = {
  getCurrentUser: () => apiClient.get('/api/users/me'),
  updateUser: (data) => apiClient.put('/api/users/me', data),
  changePassword: (data) => apiClient.put('/api/users/change-password', data),
  getAllUsers: () => apiClient.get('/api/users/all'),
  deleteUser: (id) => apiClient.delete(`/api/users/${id}`),
};

// Course API
export const courseAPI = {
  // Get all courses (basic details)
  getAllCourses: () => apiClient.get('/api/courses/all'),
  
  // Get course by ID (role-based response)
  getCourseById: (id) => apiClient.get(`/api/courses/${id}`),
  
  // Get instructor's courses
  getInstructorCourses: () => apiClient.get('/api/courses/instructor'),
  
  // Create a new course
  createCourse: (data) => apiClient.post('/api/courses/create', data),
  
  // Update course details (Instructor only)
  updateCourse: (id, data) => apiClient.put(`/api/courses/${id}`, data),
  
  // Delete a course (Instructor or Admin)
  deleteCourse: (id) => apiClient.delete(`/api/courses/${id}`),
  
  // Get students enrolled in a course (Instructor only)
  getEnrolledStudents: (id) => apiClient.get(`/api/courses/${id}/students`),
  
  // Get enrolled students count (Instructor only)
  getEnrolledStudentsCount: (id) => apiClient.get(`/api/courses/${id}/students-count`),
  
  // Get course content for enrolled students
  getCourseContent: (id) => apiClient.get(`/api/courses/${id}/course-content`),
  
  // Search courses
  searchCourses: (query) => apiClient.get(`/api/courses/search?query=${encodeURIComponent(query)}`),
  
  // Get popular courses
  getPopularCourses: (limit = 5) => apiClient.get(`/api/courses/popular?limit=${limit}`),
};

// Enrollment API
export const enrollmentAPI = {
  // Enroll in a course
  enroll: (courseId) => apiClient.post(`/api/enrollments/enroll/${courseId}`),
  
  // Get current student's enrollments
  getMyEnrollments: () => apiClient.get('/api/enrollments'),
  
  // Get courses enrolled by current student
  getMyCourses: () => apiClient.get('/api/enrollments/courses'),
  
  // Check enrollment status
  isEnrolled: (courseId) => apiClient.get(`/api/enrollments/${courseId}/is-enrolled`),
  
  // Mark course as completed
  markCourseCompleted: (courseId) => apiClient.put(`/api/enrollments/completed/${courseId}`),
  
  // Get all enrollments (Admin only)
  getAllEnrollments: () => apiClient.get('/api/enrollments/all'),
};

// Feedback API
export const feedbackAPI = {
  // Submit feedback for a course
  submitFeedback: (courseId, feedbackData) => apiClient.post(`/api/courses/feedbacks/course/${courseId}`, feedbackData),
  
  // Get all feedbacks of a course
  getCourseFeedbacks: (courseId) => apiClient.get(`/api/courses/feedbacks/course/${courseId}`),
  
  // Get feedback by ID
  getFeedbackById: (id) => apiClient.get(`/api/courses/feedbacks/${id}`),
};

// Payment API
export const paymentAPI = {
  // Create payment order
  createOrder: (paymentData) => apiClient.post('/api/payment/create-order', paymentData),
  
  // Verify and save payment
  verifyPayment: (verificationData) => apiClient.post('/api/payment/verify', verificationData),
  
  // Get user's payments
  getUserPayments: () => apiClient.get('/api/payment/my'),
};

// Secure Content API
export const secureContentAPI = {
  // Stream video content
  streamVideo: (videoId) => apiClient.get(`/api/secure/content/video/${videoId}`, {
    responseType: 'blob' // For binary data
  }),
  
  // Stream document content
  streamDocument: (documentId) => apiClient.get(`/api/secure/content/document/${documentId}`, {
    responseType: 'blob' // For binary data
  }),
};

// Utility functions for common API patterns
export const apiUtils = {
  // Helper for handling file downloads
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
  
  // Helper for creating video/document URLs
  createMediaUrl: (type, id) => {
    return type === 'video' 
      ? `${API_BASE_URL}/api/secure/content/video/${id}`
      : `${API_BASE_URL}/api/secure/content/document/${id}`;
  },
  
  // Helper for handling API errors
  handleApiError: (error, defaultMessage = 'An error occurred') => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.status === 401) {
      return 'You are not authorized to perform this action';
    }
    if (error.response?.status === 403) {
      return 'Access forbidden';
    }
    if (error.response?.status === 404) {
      return 'Resource not found';
    }
    if (error.response?.status >= 500) {
      return 'Server error. Please try again later';
    }
    return error.message || defaultMessage;
  }
};

// Export all APIs as a single object for convenience
export const api = {
  auth: authAPI,
  user: userAPI,
  course: courseAPI,
  enrollment: enrollmentAPI,
  feedback: feedbackAPI,
  payment: paymentAPI,
  secureContent: secureContentAPI,
  utils: apiUtils,
};

export default apiClient;
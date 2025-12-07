import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import BrowseCourses from './pages/BrowseCourses';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import VerifyOTP from './pages/Auth/VerifyOTP';
import ResetPassword from './pages/Auth/ResetPassword';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import MyCourses from './pages/Student/MyCourses';

// Instructor Pages
import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import InstructorCourses from './pages/Instructor/InstructorCourses';
import CreateCourse from './pages/Instructor/CreateCourse';
import EditCourse from './pages/Instructor/EditCourse';
import CourseStudents from './pages/Instructor/CourseStudents';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageCourses from './pages/Admin/ManageCourses';
import ManageEnrollments from './pages/Admin/ManageEnrollments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<BrowseCourses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes - All Authenticated Users */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/courses" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <MyCourses />
              </ProtectedRoute>
            } />

            {/* Instructor Routes */}
            <Route path="/instructor/dashboard" element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses" element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <InstructorCourses />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/create" element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <CreateCourse />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/:id/edit" element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <EditCourse />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/:id/students" element={
              <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                <CourseStudents />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManageCourses />
              </ProtectedRoute>
            } />
            <Route path="/admin/enrollments" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManageEnrollments />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
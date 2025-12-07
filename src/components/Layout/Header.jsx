import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../api/client';
import { toast } from 'react-toastify';
import { 
  BookOpen, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  Users,
  GraduationCap,
  Shield,
  Layout
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout().catch(() => {});
      toast.success('Logged out successfully');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      logout(); // Force logout even if API call fails
      navigate('/');
    }
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'STUDENT':
        return '/student/dashboard';
      case 'INSTRUCTOR':
        return '/instructor/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'STUDENT':
        return <GraduationCap className="h-4 w-4" />;
      case 'INSTRUCTOR':
        return <BookOpen className="h-4 w-4" />;
      case 'ADMIN':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Handle logo click based on user role
  const handleLogoClick = (e) => {
    // If user is logged in as instructor or admin, prevent navigation to home
    if (user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN')) {
      e.preventDefault();
      return;
    }
  };

  // Get navigation label based on role
  const getNavigationLabel = () => {
    if (!user) return 'Browse Courses';
    
    switch (user.role) {
      case 'INSTRUCTOR':
        return 'My Courses';
      case 'ADMIN':
        return 'Manage Platform';
      case 'STUDENT':
        return 'Browse Courses';
      default:
        return 'Browse Courses';
    }
  };

  // Get navigation link based on role
  const getNavigationLink = () => {
    if (!user) return '/courses';
    
    switch (user.role) {
      case 'INSTRUCTOR':
        return '/instructor/courses';
      case 'ADMIN':
        return '/admin/courses';
      case 'STUDENT':
        return '/courses';  
      default:
        return '/courses';
    }
  };

  return (
    <header className="bg-gray-200 shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Modified to handle role-based navigation */}
          <div 
            onClick={handleLogoClick}
            className={`flex items-center space-x-2 ${
              user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') 
                ? 'cursor-default' 
                : 'cursor-pointer'
            }`}
          >
            {user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') ? (
              // Non-clickable logo for instructors and admins
              <>
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">SKY Education Platform</span>
              </>
            ) : (
              // Clickable logo for students and non-logged-in users
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">SKY Education Platform</span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to={getNavigationLink()} 
              className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <Home className="h-4 w-4" />
              <span>{getNavigationLabel()}</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                >
                  <Layout className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getRoleIcon()}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                        {user.role} Account
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to={getNavigationLink()} 
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>{getNavigationLabel()}</span>
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Layout className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <div className="text-xs text-gray-500 px-2">
                    Logged in as {user.role}
                  </div>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
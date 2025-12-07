import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../api/client';
import { toast } from 'react-toastify';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // CRITICAL: Prevent default form submission
    e.preventDefault();
    e.stopPropagation();

    console.log('Form submitted, preventing default behavior');

    if (!formData.email || !formData.password) {
      toast.warning('Email and password are required.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting login with:', { email: formData.email });
      const response = await authAPI.login(formData);
      console.log('API login response:', response);

      const { name, role, token } = response.data;
      if (!name || !role || !token) {
        throw new Error('Invalid response from server');
      }

      const user = { name, role };
      login(user, token);
      toast.success('Login successful!');

      let redirectPath = from;
      if (role === 'ADMIN') redirectPath = '/admin/dashboard';
      else if (role === 'INSTRUCTOR') redirectPath = '/instructor/dashboard';
      else if (role === 'STUDENT') redirectPath = '/student/dashboard';

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Login error details:', {
        error,
        response: error.response,
        message: error.message,
        stack: error.stack
      });

      // More robust error handling
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (status === 400) {
          errorMessage = data?.message || 'Invalid request';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data?.message || `Error ${status}`;
        }
      } else if (error.request) {
        // Network error - no response received
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle password toggle separately to avoid form submission
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <BookOpen className="h-12 w-12 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EduPlatform</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <Card.Content className="py-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <Input
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                disabled={loading}
              />

              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Login;
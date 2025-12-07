import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseAPI } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Search, BookOpen, User, Star, TrendingUp, Award, Users, Clock } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      // Get only first 5 courses as featured
      setFeaturedCourses(response.data.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to courses page with search term using React Router
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const stats = [
    { icon: Users, label: 'Active Students', value: '50,000+' },
    { icon: BookOpen, label: 'Courses Available', value: '1,200+' },
    { icon: Award, label: 'Expert Instructors', value: '300+' },
    { icon: TrendingUp, label: 'Success Rate', value: '95%' }
  ];

  const features = [
    {
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience',
      icon: Award
    },
    {
      title: 'Flexible Learning',
      description: 'Study at your own pace with lifetime access to course materials',
      icon: Clock
    },
    {
      title: 'Interactive Content',
      description: 'Engage with quizzes, assignments, and hands-on projects',
      icon: BookOpen
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Future with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> Expert Learning</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed">
              Master new skills, advance your career, and unlock your potential with our comprehensive online courses
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-32 py-4 text-gray-900 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* CTA Buttons */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8">
                    Start Learning Today
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 
          md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated courses, carefully selected to help you achieve your learning goals
            </p>
          </div>

          {featuredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No courses available</h3>
              <p className="text-gray-600">Check back later for new courses</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                {featuredCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                      <BookOpen className="h-12 w-12 text-white" />
                      <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                        Featured
                      </div>
                    </div>
                    <Card.Content className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm text-gray-600">{(course.feedbackList && course.feedbackList.length > 0
                            ? (course.feedbackList.reduce((sum, fb) => sum + fb.rating, 0) / course.feedbackList.length).toFixed(1)
                            : "0.0"
                          )}</span>
                          <span className="text-xs text-gray-500">({course.feedbackList.length})</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          <User className="h-4 w-4 inline mr-1" />
                          {course.noOfStudentsEnrolled} students
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600">
                          ${course.price || 'Free'}
                        </div>
                        <Link to={`/courses/${course.id}`}>
                          <Button size="sm" className="px-4">
                            View
                          </Button>
                        </Link>
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link to="/courses">
                  <Button size="lg" variant="outline" className="px-8">
                    View All Courses
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best learning experience with cutting-edge features and expert support
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User-specific CTA Section */}
      {user ? (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Welcome back, {user.name}!
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Continue your learning journey or explore new courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user.role === 'STUDENT' && (
                <>
                  <Link to="/student/dashboard">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                      My Dashboard
                    </Button>
                  </Link>
                  <Link to="/student/courses">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                      My Courses
                    </Button>
                  </Link>
                </>
              )}
              {user.role === 'INSTRUCTOR' && (
                <>
                  <Link to="/instructor/dashboard">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                      Instructor Dashboard
                    </Button>
                  </Link>
                  <Link to="/instructor/courses">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                      My Courses
                    </Button>
                  </Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <Link to="/admin/dashboard">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Link to="/admin/courses">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                      Manage Courses
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of learners who have already started their journey to success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}


    </div>
  );
};

export default Home;
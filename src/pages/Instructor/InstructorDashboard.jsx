import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import {
  BookOpen,
  Users,
  Plus,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  User,
  DollarSign,
} from 'lucide-react';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); ``


  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      const coursesData = response.data;
      setCourses(coursesData);
    } catch (error) {
      toast.error('Failed to fetch your courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await courseAPI.deleteCourse(courseId);
      toast.success('Course deleted successfully');
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const stats = [
    {
      label: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Total Students',
      value: courses.length * 15, // Mock data
      icon: Users,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Total Revenue',
      value: `$${(Math.random() * 200 + 1000).toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      label: 'Avg Rating',
      value: `${(Math.random() * 1 + 4).toFixed(1)}`,
      icon: TrendingUp,
      color: 'text-yellow-600 bg-yellow-100'
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">Manage your courses and track your teaching progress</p>
            </div>
            <Link to="/instructor/courses/create">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Course</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <Card.Content className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Management */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Courses</h2>
                  <Link to="/instructor/courses">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                {courses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-4">Start teaching by creating your first course</p>
                    <Link to="/instructor/courses/create">
                      <Button>Create Your First Course</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{Math.floor(Math.random() * 500 + 1)} students</span>
                            </span>
                            <span className="text-green-600 font-medium">${course.price || 'Free'}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link to={`/instructor/courses/${course.id}/students`}>
                            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </Button>
                          </Link>
                          <Link to={`/instructor/courses/${course.id}/edit`}>
                            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                              <Edit className="h-4 w-4" />
                              <span>Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {courses.length > 3 && (
                      <div className="text-center pt-4">
                        <Link to="/instructor/courses">
                          <Button variant="outline">View All {courses.length} Courses</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold">Quick Actions</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <Link to="/instructor/courses/create" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Course
                    </Button>
                  </Link>
                  <Link to="/instructor/courses" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Manage Courses
                    </Button>
                  </Link>
                  <Link to="/profile" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>

            {/* Recent Activity */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">5 new students enrolled</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Course "React Basics" updated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">New review received</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Monthly report generated</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Performance */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold">This Month</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Enrollments</span>
                    <span className="text-sm font-medium text-green-600">+23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Course Completions</span>
                    <span className="text-sm font-medium text-blue-600">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Rating</span>
                    <span className="text-sm font-medium text-yellow-600">4.8★</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="text-sm font-medium text-green-600">$1,240</span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
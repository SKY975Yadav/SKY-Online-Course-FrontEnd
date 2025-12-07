import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Award, 
  TrendingUp,
  Play,
  Calendar
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentAPI.getMyEnrollments();
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to fetch enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Enrolled Courses',
      value: enrollments.length,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Completed',
      value: Math.floor(enrollments.length * 0.4),
      icon: Award,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'In Progress',
      value: Math.ceil(enrollments.length * 0.6),
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Total Hours',
      value: enrollments.length * 8.5,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100'
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
          <div className="flex items-center space-x-3 mb-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          </div>
          <p className="text-gray-600">Continue your learning journey</p>
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
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Continue Learning</h2>
                  <Link to="/student/courses">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                {enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
                    <Link to="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.slice(0, 3).map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">Course ID: {enrollment.courseId}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                          </div>
                        </div>
                        
                        <Button size="sm" className="flex items-center space-x-2">
                          <Play className="h-4 w-4" />
                          <span>Continue</span>
                        </Button>
                      </div>
                    ))}
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
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Courses
                    </Button>
                  </Link>
                  <Link to="/student/courses" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      My Courses
                    </Button>
                  </Link>
                  <Link to="/profile" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>

            {/* Learning Streak */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold">Learning Streak</h2>
              </Card.Header>
              <Card.Content>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">7</div>
                  <p className="text-sm text-gray-600 mb-4">days in a row</p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    ))}
                  </div>
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
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Completed lesson 3 in React Basics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Earned certificate in HTML/CSS</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Started new course: JavaScript Fundamentals</span>
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

export default StudentDashboard;
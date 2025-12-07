import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, courseAPI, enrollmentAPI } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { FaRupeeSign } from 'react-icons/fa';

import {
  Users,
  BookOpen,
  GraduationCap,
  Shield,
  TrendingUp,
  UserCheck,
  DollarSign,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    students: 0,
    instructors: 0,
    admins: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [usersResponse, coursesResponse, enrollmentsResponse] = await Promise.all([
        userAPI.getAllUsers(),
        courseAPI.getAllCourses(),
        enrollmentAPI.getAllEnrollments()
      ]);

      const users = usersResponse.data;
      const courses = coursesResponse.data;
      const enrollments = enrollmentsResponse.data;

      // Calculate stats
      const roleStats = users.reduce((acc, user) => {
        acc[user.role.toLowerCase()]++;
        return acc;
      }, { student: 0, instructor: 0, admin: 0 });

      // Calculate revenue (assuming enrollments have a price field)
      const totalRevenue = enrollments.reduce((sum, enrollment) => {
        return sum + (enrollment.price || 0);
      }, 0);


      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        students: roleStats.student,
        instructors: roleStats.instructor,
        admins: roleStats.admin,
        revenue: totalRevenue
      });

      // Set recent data (last 5)
      setRecentUsers(users.slice(-5).reverse());
      setRecentCourses(courses.slice(-5).reverse());

    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      change: '+12%'
    },
    {
      label: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-green-600 bg-green-100',
      change: '+8%'
    },
    {
      label: 'Total Enrollments',
      value: stats.totalEnrollments,
      icon: GraduationCap,
      color: 'text-purple-600 bg-purple-100',
      change: '+23%'
    },
    {
      label: 'Revenue',
      value: '\u20B9' + (stats.revenue * 0.05).toFixed(2), // Assuming 5% commission
      icon: FaRupeeSign,
      color: 'text-yellow-600 bg-yellow-100',
      change: '+15%'
    }
  ];

  const roleStats = [
    { label: 'Students', value: stats.students, color: 'text-green-600' },
    { label: 'Instructors', value: stats.instructors, color: 'text-blue-600' },
    { label: 'Admins', value: stats.admins, color: 'text-red-600' }
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
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening on your platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <Card.Content className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Roles Breakdown */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">User Roles Distribution</h2>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-3 gap-4">
                  {roleStats.map((role, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${role.color} mb-1`}>
                        {role.value}
                      </div>
                      <div className="text-sm text-gray-600">{role.label}</div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Recent Users */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Users</h2>
                  <Link to="/admin/users">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {user.role}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Recent Courses */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Courses</h2>
                  <Link to="/admin/courses">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{course.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          ${course.price || 'Free'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {course.instructorId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <Link to="/admin/users" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                  <Link to="/admin/courses" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Manage Courses
                    </Button>
                  </Link>
                  <Link to="/admin/enrollments" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      View Enrollments
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>

            {/* System Health */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold">System Health</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Server Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Operational</span>
                    </div>
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
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">5 new users registered</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">3 new courses created</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-600">12 new enrollments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">System backup completed</span>
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

export default AdminDashboard;
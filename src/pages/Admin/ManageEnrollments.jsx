import React, { useState, useEffect } from 'react';
import { enrollmentAPI, courseAPI, userAPI } from '../../api/client';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  BookOpen,
  User,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (enrollments.length > 0 && courses.length > 0 && users.length > 0) {
      const enrichedEnrollments = enrollments.map(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        const student = users.find(u => u.id === enrollment.studentId);
        return {
          ...enrollment,
          courseName: course?.title || 'Unknown Course',
          studentName: student?.name || 'Unknown Student',
          studentEmail: student?.email || 'Unknown Email'
        };
      });

      const filtered = enrichedEnrollments.filter(enrollment =>
        enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredEnrollments(filtered);
    }
  }, [enrollments, courses, users, searchTerm]);

  const fetchAllData = async () => {
    try {
      const [enrollmentsResponse, coursesResponse, usersResponse] = await Promise.all([
        enrollmentAPI.getAllEnrollments(),
        courseAPI.getAllCourses(),
        userAPI.getAllUsers()
      ]);

      setEnrollments(enrollmentsResponse.data);
      setCourses(coursesResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      toast.error('Failed to fetch enrollment data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalEnrollments = enrollments.length;
  const uniqueStudents = new Set(enrollments.map(e => e.studentId)).size;
  const uniqueCourses = new Set(enrollments.map(e => e.courseId)).size;
  const recentEnrollments = enrollments.filter(enrollment => {
    const enrollmentDate = new Date(enrollment.enrolledAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return enrollmentDate >= weekAgo;
  }).length;

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
          <div className="flex items-center space-x-3 mb-4">
            <GraduationCap className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Manage Enrollments</h1>
          </div>
          <p className="text-gray-600">
            View and manage all course enrollments • Total: {totalEnrollments} enrollments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <Card.Content className="p-6 text-center">
              <GraduationCap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{totalEnrollments}</div>
              <div className="text-sm text-gray-600">Total Enrollments</div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{uniqueStudents}</div>
              <div className="text-sm text-gray-600">Unique Students</div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{uniqueCourses}</div>
              <div className="text-sm text-gray-600">Courses with Enrollments</div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{recentEnrollments}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </Card.Content>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <Card.Content className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by course, student name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                <div className="text-sm text-gray-600">
                  Showing {filteredEnrollments.length} of {totalEnrollments} enrollments
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Enrollments Table */}
        {filteredEnrollments.length === 0 ? (
          <Card>
            <Card.Content className="p-12 text-center">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? 'No enrollments found' : 'No enrollments available'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search criteria' 
                  : 'Enrollments will appear here when students enroll in courses'
                }
              </p>
            </Card.Content>
          </Card>
        ) : (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">All Enrollments</h2>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {enrollment.studentEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                {enrollment.courseName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Course
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(enrollment.enrolledAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">#{enrollment.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">#{enrollment.courseId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">#{enrollment.id}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Recent Activity */}
        {enrollments.length > 0 && (
          <div className="mt-8">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Recent Enrollments</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {filteredEnrollments
                    .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
                    .slice(0, 5)
                    .map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            <span className="text-blue-600">{enrollment.studentName}</span> enrolled in{' '}
                            <span className="text-green-600">{enrollment.courseName}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(enrollment.enrolledAt).toLocaleDateString()} at{' '}
                            {new Date(enrollment.enrolledAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEnrollments;
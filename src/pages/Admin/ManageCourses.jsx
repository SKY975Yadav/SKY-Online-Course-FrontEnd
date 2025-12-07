import React, { useState, useEffect } from 'react';
import { courseAPI } from '../../api/client';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import {
  BookOpen,
  Search,
  Filter,
  Trash2,
  User,
  DollarSign,
  Eye,
  Users
} from 'lucide-react';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [courses, searchTerm]);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAllCourses();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete course "${courseTitle}"? This action cannot be undone.`)) {
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

  const totalRevenue = courses.reduce((sum, course) => sum + (course.price || 0), 0);
  const freeCourses = courses.filter(course => !course.price || course.price === 0).length;
  const paidCourses = courses.length - freeCourses;

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
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          </div>
          <p className="text-gray-600">
            Manage all courses on the platform • Total: {courses.length} courses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <Card.Content className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{paidCourses}</div>
              <div className="text-sm text-gray-600">Paid Courses</div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{freeCourses}</div>
              <div className="text-sm text-gray-600">Free Courses</div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Value</div>
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
                  placeholder="Search courses by title or description..."
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
                  Showing {filteredCourses.length} of {courses.length} courses
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Courses Table */}
        {filteredCourses.length === 0 ? (
          <Card>
            <Card.Content className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm ? 'No courses found' : 'No courses available'}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Courses will appear here once instructors create them'
                }
              </p>
            </Card.Content>
          </Card>
        ) : (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">All Courses</h2>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCourses.map((course) => {
                      const studentCount = Math.floor(Math.random() * 50) + 10; // Mock data
                      return (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <BookOpen className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {course.title}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-2">
                                  {course.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              ID: {course.instructorId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${course.price ? 'text-green-600' : 'text-gray-600'}`}>
                              {course.price ? `$${course.price}` : 'Free'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              {studentCount}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">#{course.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Link to={`/course/${course.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center space-x-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>View</span>
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCourse(course.id, course.title)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;
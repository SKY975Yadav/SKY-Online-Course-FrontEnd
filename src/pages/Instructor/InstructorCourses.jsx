import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../api/client';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import {
  BookOpen,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  DollarSign
} from 'lucide-react';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);


  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [courses, searchTerm]);


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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600 mt-2">
                Manage and track your {courses.length} courses
              </p>
            </div>
            <Link to="/instructor/courses/create">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Course</span>
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Course Stats */}
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
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 10000 + 1)}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {Math.floor(Math.random() * 10000 + 1).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mx-auto mb-2">{(Math.random() * 1 + 4).toFixed(1)}★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </Card.Content>
          </Card>
        </div>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No courses found' : 'No courses created yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start teaching by creating your first course'
              }
            </p>
            {!searchTerm && (
              <Link to="/instructor/courses/create">
                <Button>Create Your First Course</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (

              <div key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                <Link to={`/course/${course.id}`} className="no-underline" key={course.id}>
                  <Card>
                    {/* Course Image */}
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white" />
                    </div>

                    <Card.Content className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {course.description}
                      </p>

                      {/* Course Stats */}
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                        <div className="flex flex-col items-center text-sm">
                          <span className="text-yellow-600 font-semibold">
                            {(Math.random() * 1 + 4).toFixed(1)} ★
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({Math.floor(Math.random() * 500 + 1)} ratings)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{Math.floor(Math.random() * 1000 + 1)} students</span>
                        </div>
                        <div className="text-green-600 font-medium text-lg">
                          ${course.price || 'Free'}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <Link to={`/instructor/courses/${course.id}/students`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>Students</span>
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
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteCourse(course.id);
                          }}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourses;
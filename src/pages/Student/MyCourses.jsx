import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI, courseAPI } from '../../api/client';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  Search,
  Filter,
  Calendar,
  X
} from 'lucide-react';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [courses, searchTerm]);

  const fetchEnrollments = async () => {
    try {
      const enrollmentsResponse = await enrollmentAPI.getMyEnrollments();
      setEnrollments(enrollmentsResponse.data);
      
      // Fetch course details for each enrollment
      const coursePromises = enrollmentsResponse.data.map(enrollment =>
        courseAPI.getCourseById(enrollment.courseId)
      );
      
      const courseResponses = await Promise.all(coursePromises);
      const coursesData = courseResponses.map((response, index) => ({
        ...response.data,
        enrollmentId: enrollmentsResponse.data[index].id,
        enrolledAt: enrollmentsResponse.data[index].enrolledAt
      }));
      
      setCourses(coursesData);
      setFilteredCourses(coursesData);
    } catch (error) {
      toast.error('Failed to fetch your courses');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId, enrollmentId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) {
      return;
    }

    try {
      await enrollmentAPI.unenroll(courseId);
      toast.success('Successfully unenrolled from the course');
      // Remove the course from the list
      setCourses(courses.filter(course => course.id !== courseId));
      setEnrollments(enrollments.filter(enrollment => enrollment.id !== enrollmentId));
    } catch (error) {
      toast.error('Failed to unenroll from the course');
    }
  };

  const getProgressPercentage = () => {
    return Math.floor(Math.random() * 100); // Mock progress
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Courses</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600">
              You're enrolled in {courses.length} courses
            </p>
            
            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'No courses found' : 'No courses enrolled'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start your learning journey by enrolling in a course'
              }
            </p>
            {!searchTerm && (
              <Link to="/">
                <Button>Browse Courses</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const progress = getProgressPercentage();
              const isCompleted = progress === 100;
              
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                  {/* Course Image */}
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-lg flex items-center justify-center relative">
                    <BookOpen className="h-12 w-12 text-white" />
                    {isCompleted && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>Completed</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <Card.Content className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-600'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>8h 30m</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button className="flex-1 flex items-center justify-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>{isCompleted ? 'Review' : 'Continue'}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnenroll(course.id, course.enrollmentId)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <X className="h-4 w-4" />
                        <span>Unenroll</span>
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
          </div>
        )}

        {/* Course Stats */}
        {courses.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <Card.Content className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{courses.length}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.floor(courses.length * 0.4)}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {Math.ceil(courses.length * 0.6)}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </Card.Content>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
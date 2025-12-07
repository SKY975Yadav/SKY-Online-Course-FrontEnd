import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { courseAPI } from '../api/client';
import { toast } from 'react-toastify';
import { Search, Filter, BookOpen, Star, User } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Link } from 'react-router-dom';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Get search params from URL
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get search term from URL params when component mounts
    const urlSearchTerm = searchParams.get('search');
    if (urlSearchTerm) {
      setSearchTerm(decodeURIComponent(urlSearchTerm));
    }

    fetchCourses();
  }, [searchParams]);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAllCourses();
      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
            {searchTerm && (
              <p className="text-gray-600 mt-2">
                Showing results for: <span className="font-semibold">"{searchTerm}"</span>
                <button
                  onClick={clearSearch}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Clear search
                </button>
              </p>
            )}
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for courses..."
              className="w-full pl-12 pr-4 py-3 rounded-lg text-lg text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            {searchTerm ? (
              <>
                <p className="text-gray-600 text-lg mb-2">
                  No courses found for "{searchTerm}"
                </p>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search terms or browse all courses
                </p>
                <Button onClick={clearSearch} variant="outline">
                  Show All Courses
                </Button>
              </>
            ) : (
              <p className="text-gray-600 text-lg">No courses found.</p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              {searchTerm ? (
                <span>Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} matching "{searchTerm}"</span>
              ) : (
                <span>Showing all {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id}>
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                  <Card.Content className="p-4">
                    <h2 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                      {course.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {course.description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {course.noOfStudentsEnrolled}
                      </span>
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        {(
                          course.feedbackList && course.feedbackList.length > 0
                            ? (course.feedbackList.reduce((sum, fb) => sum + fb.rating, 0) / course.feedbackList.length).toFixed(1)
                            : "0.0"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">
                        ₹{course.price || 'Free'}
                      </span>
                      <Link to={`/courses/${course.id}`}>
                        <Button size="sm">View</Button>
                      </Link>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseCourses;
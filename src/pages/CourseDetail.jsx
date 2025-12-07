import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI, feedbackAPI } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import {
  BookOpen,
  User,
  Clock,
  Star,
  Users,
  Award,
  ArrowLeft,
  CheckCircle,
  Play,
  FileText,
  Video
} from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user, isStudent } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [enrolledStudentsCount, setEnrolledStudentsCount] = useState(0);
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewTitle: '',
    review: ''
  });

  useEffect(() => {
    fetchCourseData();
    if (isStudent && user) {
      checkEnrollmentStatus();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await courseAPI.getCourseById(id);
      setCourse(courseResponse.data);

      // Fetch course feedbacks
      try {
        const feedbackResponse = await feedbackAPI.getCourseFeedbacks(id);
        setFeedbacks(feedbackResponse.data || []);
      } catch (feedbackError) {
        console.log('No feedbacks found or error fetching feedbacks:', feedbackError);
        setFeedbacks([]);
      }

      // Fetch enrolled students count (only if user has permission)
      if (user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN')) {
        try {
          const studentsResponse = await courseAPI.getEnrolledStudentsCount(id);
          setEnrolledStudentsCount(studentsResponse.data);
        } catch (error) {
          console.log('Cannot fetch student count:', error);
          setEnrolledStudentsCount(0);
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((total, feedback) => total + feedback.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const checkEnrollmentStatus = async () => {
    try {
      const response = await enrollmentAPI.isEnrolled(id);
      setIsEnrolled(response.data);
    } catch (error) {
      console.error('Failed to check enrollment status:', error);
      // Fallback: check through enrollments list
      try {
        const enrollmentsResponse = await enrollmentAPI.getMyEnrollments();
        const enrolled = enrollmentsResponse.data.some(enrollment => 
          enrollment.courseId === parseInt(id)
        );
        setIsEnrolled(enrolled);
      } catch (fallbackError) {
        console.error('Fallback enrollment check failed:', fallbackError);
      }
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentAPI.enroll(id);
      toast.success('Successfully enrolled in the course!');
      setIsEnrolled(true);
      fetchCourseData(); // Refresh course data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isEnrolled) {
      toast.error('You must be enrolled in the course to submit a review');
      return;
    }

    try {
      const reviewData = {
        rating: newReview.rating,
        reviewTitle: newReview.reviewTitle,
        review: newReview.review
      };

      await feedbackAPI.submitFeedback(id, reviewData);
      toast.success('Review submitted successfully!');
      setNewReview({
        rating: 5,
        reviewTitle: '',
        review: ''
      });
      fetchCourseData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <Link to="/">
            <Button variant="outline">Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <Play className="h-16 w-16 text-white mx-auto mb-4" />
                  <p className="text-white text-lg">Course Preview</p>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Instructor ID: {course.instructorId}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Self-paced</span>
                </div>
                {enrolledStudentsCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{enrolledStudentsCount} students</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{calculateAverageRating()} ({feedbacks.length} reviews)</span>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <Card className="mb-8">
              <Card.Header>
                <h2 className="text-xl font-semibold">About this course</h2>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-700 leading-relaxed">
                  {course.description}
                </p>
              </Card.Content>
            </Card>

            {/* Course Modules */}
            <Card className="mb-8">
              <Card.Header>
                <h2 className="text-xl font-semibold">Course Modules</h2>
                <p className="text-sm text-gray-600 mt-1">What you'll learn in this course</p>
              </Card.Header>
              <Card.Content>
                {course.moduleNames && course.moduleNames.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.moduleNames.map((moduleName, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{moduleName}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Master the fundamentals',
                      'Build real-world projects',
                      'Learn best practices',
                      'Get hands-on experience',
                      'Understand core concepts',
                      'Apply knowledge practically'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Course Content */}
            <Card className="mb-8">
              <Card.Header>
                <h2 className="text-xl font-semibold">Course content</h2>
                {course.modules && course.modules.length > 0 ? (
                  <p className="text-sm text-gray-600 mt-1">
                    {course.modules.length} modules • 
                    {course.modules.reduce((total, module) => 
                      total + (module.videos?.length || 0) + (module.documents?.length || 0), 0
                    )} items
                  </p>
                ) : course.moduleNames && course.moduleNames.length > 0 ? (
                  <p className="text-sm text-gray-600 mt-1">
                    {course.moduleNames.length} modules available
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">
                    Content details available after enrollment
                  </p>
                )}
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {course.modules && course.modules.length > 0 ? (
                    course.modules.map((module, index) => (
                      <div key={module.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{module.moduleName}</h3>
                          <span className="text-sm text-gray-600">
                            {(module.videos?.length || 0) + (module.documents?.length || 0)} items
                          </span>
                        </div>
                        
                        {/* Module content */}
                        <div className="space-y-2">
                          {module.videos?.map((video, videoIndex) => (
                            <div key={video.id || videoIndex} className="flex items-center space-x-2 text-sm text-gray-600 ml-4">
                              <Video className="h-4 w-4" />
                              <span>{video.filename}</span>
                              {video.description && (
                                <span className="text-gray-500">- {video.description}</span>
                              )}
                            </div>
                          ))}
                          {module.documents?.map((document, docIndex) => (
                            <div key={document.id || docIndex} className="flex items-center space-x-2 text-sm text-gray-600 ml-4">
                              <FileText className="h-4 w-4" />
                              <span>{document.filename}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Course content will be available after enrollment
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>

            {/* Ratings & Reviews Section */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Ratings & Reviews</h2>
                <div className="flex items-center mt-2">
                  <div className="text-3xl font-bold mr-4">{calculateAverageRating()}</div>
                  <div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= Math.round(calculateAverageRating())
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on {feedbacks.length} reviews
                    </p>
                  </div>
                </div>
              </Card.Header>
              <Card.Content>
                {/* Review Form (only for enrolled students) */}
                {isStudent && isEnrolled && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-6 w-6 ${star <= newReview.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Review Title
                        </label>
                        <input
                          type="text"
                          id="reviewTitle"
                          value={newReview.reviewTitle}
                          onChange={(e) => setNewReview({ ...newReview, reviewTitle: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                          maxLength="100"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Review
                        </label>
                        <textarea
                          id="review"
                          rows="4"
                          value={newReview.review}
                          onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                          maxLength="500"
                        ></textarea>
                      </div>
                      <Button type="submit" className="w-full">
                        Submit Review
                      </Button>
                    </form>
                  </div>
                )}
                
                {feedbacks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet. Be the first to review!
                  </div>
                ) : (
                  <div className="space-y-6">
                    {feedbacks.map((feedback, index) => (
                      <div key={feedback.id || index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= feedback.rating
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{feedback.rating}.0</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{feedback.reviewTitle}</h3>
                        <p className="text-gray-700 mb-2">{feedback.review}</p>
                        {feedback.createdAt && (
                          <p className="text-xs text-gray-500">
                            {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <Card className="sticky top-8">
              <Card.Content className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${course.price || 'Free'}
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>Certificate included</span>
                  </div>
                </div>

                {user ? (
                  <>
                    {isStudent ? (
                      <>
                        {isEnrolled ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-medium">You're enrolled!</span>
                            </div>
                            <Link to="/student/courses">
                              <Button className="w-full" size="lg">
                                Go to My Courses
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <Button
                            onClick={handleEnroll}
                            loading={enrolling}
                            className="w-full"
                            size="lg"
                          >
                            Enroll Now
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-gray-600">
                        <p className="mb-4">Only students can enroll in courses</p>
                        <Button variant="outline" disabled className="w-full">
                          Enrollment Restricted
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login">
                      <Button className="w-full" size="lg">
                        Login to Enroll
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" className="w-full">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">This course includes:</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Self-paced learning</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        {course.modules?.reduce((total, module) => 
                          total + (module.documents?.length || 0), 0
                        ) || 0} downloadable resources
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4" />
                      <span>
                        {course.modules?.reduce((total, module) => 
                          total + (module.videos?.length || 0), 0
                        ) || 0} video lectures
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Access to course community</span>
                    </div>
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

export default CourseDetailPage;
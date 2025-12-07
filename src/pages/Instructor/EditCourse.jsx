import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../../api/client';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { BookOpen, ArrowLeft, Save } from 'lucide-react';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getCourseById(id);
      const course = response.data;
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price || ''
      });
    } catch (error) {
      toast.error('Failed to fetch course details');
      navigate('/instructor/courses');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? (value === '' ? '' : parseFloat(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        ...formData,
        price: formData.price === '' ? 0 : formData.price
      };
      
      await courseAPI.updateCourse(id, courseData);
      toast.success('Course updated successfully!');
      navigate('/instructor/courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/instructor/courses')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </button>
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
              <p className="text-gray-600 mt-1">Update your course information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Course Information</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update the details about your course
                </p>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Course Title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Complete React.js Course for Beginners"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe what students will learn in this course..."
                      required
                    />
                  </div>

                  <Input
                    label="Course Price (USD)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-900 mb-2">Important Note:</h4>
                    <p className="text-sm text-yellow-800">
                      Changes to course pricing may affect existing students. Consider the impact before making significant price changes.
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 pt-6">
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Update Course</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/instructor/courses')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Course Preview</h3>
              </Card.Header>
              <Card.Content>
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {formData.title || 'Course Title'}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {formData.description || 'Course description will appear here...'}
                </p>
                <div className="text-lg font-bold text-green-600">
                  ${formData.price || '0.00'}
                </div>
              </Card.Content>
            </Card>

            {/* Course Actions */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Course Actions</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Course Page
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </Card.Content>
            </Card>

            {/* Course Stats */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Course Statistics</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Students:</span>
                    <span className="font-medium">{Math.floor(Math.random() * 50) + 10}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating:</span>
                    <span className="font-medium">4.8★</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue:</span>
                    <span className="font-medium text-green-600">
                      ${((Math.floor(Math.random() * 50) + 10) * (formData.price || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion Rate:</span>
                    <span className="font-medium">78%</span>
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

export default EditCourse;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../../api/client';
import { toast } from 'react-toastify';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { BookOpen, ArrowLeft, Save } from 'lucide-react';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });

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
      
      await courseAPI.createCourse(courseData);
      toast.success('Course created successfully!');
      navigate('/instructor/courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600 mt-1">Share your knowledge with students around the world</p>
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
                  Provide the basic details about your course
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

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Course Creation Tips:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Choose a clear, descriptive title that tells students what they'll learn</li>
                      <li>• Write a detailed description that outlines the course objectives</li>
                      <li>• Set a competitive price or offer it for free to attract more students</li>
                      <li>• You can always edit these details later</li>
                    </ul>
                  </div>

                  <div className="flex items-center space-x-4 pt-6">
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Create Course</span>
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

            {/* Guidelines */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Course Guidelines</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Title Requirements</h4>
                    <p className="text-gray-600">Keep it under 60 characters and make it descriptive</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                    <p className="text-gray-600">Explain what students will learn and any prerequisites</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Pricing</h4>
                    <p className="text-gray-600">Research similar courses to set competitive pricing</p>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Next Steps */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">After Creation</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Add course curriculum and lessons</p>
                  <p>✓ Upload course materials and videos</p>
                  <p>✓ Set course requirements and objectives</p>
                  <p>✓ Publish your course for students</p>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
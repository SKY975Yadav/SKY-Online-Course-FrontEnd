import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../api/client';
import { toast } from 'react-toastify';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Password change form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.password) {
      toast.error('Please enter your current password to update profile');
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.updateUser({
        name: profileData.name,
        email: profileData.email,
        password: profileData.password
      });
      
      const updatedUser = { ...user, name: profileData.name, email: profileData.email };
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
      setProfileData({ ...profileData, password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <Card.Content className="p-6 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{user?.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{user?.email}</p>
                <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role}
                </div>
              </Card.Content>
            </Card>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'password'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Lock className="h-4 w-4 inline mr-2" />
                Change Password
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            {activeTab === 'profile' && (
              <Card>
                <Card.Header>
                  <h2 className="text-xl font-semibold flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Profile Information
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update your personal information and email address
                  </p>
                </Card.Header>
                <Card.Content>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                    />

                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />

                    <div className="relative">
                      <Input
                        label="Current Password"
                        name="password"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={profileData.password}
                        onChange={handleProfileChange}
                        placeholder="Enter your current password to confirm changes"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        loading={loading}
                        className="flex items-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Card.Content>
              </Card>
            )}

            {activeTab === 'password' && (
              <Card>
                <Card.Header>
                  <h2 className="text-xl font-semibold flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update your password to keep your account secure
                  </p>
                </Card.Header>
                <Card.Content>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="relative">
                      <Input
                        label="Current Password"
                        name="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="New Password"
                        name="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="relative">
                      <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• At least 6 characters long</li>
                        <li>• Should be different from your current password</li>
                        <li>• Use a combination of letters, numbers, and symbols for better security</li>
                      </ul>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        loading={loading}
                        className="flex items-center"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Card.Content>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
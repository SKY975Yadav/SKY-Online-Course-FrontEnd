import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../api/client';
import { toast } from 'react-toastify';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { BookOpen, ArrowLeft, Shield } from 'lucide-react';

const VerifyOTP = () => {
const [otp, setOtp] = useState('');
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const location = useLocation();
const email = location.state?.email;

if (!email) {
  navigate('/forgot-password');
  return null;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await authAPI.verifyOTP(email, otp);
    toast.success('OTP verified successfully');
    navigate('/reset-password', { state: { email, otp } });
  } catch (error) {
    toast.error(error.response?.data?.message || 'Invalid or expired OTP');
  } finally {
    setLoading(false);
  }
};

const handleResendOTP = async () => {
  try {
    await authAPI.forgotPassword(email);
    toast.success('New OTP sent to your email');
  } catch (error) {
    toast.error('Failed to resend OTP');
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <BookOpen className="h-12 w-12 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">EduPlatform</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Verify OTP
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <Card>
        <Card.Content className="py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <Input
              label="Enter OTP"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Verify OTP
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Didn't receive the code? Resend OTP
              </button>
              <div>
                <Link 
                  to="/forgot-password" 
                  className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to forgot password
                </Link>
              </div>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  </div>
);
};

export default VerifyOTP;
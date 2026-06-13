import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'sonner';
import { Navbar } from "../components/navbar";
import { authService } from '../../services/services';
import { X } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(false);
    setErrors({});
    
    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Invalid email or password";
      let fieldErrors = {};
      
      if (error.errors) {
        fieldErrors = error.errors;
        
        // Get first error message for toast
        if (fieldErrors.email && fieldErrors.email.length > 0) {
          errorMessage = fieldErrors.email[0];
        } else if (fieldErrors.password && fieldErrors.password.length > 0) {
          errorMessage = fieldErrors.password[0];
        } else if (fieldErrors.non_field_errors && fieldErrors.non_field_errors.length > 0) {
          errorMessage = fieldErrors.non_field_errors[0];
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setErrors(fieldErrors);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setLoginError(true);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    if (errors[fieldName] && errors[fieldName].length > 0) {
      return errors[fieldName][0];
    }
    return null;
  };

  // Forgot Password Modal Component
  const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const [error, setError] = useState('');

    React.useEffect(() => {
      let timer;
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      }
      return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendOTP = async () => {
      if (!email) {
        setError('Please enter your email');
        return;
      }
      
      setError('');
      setLoading(true);
      try {
        const response = await authService.forgotPassword(email);
        if (response.success) {
          toast.success('OTP sent to your email!');
          setCountdown(60);
          setResendCount(prev => prev + 1);
          setStep(2);
        } else {
          setError(response.message || 'Failed to send OTP');
        }
      } catch (error) {
        setError(error.message || 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
    };

    const handleVerifyOTP = async () => {
      if (!otp || otp.length !== 6) {
        setError('Please enter valid 6-digit OTP');
        return;
      }
      
      setError('');
      setLoading(true);
      try {
        const response = await authService.verifyOTP(email, otp);
        if (response.success) {
          toast.success('OTP verified!');
          setStep(3);
        } else {
          setError(response.message || 'Invalid OTP');
        }
      } catch (error) {
        setError(error.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    const handleResetPassword = async () => {
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      setError('');
      setLoading(true);
      try {
        const response = await authService.resetPassword(email, newPassword, confirmPassword);
        if (response.success) {
          toast.success('Password reset successfully! Please login with your new password.');
          onClose();
          setStep(1);
          setEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
          setResendCount(0);
        } else {
          setError(response.message || 'Failed to reset password');
        }
      } catch (error) {
        setError(error.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    };

    const handleResendOTP = async () => {
      if (countdown > 0) {
        toast.info(`Please wait ${countdown} seconds`);
        return;
      }
      if (resendCount >= 3) {
        setError('Maximum resend limit reached. Please try again later.');
        return;
      }
      handleSendOTP();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Verify OTP'}
              {step === 3 && 'Reset Password'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Enter your registered email address. We'll send you a verification code.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500"
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Enter the 6-digit code sent to {email}
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500 text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || resendCount >= 3}
                  className={`text-sm ${countdown > 0 || resendCount >= 3 ? 'text-gray-400' : 'text-emerald-600 hover:text-emerald-700'}`}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 
                   resendCount >= 3 ? 'Maximum resend limit reached' : 'Resend OTP'}
                </button>
                {resendCount > 0 && resendCount < 3 && (
                  <p className="text-xs text-gray-400 mt-1">Attempts: {resendCount}/3</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Create a new password for your account.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500"
                />
              </div>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start w-full font-poppins">
      <Toaster position="top-center" richColors />
      <Navbar />
      <div className="bg-white p-5 rounded-2xl shadow-xl w-110 text-center mt-20">
        <h2 className="text-2xl font-semibold text-emerald-600 mb-1">Welcome</h2>
        <p className="text-gray-500 text-sm mb-3">
          Login to continue your analysis
        </p>
        <form onSubmit={handleSubmit} className="text-left">
          
          {/* Email Field */}
          <div>
            <label className="font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full mt-3 mb-3 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500 ${
                getFieldError('email') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError('email') && (
              <p className="text-red-500 text-xs mt-1 -mb-2 text-left">
                {getFieldError('email')}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full mt-3 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500 ${
                getFieldError('password') || loginError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {getFieldError('password') && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {getFieldError('password')}
              </p>
            )}
          </div>

          {/* Forgot Password button - shows only when login fails */}
          {loginError && formData.password.length > 0 && (
            <div className="text-right mb-4 mt-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-red-500 hover:text-red-600 transition-all"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* General login error message */}
          {loginError && !getFieldError('email') && !getFieldError('password') && (
            <p className="text-red-500 text-xs mt-2 mb-3 text-center">
              Invalid email or password. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emerald-600 text-white py-3 rounded-xl text-lg font-medium transition mt-3 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-gray-500 text-sm mt-5 text-center">
            Don't have an account?
            <span
              onClick={() => navigate("/sign_up")}
              className="text-emerald-600 font-semibold ml-1 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
}
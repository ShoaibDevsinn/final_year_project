import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { 
  User, Trash2, MapPin, Home, Calendar, Award, Sparkles, Camera,
  Mail, Lock, Eye, EyeOff, CheckCircle, Edit2, X, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { authService, predictionService } from '../../services/services';

export default function UserProfile() {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [userName, setUserName] = useState('');
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('••••••••');
  const [userAvatar, setUserAvatar] = useState(null);
  const [userMemberSince, setUserMemberSince] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [tempConfirmPassword, setTempConfirmPassword] = useState('');
  const [tempNewEmail, setTempNewEmail] = useState('');
  const [tempCurrentPassword, setTempCurrentPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
  fetchUserData();
  fetchPredictionHistory();
}, []);

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

  useEffect(() => {
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
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/sign_in';
        }, 2000);
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
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-2xl tracking-widest"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
      </motion.div>
    </div>
  );
};

const formatMemberSince = (date) => {
    if (!date) return '2024';
    return new Date(date).getFullYear();
  };

const fetchUserData = async () => {
  try {
    const user = authService.getCurrentUser();
    console.log('User from localStorage:', user);
    
    if (user) {
      setUserName(user.username || user.full_name || user.email?.split('@')[0] || 'User');
      setUserEmail(user.email || '');
      setUserMemberSince(user.date_joined || user.created_at || new Date().toISOString());
      
      const profileResponse = await authService.getProfile();
      console.log('Profile response:', profileResponse);
      
      if (profileResponse.success && profileResponse.data) {
        if (profileResponse.data.profile_image) {
          setUserAvatar(profileResponse.data.profile_image);
        }
      }
    } else {
      navigate('/sign_in');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    toast.error('Failed to load user data');
  } finally {
    setLoading(false);
  }
};

const fetchPredictionHistory = async () => {
  try {
    const response = await predictionService.getPredictionHistory();
    console.log('Prediction history response:', response);
    
    // ✅ FIX: Get predictions from response.predictions (not response.data)
    let predictionsList = [];
    if (response.predictions && Array.isArray(response.predictions)) {
      predictionsList = response.predictions;
    } else if (response.data && Array.isArray(response.data)) {
      predictionsList = response.data;
    } else if (response.data && response.data.predictions) {
      predictionsList = response.data.predictions;
    } else if (Array.isArray(response)) {
      predictionsList = response;
    }
    
    console.log('Predictions list:', predictionsList);
    
 const formattedPredictions = predictionsList.map(pred => ({
  id: pred.prediction_id || pred.id,  // Use prediction_id from API
  area: pred.location || pred.area || 'Unknown',
  marla: pred.area_marla || pred.marla || 0,
  bedrooms: pred.bedrooms || 0,
  bathrooms: pred.bathrooms || 0,
  kitchen: pred.kitchens || pred.kitchen || 0,
  predictedPrice: pred.predicted_price || pred.predictedPrice || 0,
  pricePerMarla: pred.per_marla_rate || (pred.predicted_price / pred.area_marla) || 0,
  date: pred.created_at || pred.date || new Date().toISOString(),
  furnished: pred.is_furnished || false,
  hasGarage: false,
  hasGarden: pred.has_lawn || false,
  hasRoofAccess: false
}));
console.log('Sample prediction:', formattedPredictions[0]);
    setPredictions(formattedPredictions);
    console.log('Predictions state after set:', formattedPredictions.length);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    setPredictions([]);
  }
};

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size should be less than 5MB');
    return;
  }
  if (!file.type.startsWith('image/')) {
    toast.error('Please upload an image file');
    return;
  }
  
  const formData = new FormData();
  formData.append('profile_image', file);
  
  try {
    const response = await authService.updateProfileImage(formData);
    if (response.success) {
      setUserAvatar(response.data.profile_image_url);
      toast.success('Profile picture updated! 🎉');
    }
  } catch (error) {
    toast.error(error.message || 'Failed to update profile picture');
  }
};

  const handleDeletePrediction = async (id) => {
  try {
    await predictionService.deletePrediction(id);
    setPredictions(predictions.filter((p) => p.id !== id));
    toast.success('Prediction deleted successfully!');
  } catch (error) {
    toast.error(error.message || 'Failed to delete prediction');
  }
};

  const handleSaveName = async () => {
  if (userName.trim() === '') {
    toast.error('Name cannot be empty');
    return;
  }
  
  try {
    const response = await authService.updateUsername(userName);
    if (response.success) {
      setIsEditingName(false);
      toast.success(`Name updated to ${userName}! 🎉`);
    }
  } catch (error) {
    toast.error(error.message || 'Failed to update name');
  }
};

  const handleSaveEmail = async () => {
  if (tempNewEmail.trim() === '') {
    toast.error('Email cannot be empty');
    return;
  }
  if (!tempNewEmail.includes('@') || !tempNewEmail.includes('.')) {
    toast.error('Please enter a valid email address');
    return;
  }
  
  try {
    const response = await authService.updateEmail(tempNewEmail);
    if (response.success) {
      setUserEmail(tempNewEmail);
      setIsEditingEmail(false);
      setTempNewEmail('');
      toast.success(`Email updated to ${tempNewEmail}! 📧`);
      
      // Update stored user data
      const user = authService.getCurrentUser();
      if (user) {
        user.email = tempNewEmail;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  } catch (error) {
    toast.error(error.message || 'Failed to update email');
  }
};

const cancelEmailEdit = () => {
  setIsEditingEmail(false);
  setTempNewEmail('');
  setTempCurrentPassword('');
};

const handleSavePassword = async () => {
  // Clear previous validation states
  setValidationErrors({});
  
  // Validation checks
  if (!tempCurrentPassword) {
    toast.error('Please enter your current password');
    return;
  }
  if (tempPassword.length < 6) {
    toast.error('New password must be at least 6 characters');
    return;
  }
  if (tempPassword !== tempConfirmPassword) {
    toast.error('New passwords do not match');
    return;
  }
  
  try {
    const response = await authService.changePassword(
      tempCurrentPassword, 
      tempPassword, 
      tempConfirmPassword
    );
    
    if (response.success) {
      const maskedPassword = '•'.repeat(tempPassword.length);
      setUserPassword(maskedPassword);
      setIsEditingPassword(false);
      setTempPassword('');
      setTempConfirmPassword('');
      setTempCurrentPassword('');
      setIsCurrentPasswordValid(true);
      setValidationErrors({});
      toast.success('Password updated successfully! 🔒');
    }
  } catch (error) {
    console.log('Full error object:', error);
    
    // ✅ Check for message field (for old password incorrect)
    if (error.message) {
      if (error.message.toLowerCase().includes('old password is incorrect')) {
        setIsCurrentPasswordValid(false);
        toast.error('❌ Current password is incorrect');
      } else {
        toast.error(`❌ ${error.message}`);
      }
    }
    // ✅ Check for errors object
    else if (error.errors) {
      if (error.errors.old_password) {
        setIsCurrentPasswordValid(false);
        toast.error(`❌ ${error.errors.old_password[0]}`);
      } else if (error.errors.new_password) {
        setValidationErrors({ new_password: error.errors.new_password });
        toast.error(`❌ ${error.errors.new_password[0]}`);
      } else if (error.errors.non_field_errors) {
        toast.error(`❌ ${error.errors.non_field_errors[0]}`);
      } else {
        const firstKey = Object.keys(error.errors)[0];
        toast.error(`❌ ${error.errors[firstKey][0]}`);
      }
    }
    // ✅ Check for direct string error
    else if (typeof error === 'string') {
      toast.error(`❌ ${error}`);
    }
    else {
      toast.error('❌ Failed to update password');
    }
    console.log('Error object:', error);
console.log('Error type:', typeof error);
console.log('Error keys:', error ? Object.keys(error) : 'null');
  }
};

 const cancelPasswordEdit = () => {
  setIsEditingPassword(false);
  setTempPassword('');
  setTempConfirmPassword('');
  setTempCurrentPassword('');
  setIsCurrentPasswordValid(true);
};

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-blue-100 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar Section with Better Design */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Outer Ring - Gradient Outline */}                  
                  {/* Avatar Image */}
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="relative w-28 h-28 rounded-full object-cover bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-600 shadow-xl "
                    />
                  ) : (
                    <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {/* Camera Overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </motion.div>
                
                {/* Small Decorative Elements */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-emerald-600 shadow-md"></div>
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full border-2 border-emerald-600  shadow-md"></div>
              </div>
              
              {/* Info Section */}
              <div className="flex-1">
                {/* Name with Edit Below */}
               {/* Name with Edit Below */}
<div className="mb-4">
  {isEditingName ? (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="px-4 py-2 border-2 text-xl font-semibold w-80 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          autoFocus
        />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleSaveName} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
          Save
        </button>
        <button onClick={() => setIsEditingName(false)} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          {userName}
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.span>
        </h1>
      </div>
      <button
        onClick={() => setIsEditingName(true)}
        className="text-sm text-blue-600 hover:text-blue-700 mt-1 font-medium"
      >
        Edit Name →
      </button>
    </div>
  )}
</div>
               {/* Email */}
{/* Email */}
<div className="mb-4">
  {isEditingEmail ? (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Mail className="w-5 h-5 text-gray-400" />
        <input
          type="email"
          value={tempNewEmail || userEmail}
          onChange={(e) => setTempNewEmail(e.target.value)}
          placeholder="New email"
          className="px-4 py-2 border-2 border-blue-300 rounded-xl text-base w-80 focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div className="flex items-center gap-2 pl-7">
        <button onClick={handleSaveEmail} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
          Save
        </button>
        <button onClick={cancelEmailEdit} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Mail className="w-5 h-5 text-gray-400" />
      <span className="text-gray-700 text-base">{userEmail}</span>
      <button
  onClick={() => {
     setIsEditingEmail(true);  
    setTempNewEmail(userEmail);
  }}
  className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
>
  <Edit2 className="w-4 h-4 text-gray-500" />
</button>
    </div>
  )}
</div>

                {/* Password */}
           {/* Password */}
{/* Password */}
<div className="mb-4">
  {isEditingPassword ? (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Lock className="w-5 h-5 text-gray-400" />
        <div className="relative flex-1">
          <input
            type={showPassword ? "text" : "password"}
            value={tempCurrentPassword}
            onChange={(e) => {
              setTempCurrentPassword(e.target.value);
              // Reset validation state when user types
              setIsCurrentPasswordValid(true);
            }}
            className={`px-4 py-2 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-base w-80 ${
              !isCurrentPasswordValid ? 'border-red-500' : 'border-blue-300'
            }`}
            placeholder="Current password"
          />
        </div>
      </div>
      
      {/* Show Forgot Password link ONLY if current password is entered and incorrect */}
     {/* Show Forgot Password link ONLY if current password is entered and incorrect */}
{tempCurrentPassword.length > 0 && !isCurrentPasswordValid && (
  <div className="flex justify-self-base pl-7">
    <button
      onClick={() => {
        setIsEditingPassword(false);
        setShowForgotPassword(true);
        setTempCurrentPassword('');
        setTempPassword('');
        setTempConfirmPassword('');
        setIsCurrentPasswordValid(true);
      }}
      className="text-sm text-red-500 hover:text-red-600 transition-all"
    >
      Forgot Password?
    </button>
  </div>
)}
      
     <div className="flex items-center gap-2 pl-7">
  <div className="relative w-80">
    <input
      type={showPassword ? "text" : "password"}
      value={tempPassword}
      onChange={(e) => {
        setTempPassword(e.target.value);
        setValidationErrors({}); // Clear validation errors when user types
      }}
      className={`px-4 py-2 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 text-base w-full ${
        validationErrors.new_password ? 'border-red-500' : 'border-blue-300'
      }`}
      placeholder="New password (min 8 characters)"
    />
    {/* ✅ ADD THIS - Show validation errors below the input */}
    {validationErrors.new_password && (
      <div className="mt-2 space-y-1">
        {validationErrors.new_password.map((err, idx) => (
          <p key={idx} className="text-xs text-red-500">
            • {err}
          </p>
        ))}
      </div>
    )}
  </div>
</div>
      <div className="flex items-center gap-2 pl-7">
        <input
          type={showPassword ? "text" : "password"}
          value={tempConfirmPassword}
          onChange={(e) => setTempConfirmPassword(e.target.value)}
          className="px-4 py-2 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-base w-80"
          placeholder="Confirm new password"
        />
      </div>
      <div className="flex gap-2 pl-7">
        <button onClick={handleSavePassword} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
          Update Password
        </button>
        <button onClick={cancelPasswordEdit} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Lock className="w-5 h-5 text-gray-400" />
      <span className="text-gray-700 text-base">{userPassword}</span>
      <button
        onClick={() => {
          setIsEditingPassword(true);
          setIsCurrentPasswordValid(true);
          setTempCurrentPassword('');
          setTempPassword('');
          setTempConfirmPassword('');
        }}
        className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
      >
        <Edit2 className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )}
</div>

                {/* Badges */}
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" /> Property Enthusiast
                  </span>
                 <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
  Member since {formatMemberSince(userMemberSince)}
</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full flex items-center gap-1">
                    <Camera className="w-3 h-3" /> {predictions.length} Predictions
                  </span>
                </div>
              </div>

              {/* Stats Card - Only Total Predictions */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl px-8 py-5 text-center shadow-lg min-w-[140px]">
                <div className="text-4xl font-bold text-white">{predictions.length}</div>
                <div className="text-sm text-white/80 mt-1">Total Predictions</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Saved Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-blue-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <Home className="w-7 h-7 text-emerald-600" />
            <h2 className="text-3xl font-semibold text-gray-800">Saved Predictions</h2>
          </div>

          {predictions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <User className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-600 text-xl mb-6">No predictions saved yet</p>
              <a href="/predict">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
                >
                  Make Your First Prediction →
                </motion.button>
              </a>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {predictions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((prediction, index) => (
                    <motion.div
                      key={prediction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:border-emerald-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            <span className="font-bold text-xl text-gray-900">{prediction.area}</span>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-semibold">
                              {prediction.marla} Marla
                            </span>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Bedrooms:</span>
                              <span className="font-bold text-gray-900">{prediction.bedrooms}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Bathrooms:</span>
                              <span className="font-bold text-gray-900">{prediction.bathrooms}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Kitchen:</span>
                              <span className="font-bold text-gray-900">{prediction.kitchen}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {prediction.hasGarage && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                🚗 Garage
                              </span>
                            )}
                            {prediction.hasGarden && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                🌳 Garden
                              </span>
                            )}
                            {prediction.hasRoofAccess && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                🏠 Roof Access
                              </span>
                            )}
                            {prediction.furnished && (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                ✨ Furnished
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-6">
                            <div>
                              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                PKR {(prediction.predictedPrice / 10000000).toFixed(2)} Cr
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {(prediction.pricePerMarla / 100000).toFixed(1)} Lakh per Marla
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                            <Calendar className="w-4 h-4" />
                            {new Date(prediction.date).toLocaleDateString('en-PK', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeletePrediction(prediction.id)}
                          className="ml-4 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete prediction"
                        >
                          <Trash2 className="w-6 h-6" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
        {/* Forgot Password Modal */}
<ForgotPasswordModal 
  isOpen={showForgotPassword} 
  onClose={() => setShowForgotPassword(false)} 
/>
      </div>
    </div>
  );
}
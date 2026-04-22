import { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/navbar';
import { 
  User, Trash2, MapPin, Home, Calendar, Award, Sparkles, Camera,
  Mail, Lock, Eye, EyeOff, CheckCircle, Edit2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';

export default function UserProfile() {
  const [predictions, setPredictions] = useState([]);
  const [userName, setUserName] = useState('Guest User');
  const [userEmail, setUserEmail] = useState('guest@example.com');
  const [userPassword, setUserPassword] = useState('••••••••');
  const [userAvatar, setUserAvatar] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [tempConfirmPassword, setTempConfirmPassword] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedPredictions = localStorage.getItem('predictions');
    if (savedPredictions) {
      setPredictions(JSON.parse(savedPredictions));
    }

    const savedName = localStorage.getItem('userName');
    if (savedName) setUserName(savedName);
    
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) setUserEmail(savedEmail);
    
    const savedPassword = localStorage.getItem('userPassword');
    if (savedPassword) setUserPassword(savedPassword);

    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setUserAvatar(savedAvatar);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setUserAvatar(imageUrl);
        localStorage.setItem('userAvatar', imageUrl);
        toast.success('Profile picture updated! 🎉');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePrediction = (id) => {
    const updatedPredictions = predictions.filter((p) => p.id !== id);
    setPredictions(updatedPredictions);
    localStorage.setItem('predictions', JSON.stringify(updatedPredictions));
    toast.success('Prediction deleted successfully!');
  };

  const handleSaveName = () => {
    if (userName.trim() === '') {
      toast.error('Name cannot be empty');
      return;
    }
    localStorage.setItem('userName', userName);
    setIsEditingName(false);
    toast.success(`Name updated to ${userName}! 🎉`);
  };

  const handleSaveEmail = () => {
    if (userEmail.trim() === '') {
      toast.error('Email cannot be empty');
      return;
    }
    if (!userEmail.includes('@') || !userEmail.includes('.')) {
      toast.error('Please enter a valid email address');
      return;
    }
    localStorage.setItem('userEmail', userEmail);
    setIsEditingEmail(false);
    toast.success(`Email updated to ${userEmail}! 📧`);
  };

  const handleSavePassword = () => {
    if (tempPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (tempPassword !== tempConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const maskedPassword = '•'.repeat(tempPassword.length);
    setUserPassword(maskedPassword);
    localStorage.setItem('userPassword', tempPassword);
    setIsEditingPassword(false);
    setTempPassword('');
    setTempConfirmPassword('');
    toast.success('Password updated successfully! 🔒');
  };

  const cancelPasswordEdit = () => {
    setIsEditingPassword(false);
    setTempPassword('');
    setTempConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Toaster position="top-center" richColors />
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
                <div className="mb-4">
                  {isEditingName ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="px-4 py-2 border-2 text-xl font-semibold w-80"
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
                <div className="mb-4">
                  {isEditingEmail ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="px-4 py-2 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-base w-80"
                        />
                      </div>
                      <div className="flex items-center gap-2 pl-7">
                        <button onClick={handleSaveEmail} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
                          Save
                        </button>
                        <button onClick={() => setIsEditingEmail(false)} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 text-base">{userEmail}</span>
                      <button
                        onClick={() => setIsEditingEmail(true)}
                        className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  {isEditingPassword ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={tempPassword}
                            onChange={(e) => setTempPassword(e.target.value)}
                            className="px-4 py-2 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-base w-80"
                            placeholder="New password (min 6 characters)"
                          />
                          <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
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
                        <button onClick={handleSavePassword} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">Update</button>
                        <button onClick={cancelPasswordEdit} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700 text-base">{userPassword}</span>
                      <button
                        onClick={() => setIsEditingPassword(true)}
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
                    Member since 2024
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
      </div>
    </div>
  );
}
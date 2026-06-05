import { Toaster, toast } from 'sonner';
import { 
  TrendingUp, Home, Sparkles, CheckCircle, Bed, Bath, Calendar, Ruler, MapPin,
  Users, Archive, Gem, Layers, Building2, Dumbbell, BookOpen, Sofa, 
  UtensilsCrossed, Trees, Waves, Zap, Armchair, CornerDownRight, 
  Activity, ClipboardList, SquareParking, Save, DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/navbar';
import { useState, useEffect } from 'react';  // ← Add useEffect
import { listingService, predictionService } from '../../services/services';
import { useNavigate } from 'react-router-dom';
import { usePredictionViewModel } from '../../viewmodels/usePredictionViewModel';

const HousePricePredictor = () => {
   const navigate = useNavigate();
  
  // 1. FIRST - Declare houseData state
  const [houseData, setHouseData] = useState({
    area: '',
    marla: '',
    bedrooms: '',
    bathrooms: '',
    kitchens: '',
    built_year: '',
    number_of_floors: '',
    servant_quarters: '',
    store_rooms: '',
    furnished: false,
    gym: false,
    study_room: false,
    drawing_room: false,
    dining_room: false,
    lawn_garden: false,
    swimming_pool: false,
    electricity_backup: false,
    lounge_sitting: false,
    is_corner: false,
    facing_park: false,
  });

  // 2. SECOND - Other state declarations
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    area: '',
    marla: '',
    bedrooms: '',
    bathrooms: '',
    kitchens: '',
    built_year: '',
  });
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  
  // 3. THIRD - ViewModel hook
  const { getPrediction } = usePredictionViewModel();

  const handleSavePrediction = async () => {
  if (!prediction) {
    toast.error('No prediction to save');
    return;
  }
  
  try {
    const inputData = {
      location: houseData.area,
      area_marla: parseFloat(houseData.marla),
      bedrooms: parseInt(houseData.bedrooms),
      bathrooms: parseInt(houseData.bathrooms),
      kitchens: parseInt(houseData.kitchens),
      construction_year: parseInt(houseData.built_year),
      number_of_floors: parseInt(houseData.number_of_floors) || 1,
      servant_rooms: parseInt(houseData.servant_quarters) || 0,
      store_rooms: parseInt(houseData.store_rooms) || 0,
      is_furnished: houseData.furnished,
      has_gym: houseData.gym,
      has_study_room: houseData.study_room,
      has_drawing_room: houseData.drawing_room,
      has_dining_room: houseData.dining_room,
      has_lawn: houseData.lawn_garden,
      has_swimming_pool: houseData.swimming_pool,
      has_electricity_backup: houseData.electricity_backup,
      has_lounge: houseData.lounge_sitting,
      is_corner_plot: houseData.is_corner,
      is_facing_park: houseData.facing_park,
    };
    
    const predictionResult = {
      estimated_market_value: prediction.estimated_market_value,
      low_estimate: prediction.low_estimate,
      high_estimate: prediction.high_estimate,
      confidence_percentage: prediction.confidence_percentage,
      market_trend: prediction.market_trend,
      key_factors: prediction.key_factors,
      per_marla_rate: prediction.per_marla_rate,
    };
    
    const response = await predictionService.savePrediction(predictionResult, inputData);
    
    if (response.success) {
      toast.success('Prediction saved successfully!');
    } else {
      toast.error(response.message || 'Failed to save prediction');
    }
  } catch (error) {
    console.error('Save prediction error:', error);
    toast.error(error.message || 'Failed to save prediction');
  }
};


const validateField = (field, value) => {
  const newErrors = { ...errors };
  
  if (field === 'area' && (!value || value === '')) {
    newErrors.area = 'Please fill in the location field';
  } else if (field === 'area') {
    delete newErrors.area;
  }
  
  if (field === 'marla' && (!value || value === '')) {
    newErrors.marla = 'Please fill in the marla field';
  } else if (field === 'marla') {
    delete newErrors.marla;
  }
  
  if (field === 'bedrooms' && (!value || value === '')) {
    newErrors.bedrooms = 'Please fill in the bedroom field';
  } else if (field === 'bedrooms') {
    delete newErrors.bedrooms;
  }
  
  if (field === 'bathrooms' && (!value || value === '')) {
    newErrors.bathrooms = 'Please fill in the bathroom field';
  } else if (field === 'bathrooms') {
    delete newErrors.bathrooms;
  }
  
  if (field === 'kitchens' && (!value || value === '')) {
    newErrors.kitchens = 'Please fill in the kitchen field';
  } else if (field === 'kitchens') {
    delete newErrors.kitchens;
  }
  
  if (field === 'built_year' && (!value || value === '')) {
    newErrors.built_year = 'Please fill in the construction year field';
  } else if (field === 'built_year') {
    delete newErrors.built_year;
  }
  
  setErrors(newErrors);
};

const handleChange = (field, value) => {
  setHouseData(prev => ({ ...prev, [field]: value }));
  validateField(field, value);
};
// Fetch locations from database
useEffect(() => {
  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await listingService.getLocations();
      if (response.success && response.data) {
        setLocations(response.data);
      } else if (response.data && Array.isArray(response.data)) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoadingLocations(false);
    }
  };
  fetchLocations();
}, []);
  // Lahore areas list
  const lahoreAreas = [
    'DHA Phase 1', 'DHA Phase 2', 'DHA Phase 3', 'DHA Phase 4', 'DHA Phase 5',
    'DHA Phase 6', 'DHA Phase 7', 'DHA Phase 8', 'Bahria Town', 'Bahria Orchard',
    'Johar Town', 'Gulberg', 'Model Town', 'Faisal Town', 'Garden Town',
    'Wapda Town', 'Cantt', 'Iqbal Town', 'Allama Iqbal Town', 'Township'
  ];

  // Helper function to handle numeric input changes with validation
  const handleNumericChange = (field, min, max) => (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    if (value < min) value = min;
    if (value > max) value = max;
    setHouseData(prev => ({ ...prev, [field]: value }));
  };

 const handlePredict = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    toast.error('Please login first to predict price');
    setTimeout(() => {
      window.location.href = 'http://localhost:5173/sign_in'; 
    }, 1500);
    return;
  }

  if (!houseData.area || !houseData.marla || !houseData.bedrooms || 
      !houseData.bathrooms || !houseData.kitchens || !houseData.built_year) {
    toast.error('Please fill in all required fields');
    return;
  }

  setIsLoading(true);
  
  try {
    const requestData = {
      location: houseData.area, 
      area_marla: parseFloat(houseData.marla),
      bedrooms: parseInt(houseData.bedrooms),
      bathrooms: parseInt(houseData.bathrooms),
      kitchens: parseInt(houseData.kitchens),
      construction_year: parseInt(houseData.built_year),
      number_of_floors: parseInt(houseData.number_of_floors) || 1,
      servant_quarters: parseInt(houseData.servant_quarters) || 0,
      store_rooms: parseInt(houseData.store_rooms) || 0,
      furnished: houseData.furnished,
      gym: houseData.gym,
      study_room: houseData.study_room,
      drawing_room: houseData.drawing_room,
      dining_room: houseData.dining_room,
      lawn_garden: houseData.lawn_garden,
      swimming_pool: houseData.swimming_pool,
      electricity_backup: houseData.electricity_backup,
      lounge_sitting_room: houseData.lounge_sitting,
      corner_plot: houseData.is_corner,
      facing_park: houseData.facing_park,
    };
    
    const result = await getPrediction(requestData);
    
    // ✅ ADD THIS: Log the result to see what's coming back
    console.log('Full API Response:', result);
    
    // ✅ FIX: Check if result exists and has the expected structure
    if (!result) {
      throw new Error('No data received from server');
    }
    
    // Handle different response structures
    let predictionData;
    if (result.estimated_market_value) {
      // Direct response
      predictionData = result;
    } else if (result.data && result.data.estimated_market_value) {
      // Nested response
      predictionData = result.data;
    } else if (result.success && result.data) {
      // Success wrapper response
      predictionData = result.data;
    } else {
      console.error('Unexpected response structure:', result);
      throw new Error('Invalid response format from server');
    }
    
    // Set the prediction state
    setPrediction(predictionData);
    toast.success('Prediction completed successfully!');
  } catch (error) {
    console.error('Prediction error details:', error);
    toast.error(error.message || 'Failed to predict price. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `PKR ${(price / 10000000).toFixed(2)} Cr`;
    }
    return `PKR ${new Intl.NumberFormat('en-PK').format(price)}`;
  };

  const formatPriceShort = (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)} Cr`;
    }
    if (price >= 100000) {
      return `${(price / 100000).toFixed(1)} Lakh`;
    }
    return `${(price / 1000).toFixed(0)}k`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <Toaster position="top-center" richColors />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-10 h-10 text-emerald-600" />
            </motion.div>
            <h1 className="text-5xl font-bold text-gray-900">House Price Predictor</h1>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <TrendingUp className="w-10 h-10 text-emerald-600" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-600">Enter property specifications to predict market value in Lahore</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Property Details Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
              <h2 className="text-xl font-semibold flex items-center gap-3 text-white">
                <Home className="w-5 h-5" />
                Property Details
              </h2>
              <p className="text-emerald-100 mt-1 text-sm">
                Enter the details of the house you want to predict the price for
              </p>
            </div>
            
            <div className="p-6 space-y-5">
              
              {/* Area/Location Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Location / Area *
                </label>
                <select
                  value={houseData.area}
                  onChange={(e) => setHouseData(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 caret-emerald-600 transition-all"
                >
                  <option value="">Select Area</option>
                  {lahoreAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Property Size */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Ruler className="w-4 h-4 text-emerald-600" />
                  Property Size (Marla) *
                </label>
                <input
  type="number"
  placeholder="Enter the marla"
  value={houseData.marla}
  onChange={(e) => handleChange('marla', e.target.value)}
  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
    errors.marla ? 'border-red-500' : 'border-gray-300'
  }`}
/>
{errors.marla && <p className="text-red-500 text-sm">{errors.marla}</p>}
              </div>

              {/* Rooms */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Bed className="w-4 h-4 text-emerald-600" />
                    Bedrooms *
                  </label>
                 <input
  type="number"
  placeholder="Enter the bedroom"
  value={houseData.bedrooms}
  onChange={(e) => handleChange('bedrooms', e.target.value)}
  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
    errors.bedrooms ? 'border-red-500' : 'border-gray-300'
  }`}
/>
{errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms}</p>}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Bath className="w-4 h-4 text-emerald-600" />
                    Bathrooms *
                  </label>
                 <input
  type="number"
  placeholder="Enter the bathroom"
  value={houseData.bathrooms}
  onChange={(e) => handleChange('bathrooms', e.target.value)}
  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
    errors.bathrooms ? 'border-red-500' : 'border-gray-300'
  }`}
/>
{errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms}</p>}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Home className="w-4 h-4 text-emerald-600" />
                    Kitchens *
                  </label>
                 <input
  type="number"
  placeholder="Enter the kitchen"
  value={houseData.kitchens}
  onChange={(e) => handleChange('kitchens', e.target.value)}
  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
    errors.kitchens ? 'border-red-500' : 'border-gray-300'
  }`}
/>
{errors.kitchens && <p className="text-red-500 text-sm">{errors.kitchens}</p>}
                </div>
              </div>

              {/* Construction */}
             <div className="grid grid-cols-2 gap-4">
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Calendar className="w-4 h-4 text-emerald-600" />
      Year Built *
    </label>
   <input
  type="number"
  placeholder="Enter the construction year"
  value={houseData.built_year}
  onChange={(e) => handleChange('built_year', e.target.value)}
  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
    errors.built_year ? 'border-red-500' : 'border-gray-300'
  }`}
/>
{errors.built_year && <p className="text-red-500 text-sm">{errors.built_year}</p>}
  </div>

  <div className="space-y-3">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Building2 className="w-4 h-4 text-emerald-600" />
      Number of Floors
    </label>
    <input
  type="number"
  placeholder="Enter the number of floors"
  value={houseData.number_of_floors}
  onChange={(e) => handleChange('number_of_floors', e.target.value)}
  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
/>
  </div>
</div>
              {/* Additional Rooms - With Icons */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users className="w-4 h-4 text-emerald-600" />
                      Servant Quarters 
                    </label>
                   <select
                    value={houseData.servant_quarters}
onChange={(e) => setHouseData(prev => ({ ...prev, servant_quarters: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 caret-emerald-600 transition-all"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Archive className="w-4 h-4 text-emerald-600" />
                      Store Rooms
                    </label>
                   <select
                    value={houseData.store_rooms}
                    onChange={(e) => setHouseData(prev => ({ ...prev, store_rooms: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 caret-emerald-600 transition-all"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  </div>
                </div>

              {/* Amenities - With Icons */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Gem className="w-4 h-4 text-emerald-600" />
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.furnished}
                      onChange={(e) => setHouseData(prev => ({ ...prev, furnished: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Furnished</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.gym}
                      onChange={(e) => setHouseData(prev => ({ ...prev, gym: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <Dumbbell className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Gym</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.study_room}
                      onChange={(e) => setHouseData(prev => ({ ...prev, study_room: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Study Room</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.drawing_room}
                      onChange={(e) => setHouseData(prev => ({ ...prev, drawing_room: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <Sofa className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Drawing Room</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.dining_room}
                      onChange={(e) => setHouseData(prev => ({ ...prev, dining_room: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Dining Room</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.lawn_garden}
                      onChange={(e) => setHouseData(prev => ({ ...prev, lawn_garden: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <Trees className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Lawn / Garden</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.swimming_pool}
                      onChange={(e) => setHouseData(prev => ({ ...prev, swimming_pool: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <Waves className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Swimming Pool</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.electricity_backup}
                      onChange={(e) => setHouseData(prev => ({ ...prev, electricity_backup: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <Zap className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Electricity Backup</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.lounge_sitting}
                      onChange={(e) => setHouseData(prev => ({ ...prev, lounge_sitting: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <Armchair className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Lounge / Sitting Area</span>
                  </label>
                </div>
              </div>

              {/* Special Features - With Icons */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Special Features
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.is_corner}
                      onChange={(e) => setHouseData(prev => ({ ...prev, is_corner: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <CornerDownRight className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Corner Plot</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.facing_park}
                      onChange={(e) => setHouseData(prev => ({ ...prev, facing_park: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    {/* <SquareParking className="w-3.5 h-3.5 text-emerald-500" /> */}
                    <span className="text-sm text-gray-700">Facing Park</span>
                  </label>
                 
                </div>
              </div>

              {/* Predict Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePredict} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:shadow-xl transition-all font-semibold text-lg flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing Data...
                  </div>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Predict Price
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Price Prediction Results */}
        {/* Right Column - Price Prediction Results */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.1 }}
  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100"
>
  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-3 text-white">
          <TrendingUp className="w-5 h-5" />
          Price Prediction
        </h2>
        <p className="text-emerald-100 mt-1 text-sm">
          Estimated market value based on the provided details
        </p>
      </div>
      {prediction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSavePrediction}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-white"
        >
          <Save className="w-4 h-4" />
          Save Prediction
        </motion.button>
      )}
    </div>
  </div>
  
  <div className="p-6">
    {!prediction && !isLoading && (
      <div className="text-center py-12 text-gray-500">
        <Home className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
        <p className="text-lg">Fill in the property details and click "Predict Price" to see the estimated market value.</p>
      </div>
    )}

    {isLoading && (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Analyzing property data...</p>
        <p className="text-sm text-gray-400 mt-2">Using AI-powered market analysis</p>
      </div>
    )}

    {prediction && (
      <div className="space-y-6">
        <div className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
          <div className="text-4xl font-bold text-emerald-600 mb-2">
            {formatPrice(prediction.estimated_market_value)}
          </div>
          <p className="text-gray-600">Estimated Market Value</p>
          <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 rounded-full text-sm text-emerald-700">
            <CheckCircle className="w-3 h-3" />
            <span>{Math.round(prediction.confidence_percentage)}% Confidence</span>
          </div>
        </div>

        {prediction.market_trend && (
          <div className="text-center p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="font-semibold">🏠 Market Segment: {prediction.market_trend}</span>
          </div>
        )}

        <div className="border-t border-gray-200"></div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Price Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-xl font-bold text-emerald-600">
                {formatPriceShort(prediction.low_estimate)}
              </div>
              <p className="text-sm text-gray-500 mt-1">Low Estimate</p>
            </div>
            <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-xl font-bold text-emerald-600">
                {formatPriceShort(prediction.high_estimate)}
              </div>
              <p className="text-sm text-gray-500 mt-1">High Estimate</p>
            </div>
          </div>
        </div>

        {prediction.per_marla_rate && (
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Rate Analysis</h3>
            <p className="text-gray-700">Rate per Marla: <span className="font-bold text-emerald-600">{formatPrice(prediction.per_marla_rate)}</span></p>
          </div>
        )}

        {prediction.key_factors && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Key Factors</h3>
            <div className="space-y-2">
              {prediction.key_factors.split('; ').map((factor, idx) => (
                <div key={idx} className="p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg border border-gray-200">
          * This is an estimated value based on AI analysis of Lahore market data. Actual market conditions may vary.
        </div>
      </div>
    )}


              {prediction && (
  <div className="space-y-6">
    {/* Main Price Display */}
    <div className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
      <div className="text-4xl font-bold text-emerald-600 mb-2">
        {formatPrice(prediction.estimated_market_value)}
      </div>
      <p className="text-gray-600">Estimated Market Value</p>
      <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 rounded-full text-sm text-emerald-700">
        <CheckCircle className="w-3 h-3" />
        <span>{Math.round(prediction.confidence_percentage)}% Confidence</span>
      </div>
    </div>

    {/* Market Trend Indicator - Updated to use market_trend */}
    {prediction.market_trend && (
      <div className="text-center p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="font-semibold">
          🏠 Market Segment: {prediction.market_trend}
        </span>
      </div>
    )}

    {/* Separator */}
    <div className="border-t border-gray-200"></div>

    {/* Price Range - Updated to use low_estimate and high_estimate */}
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Price Range</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-xl font-bold text-emerald-600">
            {formatPriceShort(prediction.low_estimate)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Low Estimate</p>
        </div>
        <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-xl font-bold text-emerald-600">
            {formatPriceShort(prediction.high_estimate)}
          </div>
          <p className="text-sm text-gray-500 mt-1">High Estimate</p>
        </div>
      </div>
    </div>

    {/* Per Marla Rate - New section */}
    {prediction.per_marla_rate && (
      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Rate Analysis</h3>
        <p className="text-gray-700">
          Rate per Marla: <span className="font-bold text-emerald-600">{formatPrice(prediction.per_marla_rate)}</span>
        </p>
      </div>
    )}

    {/* Key Factors - Updated to handle key_factors string */}
    {/* {prediction.key_factors && (
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Key Factors</h3>
        <div className="space-y-2">
          {prediction.key_factors.split('; ').map((factor, idx) => (
            <div key={idx} className="p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{factor}</span>
            </div>
          ))}
        </div>
      </div>
    )} */}

    {/* Prediction ID for reference */}
    {/* {prediction.prediction_id && (
      <div className="text-xs text-gray-400 text-center">
        Prediction ID: {prediction.prediction_id}
      </div>
    )} */}

    {/* Selected Features Display */}
    {(houseData.furnished || houseData.gym || houseData.study_room || houseData.drawing_room || houseData.dining_room || houseData.lawn_garden || houseData.swimming_pool || houseData.electricity_backup || houseData.lounge_sitting || houseData.is_corner || houseData.facing_park || houseData.servant_quarters > 0 || houseData.store_rooms > 0) && (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Selected Features</h3>
        <div className="flex flex-wrap gap-2">
          {houseData.servant_quarters > 0 && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">{houseData.servant_quarters} Servant Quarters</span>}
          {houseData.store_rooms > 0 && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">{houseData.store_rooms} Store Rooms</span>}
          {houseData.furnished && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Furnished</span>}
          {houseData.gym && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Gym</span>}
          {houseData.study_room && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Study Room</span>}
          {houseData.drawing_room && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Drawing Room</span>}
          {houseData.dining_room && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Dining Room</span>}
          {houseData.lawn_garden && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Lawn/Garden</span>}
          {houseData.swimming_pool && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Swimming Pool</span>}
          {houseData.electricity_backup && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Electricity Backup</span>}
          {houseData.lounge_sitting && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Lounge/Sitting</span>}
          {houseData.is_corner && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Corner Plot</span>}
          {houseData.facing_park && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Facing Park</span>}
          {houseData.number_of_floors > 0 && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">{houseData.number_of_floors} Floors</span>}
        </div>
      </div>
    )}

    {/* Disclaimer */}
    <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg border border-gray-200">
      * This is an estimated value based on AI analysis of Lahore market data.
      Actual market conditions may vary.
    </div>
  </div>
)}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HousePricePredictor;
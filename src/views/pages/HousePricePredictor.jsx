import { Toaster, toast } from 'sonner';
import { 
  TrendingUp, Home, Sparkles, CheckCircle, Bed, Bath, Calendar, Ruler, MapPin,
  Users, Archive, Gem, Layers, Building2, Dumbbell, BookOpen, Sofa, 
  UtensilsCrossed, Trees, Waves, Zap, Armchair, CornerDownRight, 
  Activity, ClipboardList, SquareParking, Save, DollarSign,ChevronDown 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/navbar';
import { useState, useEffect, useRef } from 'react';  // ← Add useEffect
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

  // Add these new state variables after prediction state (around line 30)
const [showViewButton, setShowViewButton] = useState(false);  // Controls button visibility
const [viewingProperties, setViewingProperties] = useState(false);  // Loading state
const [filteredProperties, setFilteredProperties] = useState([]);  // Properties from API
const [showPropertyModal, setShowPropertyModal] = useState(false);  // Modal visibility

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

  const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all bg-white text-left flex justify-between items-center"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-emerald-50 transition-colors ${
                option.value === value ? "bg-emerald-100 text-emerald-700" : "text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

  // Fetch properties within predicted price range
const handleViewPropertiesInRange = async () => {
  if (!prediction) return;
  
  setViewingProperties(true);
  
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('Please login to view properties');
      return;
    }
    
    // Call your backend API with min and max price
    const response = await fetch(
      `http://127.0.0.1:8000/api/listings/filter-by-price/?min_price=${prediction.low_estimate}&max_price=${prediction.high_estimate}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.success && data.data) {
      setFilteredProperties(data.data);
      setShowPropertyModal(true);
      
      if (data.data.length === 0) {
        toast.info('No properties found in this price range');
      } else {
        toast.success(`Found ${data.data.length} properties in this range`);
      }
    } else {
      toast.error(data.message || 'Failed to fetch properties');
    }
  } catch (error) {
    console.error('Error fetching properties:', error);
    toast.error('Failed to fetch properties. Please try again.');
  } finally {
    setViewingProperties(false);
  }
};

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
    newErrors.area = 'Please select a location';
  } else if (field === 'area') {
    delete newErrors.area;
  }
  
  if (field === 'marla' && (!value || value === '')) {
    newErrors.marla = 'Please enter property size';
  } else if (field === 'marla' && (parseFloat(value) <= 0)) {
    newErrors.marla = 'Marla size must be greater than 0';
  } else if (field === 'marla') {
    delete newErrors.marla;
  }
  
  if (field === 'bedrooms' && (!value || value === '')) {
    newErrors.bedrooms = 'Please enter number of bedrooms';
  } else if (field === 'bedrooms' && (parseInt(value) <= 0)) {
    newErrors.bedrooms = 'Bedrooms must be at least 1';
  } else if (field === 'bedrooms') {
    delete newErrors.bedrooms;
  }
  
  if (field === 'bathrooms' && (!value || value === '')) {
    newErrors.bathrooms = 'Please enter number of bathrooms';
  } else if (field === 'bathrooms' && (parseInt(value) <= 0)) {
    newErrors.bathrooms = 'Bathrooms must be at least 1';
  } else if (field === 'bathrooms') {
    delete newErrors.bathrooms;
  }
  
  if (field === 'kitchens' && (!value || value === '')) {
    newErrors.kitchens = 'Please enter number of kitchens';
  } else if (field === 'kitchens' && (parseInt(value) <= 0)) {
    newErrors.kitchens = 'Kitchens must be at least 1';
  } else if (field === 'kitchens') {
    delete newErrors.kitchens;
  }
  
  if (field === 'built_year' && (!value || value === '')) {
    newErrors.built_year = 'Please enter construction year';
  } else if (field === 'built_year') {
    const currentYear = new Date().getFullYear();
    const year = parseInt(value);
    if (year < 1990 || year > currentYear + 1) {
      newErrors.built_year = `Year must be between 1990 and ${currentYear + 1}`;
    } else {
      delete newErrors.built_year;
    }
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

  // Validate required fields
  let hasError = false;
  const newErrors = {};

  if (!houseData.area || houseData.area === '') {
    newErrors.area = 'Please select a location';
    hasError = true;
  }
  if (!houseData.marla || houseData.marla === '') {
    newErrors.marla = 'Please enter property size (Marla)';
    hasError = true;
  }
  if (!houseData.bedrooms || houseData.bedrooms === '') {
    newErrors.bedrooms = 'Please enter number of bedrooms';
    hasError = true;
  }
  if (!houseData.bathrooms || houseData.bathrooms === '') {
    newErrors.bathrooms = 'Please enter number of bathrooms';
    hasError = true;
  }
  if (!houseData.kitchens || houseData.kitchens === '') {
    newErrors.kitchens = 'Please enter number of kitchens';
    hasError = true;
  }
  if (!houseData.built_year || houseData.built_year === '') {
    newErrors.built_year = 'Please enter construction year';
    hasError = true;
  }

  if (hasError) {
    setErrors(newErrors);
    // Show first error as toast
    const firstError = Object.values(newErrors)[0];
    toast.error(firstError);
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
    
    console.log('Full API Response:', result);
    
    if (!result) {
      throw new Error('No data received from server');
    }
    
    let predictionData;
    if (result.estimated_market_value) {
      predictionData = result;
    } else if (result.data && result.data.estimated_market_value) {
      predictionData = result.data;
    } else if (result.success && result.data) {
      predictionData = result.data;
    } else {
      console.error('Unexpected response structure:', result);
      throw new Error('Invalid response format from server');
    }
    
    setPrediction(predictionData);
    setShowViewButton(true);
    toast.success('Prediction completed successfully!');
  } catch (error) {
    console.error('Prediction error details:', error);
    
    // Handle field-specific errors from backend
    if (error.errors) {
      const fieldErrors = {};
      const backendErrors = error.errors;
      
      // Map backend field names to frontend field names
      if (backendErrors.location) {
        fieldErrors.area = backendErrors.location[0];
      }
      if (backendErrors.area_marla) {
        fieldErrors.marla = backendErrors.area_marla[0];
      }
      if (backendErrors.bedrooms) {
        fieldErrors.bedrooms = backendErrors.bedrooms[0];
      }
      if (backendErrors.bathrooms) {
        fieldErrors.bathrooms = backendErrors.bathrooms[0];
      }
      if (backendErrors.kitchens) {
        fieldErrors.kitchens = backendErrors.kitchens[0];
      }
      if (backendErrors.construction_year) {
        fieldErrors.built_year = backendErrors.construction_year[0];
      }
      
      setErrors(fieldErrors);
      
      // Show the first error as toast
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) {
        toast.error(firstError);
      } else {
        toast.error(error.message || 'Failed to predict price');
      }
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('Failed to predict price. Please try again.');
    }
    
    setShowViewButton(false);
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
  {(() => {
    const areaOptions = lahoreAreas.map(area => ({
      value: area,
      label: area
    }));
    
    return (
      <CustomDropdown
        options={areaOptions}
        value={houseData.area}
        onChange={(value) => setHouseData(prev => ({ ...prev, area: value }))}
        placeholder="Select Area"
      />
    );
  })()}
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
    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 caret-emerald-500 ${
      errors.bathrooms ? 'border-red-500' : 'border-gray-300'
    }`}
  />
  {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
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
      {/* Save Prediction Button - Moved to bottom section */}
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
        {/* Main Price Display */}
        <div className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-xl border border-emerald-200">
          <div className="text-4xl font-bold text-emerald-600 mb-1">
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
          <div className="text-center p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
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
            <div className="text-center bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div className="text-xl font-bold text-emerald-600">
                {formatPriceShort(prediction.low_estimate)}
              </div>
              <p className="text-sm text-gray-500 mt-1">Low Estimate</p>
            </div>
            <div className="text-center bg-gray-50 p-2 rounded-lg border border-gray-200">
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
            <h3 className="text-lg font-semibold mb-1 text-gray-800">Rate Analysis</h3>
            <p className="text-gray-700">
              Rate per Marla: <span className="font-bold text-emerald-600">{formatPrice(prediction.per_marla_rate)}</span>
            </p>
          </div>
        )}

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

          {/* BUTTON SECTION - Added here */}
        <div className="flex gap-3 ">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSavePrediction}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Prediction
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewPropertiesInRange}
            disabled={viewingProperties}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {viewingProperties ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Home className="w-4 h-4" />
            )}
            View Properties
          </motion.button>
        </div>

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
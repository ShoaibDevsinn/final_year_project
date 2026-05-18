// src/views/pages/HousePricePredictor.jsx
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  TrendingUp, Home, Sparkles, CheckCircle, Bed, Bath, Calendar, Ruler, MapPin,
  Users, Archive, Gem, Layers, Building2, Dumbbell, BookOpen, Sofa, 
  UtensilsCrossed, Trees, Waves, Zap, Armchair, CornerDownRight, 
  Activity, ClipboardList, SquareParking
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/navbar';
import { usePredictionViewModel } from '../../viewmodels/usePredictionViewModel';

const HousePricePredictor = () => {
  // Form state
  const [houseData, setHouseData] = useState({
    area: '',
    marla: '',
    bedrooms: '',
    bathrooms: '',
    number_of_floors: '',
    severant_quarters: '',
    store_rooms: '',
    kitchens: '',
    built_year: '',
    servant_quarters: 0,
    store_rooms: 0,
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
    num_floors: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // ViewModel for prediction
  const { getPrediction } = usePredictionViewModel();

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
    // Validation
    if (!houseData.area || !houseData.marla || !houseData.bedrooms || 
        !houseData.bathrooms || !houseData.kitchens || !houseData.built_year) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create a mock house object for prediction
      const mockHouse = {
        id: 'predict',
        title: 'Property for Prediction',
        location: 'Lahore',
        area: houseData.area,
        marla: parseInt(houseData.marla),
        bedrooms: parseInt(houseData.bedrooms),
        bathrooms: parseInt(houseData.bathrooms),
        number_of_floors: parseInt(houseData.number_of_floors),
        severant_quarters: parseInt(houseData.severant_quarters),
        store_rooms: parseInt(houseData.store_rooms),   
        kitchen: parseInt(houseData.kitchens),
        hasGarage: houseData.hasGarage,
        hasGarden: houseData.lawn_garden,
        hasRoofAccess: houseData.hasRoofAccess,
        furnished: houseData.furnished,
        price: 0,
        pricePerMarla: 0,
        description: '',
        image: '',
        yearBuilt: parseInt(houseData.built_year),
        features: [],
        servant_quarters: houseData.servant_quarters,
        store_rooms: houseData.store_rooms,
        gym: houseData.gym,
        study_room: houseData.study_room,
        drawing_room: houseData.drawing_room,
        dining_room: houseData.dining_room,
        swimming_pool: houseData.swimming_pool,
        electricity_backup: houseData.electricity_backup,
        lounge_sitting: houseData.lounge_sitting,
        is_corner: houseData.is_corner,
        facing_park: houseData.facing_park,
        num_floors: houseData.num_floors,
      };
      
      const result = await getPrediction(mockHouse);
      setPrediction(result);
      toast.success('Prediction completed successfully!');
    } catch (error) {
      toast.error('Failed to predict price. Please try again.');
      console.error(error);
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
                <select
                  value={houseData.marla}
                  onChange={(e) => setHouseData(prev => ({ ...prev, marla: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 caret-emerald-600 transition-all"
                >
                  <option value="">Select Marla</option>
                  {[3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(num => (
                    <option key={num} value={num}>{num} Marla</option>
                  ))}
                </select>
              </div>

              {/* Rooms */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Bed className="w-4 h-4 text-emerald-600" />
                    Bedrooms *
                  </label>
                  <select
                    value={houseData.bedrooms}
                    onChange={(e) => setHouseData(prev => ({ ...prev, bedrooms: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 caret-emerald-600 transition-all"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Bath className="w-4 h-4 text-emerald-600" />
                    Bathrooms *
                  </label>
                  <select
                    value={houseData.bathrooms}
                    onChange={(e) => setHouseData(prev => ({ ...prev, bathrooms: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 caret-emerald-600 transition-all"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Home className="w-4 h-4 text-emerald-600" />
                    Kitchens *
                  </label>
                  <select
                    value={houseData.kitchens}
                    onChange={(e) => setHouseData(prev => ({ ...prev, kitchens: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 caret-emerald-600 transition-all"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
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
      min="2000"
      max="2024"
      placeholder="e.g., 2020"
      value={houseData.built_year}
      onChange={(e) =>
        setHouseData((prev) => ({
          ...prev,
          built_year: e.target.value,
        }))
      }
      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 caret-emerald-600 transition-all"
    />
  </div>

  <div className="space-y-3">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Building2 className="w-4 h-4 text-emerald-600" />
      Number of Floors
    </label>
     <select
                    value={houseData.number_of_floors}
                    onChange={(e) => setHouseData(prev => ({ ...prev, number_of_floors: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 caret-emerald-600 transition-all"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
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
                    value={houseData.severant_quarters}
                    onChange={(e) => setHouseData(prev => ({ ...prev, severant_quarters: e.target.value }))}
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
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
              <h2 className="text-xl font-semibold flex items-center gap-3 text-white">
                <TrendingUp className="w-5 h-5" />
                Price Prediction
              </h2>
              <p className="text-emerald-100 mt-1 text-sm">
                Estimated market value based on the provided details
              </p>
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
                  <div className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">
                      {formatPrice(prediction.predictedPrice)}
                    </div>
                    <p className="text-gray-600">Estimated Market Value</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 rounded-full text-sm text-emerald-700">
                      <CheckCircle className="w-3 h-3" />
                      <span>{Math.round(prediction.confidence * 100)}% Confidence</span>
                    </div>
                  </div>

                  {/* Trend Indicator */}
                  {prediction.trend && (
                    <div className={`text-center p-3 rounded-lg ${prediction.trend === 'up' ? 'bg-green-50 text-green-700' : prediction.trend === 'down' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      <span className="font-semibold">
                        {prediction.trend === 'up' ? '📈 Price Expected to Rise' : 
                         prediction.trend === 'down' ? '📉 Price Expected to Drop' : 
                         '📊 Price Expected to Stabilize'}
                      </span>
                      <span className="ml-2">
                        ({prediction.percentageChange > 0 ? '+' : ''}{prediction.percentageChange?.toFixed(1)}%)
                      </span>
                    </div>
                  )}

                  {/* Separator */}
                  <div className="border-t border-gray-200"></div>

                  {/* Price Range */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Price Range</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="text-xl font-bold text-emerald-600">
                          {formatPriceShort(prediction.predictedPrice * 0.85)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Low Estimate</p>
                      </div>
                      <div className="text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="text-xl font-bold text-emerald-600">
                          {formatPriceShort(prediction.predictedPrice * 1.15)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">High Estimate</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Factors */}
                  {prediction.factors && prediction.factors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">Key Factors</h3>
                      <div className="space-y-2">
                        {prediction.factors.slice(0, 3).map((factor, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${
                                factor.impact === 'positive' ? 'text-green-600' : 
                                factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {factor.name}
                              </span>
                            </div>
                            <span className={`text-sm font-semibold ${
                              factor.impact === 'positive' ? 'text-green-600' : 
                              factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {factor.impact === 'positive' ? '+' : ''}{Math.round(factor.weight * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
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
                        {houseData.num_floors && <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">{houseData.num_floors} Floors</span>}
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
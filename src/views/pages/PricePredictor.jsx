// src/views/pages/HousePricePredictor.jsx
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { TrendingUp, Home, Sparkles, CheckCircle, Bed, Bath, Calendar, Ruler, MapPin } from 'lucide-react';
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
    kitchen: '',
    yearBuilt: '',
    hasGarage: false,
    hasGarden: false,
    hasRoofAccess: false,
    furnished: false,
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

  const handlePredict = async () => {
    // Validation
    if (!houseData.area || !houseData.marla || !houseData.bedrooms || 
        !houseData.bathrooms || !houseData.kitchen || !houseData.yearBuilt) {
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
        kitchen: parseInt(houseData.kitchen),
        hasGarage: houseData.hasGarage,
        hasGarden: houseData.hasGarden,
        hasRoofAccess: houseData.hasRoofAccess,
        furnished: houseData.furnished,
        price: 0, // Will be calculated
        pricePerMarla: 0,
        description: '',
        image: '',
        yearBuilt: parseInt(houseData.yearBuilt),
        features: []
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
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Location / Area *
                </label>
                <select
                  value={houseData.area}
                  onChange={(e) => setHouseData(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="">Select Area</option>
                  {lahoreAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Marla Size */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Ruler className="w-4 h-4 text-emerald-600" />
                  Marla Size *
                </label>
                <select
                  value={houseData.marla}
                  onChange={(e) => setHouseData(prev => ({ ...prev, marla: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="">Select Marla</option>
                  {[3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(num => (
                    <option key={num} value={num}>{num} Marla</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms and Bathrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Bed className="w-4 h-4 text-emerald-600" />
                    Bedrooms *
                  </label>
                  <select
                    value={houseData.bedrooms}
                    onChange={(e) => setHouseData(prev => ({ ...prev, bedrooms: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Bed' : 'Beds'}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Bath className="w-4 h-4 text-emerald-600" />
                    Bathrooms *
                  </label>
                  <select
                    value={houseData.bathrooms}
                    onChange={(e) => setHouseData(prev => ({ ...prev, bathrooms: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Bath' : 'Baths'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kitchen and Year Built */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Home className="w-4 h-4 text-emerald-600" />
                    Kitchen *
                  </label>
                  <select
                    value={houseData.kitchen}
                    onChange={(e) => setHouseData(prev => ({ ...prev, kitchen: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3].map(num => (
                      <option key={num} value={num}>{num} Kitchen{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Year Built *
                  </label>
                  <input
                    type="number"
                    min="1980"
                    max="2024"
                    placeholder="e.g., 2020"
                    value={houseData.yearBuilt}
                    onChange={(e) => setHouseData(prev => ({ ...prev, yearBuilt: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Additional Features */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Additional Features</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.hasGarage}
                      onChange={(e) => setHouseData(prev => ({ ...prev, hasGarage: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Garage</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.hasGarden}
                      onChange={(e) => setHouseData(prev => ({ ...prev, hasGarden: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Garden</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.hasRoofAccess}
                      onChange={(e) => setHouseData(prev => ({ ...prev, hasRoofAccess: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Roof Access</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={houseData.furnished}
                      onChange={(e) => setHouseData(prev => ({ ...prev, furnished: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Furnished</span>
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
                  {(houseData.hasGarage || houseData.hasGarden || houseData.hasRoofAccess || houseData.furnished) && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">Included Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {houseData.hasGarage && (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Garage</span>
                        )}
                        {houseData.hasGarden && (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Garden</span>
                        )}
                        {houseData.hasRoofAccess && (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Roof Access</span>
                        )}
                        {houseData.furnished && (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Furnished</span>
                        )}
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
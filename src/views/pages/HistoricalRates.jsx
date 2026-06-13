// src/views/pages/HistoricalRates.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { Navbar } from '../components/navbar';
import { History, TrendingUp, BarChart3, LineChart as LineChartIcon, Activity,ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { historicalRatesService } from '../../services/services';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, AreaChart 
} from 'recharts';

export default function HistoricalRates() {
const [selectedArea, setSelectedArea] = useState('');
const [selectedLocationId, setSelectedLocationId] = useState('');
const [selectedMarla, setSelectedMarla] = useState(10);
const [areas, setAreas] = useState([]);
const [ratesData, setRatesData] = useState([]);
const [loading, setLoading] = useState(true);

const marlaOptions = [5, 10, 20];
  // Filter data for selected area and marla

  useEffect(() => {
  fetchAreas();
}, []);

useEffect(() => {
  if (selectedLocationId) {
    fetchRatesForArea();
  }
}, [selectedLocationId, selectedMarla]);

const fetchAreas = async () => {
  try {
    setLoading(true);
    const response = await historicalRatesService.getLocations();
    console.log('Locations response:', response);
    
    let locationsList = [];
    if (response.data && Array.isArray(response.data)) {
      locationsList = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      locationsList = response.data.data;
    } else if (Array.isArray(response)) {
      locationsList = response;
    }
    
    setAreas(locationsList);
    // REMOVED: Auto-selection of first location
    // Now location is empty until user selects one
  } catch (error) {
    console.error('Error fetching locations:', error);
    toast.error('Failed to load locations');
  } finally {
    setLoading(false);
  }
};

const fetchRatesForArea = async () => {
  if (!selectedLocationId) return;
  
  try {
    setLoading(true);
    // Get location details with yearly data
    const locationDetail = await historicalRatesService.getLocationDetail(selectedLocationId);
    console.log('Location detail response:', locationDetail);
    
    let yearlyData = {};
    let locationInfo = null;
    
    // Extract yearly data from different response structures
    if (locationDetail.data && locationDetail.data.data && locationDetail.data.data.yearly_data) {
      yearlyData = locationDetail.data.data.yearly_data;
      locationInfo = locationDetail.data.data;
    } else if (locationDetail.data && locationDetail.data.yearly_data) {
      yearlyData = locationDetail.data.yearly_data;
      locationInfo = locationDetail.data;
    } else if (locationDetail.yearly_data) {
      yearlyData = locationDetail.yearly_data;
      locationInfo = locationDetail;
    } else if (locationDetail.data && Array.isArray(locationDetail.data.years)) {
      // If years is an array
      const yearsArray = locationDetail.data.years;
      yearlyData = {};
      yearsArray.forEach(item => {
        yearlyData[item.year] = item;
      });
    }
    
    console.log('Yearly data extracted:', yearlyData);
    
    // Format data for charts - ensure year is properly set
    const formattedData = [];
    
    for (const [yearKey, dataValue] of Object.entries(yearlyData)) {
      // Get the actual year number
      const yearNum = parseInt(yearKey);
      if (isNaN(yearNum)) continue;
      
      let price = 0;
      let perMarlaRate = 0;
      let growthRate = 0;
      
      // Map marla size to correct field
      if (selectedMarla === 5) {
        price = dataValue.price_5_marla || dataValue.price || dataValue.average_price || 0;
        perMarlaRate = dataValue.per_marla_rate_5 || dataValue.per_marla_rate || dataValue.price_per_marla || 0;
        growthRate = dataValue.growth_percentage_5 || dataValue.growth_rate || 0;
      } else if (selectedMarla === 10) {
        price = dataValue.price_10_marla || dataValue.price || dataValue.average_price || 0;
        perMarlaRate = dataValue.per_marla_rate_10 || dataValue.per_marla_rate || dataValue.price_per_marla || 0;
        growthRate = dataValue.growth_percentage_10 || dataValue.growth_rate || 0;
      } else if (selectedMarla === 20) {
        price = dataValue.price_1_kanal || dataValue.price || dataValue.average_price || 0;
        perMarlaRate = dataValue.per_marla_rate_1k || dataValue.per_marla_rate || dataValue.price_per_marla || 0;
        growthRate = dataValue.growth_percentage_1k || dataValue.growth_rate || 0;
      } else {
        price = dataValue.average_price || dataValue.price || 0;
        perMarlaRate = dataValue.price_per_marla || dataValue.per_marla_rate || 0;
        growthRate = dataValue.growth_rate || 0;
      }
      
      formattedData.push({
        year: yearNum,  // IMPORTANT: Set the year number here
        averagePrice: parseFloat(price),
        pricePerMarla: parseFloat(perMarlaRate),
        growthRate: parseFloat(growthRate)
      });
    }
    
    // Sort by year
    formattedData.sort((a, b) => a.year - b.year);
    
    console.log('Formatted data for charts:', formattedData);
    setRatesData(formattedData);
    
    if (formattedData.length === 0) {
      toast.warning('No data available for this marla size');
    }
  } catch (error) {
    console.error('Error fetching rates:', error);
    toast.error('Failed to load historical rates');
    setRatesData([]);
  } finally {
    setLoading(false);
  }
};

  const displayData = useMemo(() => {
  return ratesData;
}, [ratesData]);

  // Calculate statistics
  const currentYear = displayData[displayData.length - 1];
const previousYear = displayData[displayData.length - 2];
const yearlyGrowth = currentYear && previousYear
  ? ((currentYear.averagePrice - previousYear.averagePrice) / previousYear.averagePrice) * 100
  : 0;

const firstYear = displayData[0];
const totalGrowth = currentYear && firstYear
  ? ((currentYear.averagePrice - firstYear.averagePrice) / firstYear.averagePrice) * 100
  : 0;
  console.log('Rendering with data:', { displayData, loading, selectedLocationId, selectedMarla });
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 caret-emerald-500 transition-all bg-white text-left flex justify-between items-center"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
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

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
    <Toaster position="top-center" richColors />
    <Navbar />

    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Activity className="w-10 h-10 text-emerald-600" />
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900">Historical Price Rates</h1>
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <TrendingUp className="w-10 h-10 text-emerald-600" />
          </motion.div>
        </div>
        <p className="text-xl text-gray-600">Track property value trends over the years in Lahore</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border-2 border-purple-100 overflow-visible"
      >
        <div className="grid md:grid-cols-2 gap-6 overflow-visible">
          <motion.div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Select Area
            </label>
            {(() => {
              const areaOptions = areas.map((location) => ({
                value: location.location_rate_id || location.id,
                label: location.location_name,
              }));
              
              return (
                <CustomDropdown
                  options={areaOptions}
                  value={selectedLocationId}
                  onChange={(value) => {
                    setSelectedLocationId(value);
                    const selectedLoc = areas.find(
                      loc => (loc.location_rate_id || loc.id) === value
                    );
                    setSelectedArea(selectedLoc?.location_name || '');
                    toast.info(`Viewing rates for ${selectedLoc?.location_name}`);
                  }}
                  placeholder="Select Location"
                />
              );
            })()}
          </motion.div>

          <motion.div className="transform-gpu">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-emerald-600" />
              Select Plot Size
            </label>
            {(() => {
              const marlaOptionsList = marlaOptions.map((marla) => ({
                value: marla,
                label: `${marla} Marla`,
              }));
              
              return (
                <CustomDropdown
                  options={marlaOptionsList}
                  value={selectedMarla}
                  onChange={(value) => {
                    setSelectedMarla(value);
                    toast.info(`Viewing ${value} Marla properties`);
                  }}
                  placeholder="Select Plot Size"
                />
              );
            })()}
          </motion.div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* No Data Message - Show when data is empty and not loading */}
      {!loading && displayData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-purple-100"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700">No Data Available</h3>
            <p className="text-gray-500 max-w-md">
              No historical rate data found for {selectedArea || 'this location'} with {selectedMarla} Marla size.
              Please try selecting a different location or plot size.
            </p>
            <button
              onClick={() => {
                setSelectedLocationId('');
                setSelectedArea('');
                toast.info('Please select another location');
              }}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Select Different Location
            </button>
          </div>
        </motion.div>
      )}

      {/* Only show Statistics Cards, Charts, and Table when data exists */}
      {!loading && displayData.length > 0 && (
        <>
          {/* Sort data in descending order (newest first) for display */}
          {(() => {
            const sortedData = [...displayData].sort((a, b) => b.year - a.year);
            const currentYearData = sortedData[0];
            const previousYearData = sortedData[1];
            const firstYearData = sortedData[sortedData.length - 1];
            
            const yearlyGrowthCalc = currentYearData && previousYearData
              ? ((currentYearData.averagePrice - previousYearData.averagePrice) / previousYearData.averagePrice) * 100
              : 0;
            
            const totalGrowthCalc = currentYearData && firstYearData
              ? ((currentYearData.averagePrice - firstYearData.averagePrice) / firstYearData.averagePrice) * 100
              : 0;

            return (
              <>
                {/* Statistics Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-2xl p-6 text-white"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" />
                      <h3 className="font-semibold">Current Value</h3>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                      className="text-4xl font-bold mb-1"
                    >
                      PKR {(currentYearData.averagePrice / 10000000).toFixed(2)} Cr
                    </motion.div>
                    <div className="text-sm opacity-90">
                      {currentYearData.pricePerMarla > 0 
                        ? `${(currentYearData.pricePerMarla / 100000).toFixed(1)} Lakh per Marla`
                        : `${(currentYearData.averagePrice / selectedMarla / 100000).toFixed(1)} Lakh per Marla`}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-6 text-white"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5" />
                      <h3 className="font-semibold">Year-on-Year Growth</h3>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                      className="text-4xl font-bold mb-1"
                    >
                      +{yearlyGrowthCalc.toFixed(1)}%
                    </motion.div>
                    <div className="text-sm opacity-90">
                      {previousYearData && (
                        <span>From PKR {(previousYearData.averagePrice / 10000000).toFixed(2)} Cr ({previousYearData.year})</span>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5" />
                      <h3 className="font-semibold">Total Growth</h3>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                      className="text-4xl font-bold mb-1"
                    >
                      +{totalGrowthCalc.toFixed(1)}%
                    </motion.div>
                    <div className="text-sm opacity-90">
                      {firstYearData && (
                        <span>From PKR {(firstYearData.averagePrice / 10000000).toFixed(2)} Cr ({firstYearData.year})</span>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Price Trend Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-purple-100"
                >
                  <h2 className="text-3xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-7 h-7 text-purple-600" />
                    Price Trend - {selectedArea} ({selectedMarla} Marla)
                  </h2>
                  <ResponsiveContainer width="100%" height={450}>
                    <AreaChart data={[...displayData].sort((a, b) => a.year - b.year)}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis
                        tickFormatter={(value) => `${(value / 10000000).toFixed(0)}Cr`}
                        label={{ value: 'Price (PKR)', angle: -90, position: 'insideLeft' }}
                        stroke="#6b7280"
                      />
                      <Tooltip
                        formatter={(value) => [
                          `PKR ${(value / 10000000).toFixed(2)} Cr`,
                          'Average Price',
                        ]}
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: '2px solid #8b5cf6', 
                          backgroundColor: 'rgba(255,255,255,0.95)' 
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="averagePrice"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        name="Average Price"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Price per Marla Trend */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-purple-100"
                >
                  <h2 className="text-3xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-7 h-7 text-teal-600" />
                    Per Marla Rate Trend - {selectedArea}
                  </h2>
                  <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={[...displayData].sort((a, b) => a.year - b.year)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis
                        tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
                        label={{ value: 'Price per Marla (PKR)', angle: -90, position: 'insideLeft' }}
                        stroke="#6b7280"
                      />
                      <Tooltip
                        formatter={(value) => [
                          `PKR ${(value / 100000).toFixed(2)} Lakh`,
                          'Per Marla Rate',
                        ]}
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: '2px solid #0891b2', 
                          backgroundColor: 'rgba(255,255,255,0.95)' 
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="pricePerMarla"
                        stroke="#0891b2"
                        strokeWidth={4}
                        dot={{ fill: '#0891b2', r: 7 }}
                        activeDot={{ r: 10 }}
                        name="Price per Marla"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Historical Data Table - Descending Order */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 mt-8 border-2 border-purple-100"
                >
                  <h2 className="text-3xl font-semibold mb-6 text-gray-800">Year-by-Year Breakdown</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-purple-200 bg-purple-50">
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Year</th>
                          <th className="text-right py-4 px-4 font-semibold text-gray-700">
                            Average Price
                          </th>
                          <th className="text-right py-4 px-4 font-semibold text-gray-700">
                            Per Marla Rate
                          </th>
                          <th className="text-right py-4 px-4 font-semibold text-gray-700">YoY Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Display data in DESCENDING order (newest first) */}
                        {[...displayData].sort((a, b) => b.year - a.year).map((rate, index, sortedArray) => {
                          const prevRate = index < sortedArray.length - 1 ? sortedArray[index + 1] : null;
                          const growth = prevRate && prevRate.averagePrice > 0
                            ? ((rate.averagePrice - prevRate.averagePrice) / prevRate.averagePrice) * 100
                            : 0;
                          
                          // Format price display
                          const formatPriceDisplay = (price) => {
                            if (!price || price === 0) return 'N/A';
                            if (price >= 10000000) {
                              return `PKR ${(price / 10000000).toFixed(2)} Cr`;
                            }
                            if (price >= 100000) {
                              return `PKR ${(price / 100000).toFixed(2)} Lakh`;
                            }
                            return `PKR ${price.toLocaleString()}`;
                          };
                          
                          // Format per marla display
                          const formatPerMarlaDisplay = (rate) => {
                            if (rate.pricePerMarla && rate.pricePerMarla > 0) {
                              if (rate.pricePerMarla >= 100000) {
                                return `PKR ${(rate.pricePerMarla / 100000).toFixed(2)} Lakh`;
                              }
                              return `PKR ${rate.pricePerMarla.toLocaleString()}`;
                            }
                            // Calculate from average price if available
                            if (rate.averagePrice && rate.averagePrice > 0 && selectedMarla) {
                              const calculated = rate.averagePrice / selectedMarla;
                              if (calculated >= 100000) {
                                return `PKR ${(calculated / 100000).toFixed(2)} Lakh`;
                              }
                              return `PKR ${calculated.toLocaleString()}`;
                            }
                            return 'N/A';
                          };

                          return (
                            <motion.tr
                              key={rate.year}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.9 + index * 0.05 }}
                              whileHover={{ backgroundColor: '#faf5ff', scale: 1.01 }}
                              className="border-b border-gray-100"
                            >
                              <td className="py-4 px-4 font-bold text-gray-900">{rate.year}</td>
                              <td className="text-right py-4 px-4 text-gray-700 font-medium">
                                {formatPriceDisplay(rate.averagePrice)}
                              </td>
                              <td className="text-right py-4 px-4 text-gray-700 font-medium">
                                {formatPerMarlaDisplay(rate)}
                              </td>
                              <td className="text-right py-4 px-4">
                                {index < sortedArray.length - 1 && !isNaN(growth) && growth !== 0 && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1 + index * 0.05 }}
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold ${
                                      growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}
                                  >
                                    <TrendingUp className="w-4 h-4" />
                                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                                  </motion.span>
                                )}
                                {index === sortedArray.length - 1 && <span className="text-gray-400">-</span>}
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </>
            );
          })()}
        </>
      )}
    </div>
  </div>
);
}
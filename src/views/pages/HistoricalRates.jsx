// src/views/pages/HistoricalRates.jsx
import { useState, useMemo } from 'react';
import { Navbar } from '../components/navbar';
import { History, TrendingUp, BarChart3, LineChart as LineChartIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { MOCK_HISTORICAL_RATES } from '../../data/mock/HistoricalRates';
import { LAHORE_AREAS } from '../../constants/LahoreData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, AreaChart 
} from 'recharts';

export default function HistoricalRates() {
  const [selectedArea, setSelectedArea] = useState('DHA Phase 5');
  const [selectedMarla, setSelectedMarla] = useState(10);

  const marlaOptions = [3, 5, 7, 8, 10, 12, 15, 20];

  // Filter data for selected area and marla
  const filteredData = useMemo(() => {
    return MOCK_HISTORICAL_RATES.filter(
      (rate) => rate.area === selectedArea && rate.marlaSize === selectedMarla
    );
  }, [selectedArea, selectedMarla]);

  // If no data, show default data for the area
  const displayData = useMemo(() => {
    if (filteredData.length > 0) {
      return filteredData;
    }
    return MOCK_HISTORICAL_RATES.filter((rate) => rate.area === selectedArea);
  }, [filteredData, selectedArea]);

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
          <div className="flex items-center justify-center gap-3 mb-4">
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
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-purple-100"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Select Area
              </label>
              <select
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  toast.info(`Viewing rates for ${e.target.value}`);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
              >
                {LAHORE_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <LineChartIcon className="w-4 h-4 text-emerald-600" />
                Select Plot Size
              </label>
              <select
                value={selectedMarla}
                onChange={(e) => {
                  setSelectedMarla(parseInt(e.target.value));
                  toast.info(`Viewing ${e.target.value} Marla properties`);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
              >
                {marlaOptions.map((marla) => (
                  <option key={marla} value={marla}>
                    {marla} Marla
                  </option>
                ))}
              </select>
            </motion.div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {currentYear && (
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
                <h3 className="font-semibold">Current Value (2026)</h3>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                className="text-4xl font-bold mb-1"
              >
                PKR {(currentYear.averagePrice / 10000000).toFixed(2)} Cr
              </motion.div>
              <div className="text-sm opacity-90">
                {(currentYear.pricePerMarla / 100000).toFixed(1)} Lakh per Marla
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
                +{yearlyGrowth.toFixed(1)}%
              </motion.div>
              <div className="text-sm opacity-90">
                {previousYear && (
                  <span>From PKR {(previousYear.averagePrice / 10000000).toFixed(2)} Cr (2025)</span>
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
                <h3 className="font-semibold">Total Growth Since 2019</h3>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                className="text-4xl font-bold mb-1"
              >
                +{totalGrowth.toFixed(1)}%
              </motion.div>
              <div className="text-sm opacity-90">
                {firstYear && (
                  <span>From PKR {(firstYear.averagePrice / 10000000).toFixed(2)} Cr</span>
                )}
              </div>
            </motion.div>
          </div>
        )}

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
            <AreaChart data={displayData}>
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
            <LineChart data={displayData}>
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

        {/* Historical Data Table */}
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
                {displayData.map((rate, index) => {
                  const prevRate = index > 0 ? displayData[index - 1] : null;
                  const growth = prevRate
                    ? ((rate.averagePrice - prevRate.averagePrice) / prevRate.averagePrice) * 100
                    : 0;

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
                        PKR {(rate.averagePrice / 10000000).toFixed(2)} Cr
                      </td>
                      <td className="text-right py-4 px-4 text-gray-700 font-medium">
                        PKR {(rate.pricePerMarla / 100000).toFixed(2)} Lakh
                      </td>
                      <td className="text-right py-4 px-4">
                        {index > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 + index * 0.05 }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold"
                          >
                            <TrendingUp className="w-4 h-4" />
                            +{growth.toFixed(1)}%
                          </motion.span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
// src/views/pages/Listing.jsx
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Bed, Bath, Home as HomeIcon, DollarSign, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from '../components/navbar';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useHouseListViewModel } from '../../viewmodels/useHouseListViewModel';
import { toast, Toaster } from 'sonner';

export default function Listings() {
  // ViewModel
  const {
    houses: filteredHouses,
    allHouses,
    loading,
    error,
    searchQuery,
    // filters, // ✅ Removed - not used
    selectedArea,
    uniqueAreas,
    priceRange,
    marlaRange,
    statistics,
    updateSearchQuery,
    updateFilters,
    updateSelectedArea,
    clearFilters,
    sortHouses,
    refresh
  } = useHouseListViewModel();

  // Local UI state
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price_desc');

  // Local filter values
  const [localMinPrice, setLocalMinPrice] = useState('');
  const [localMaxPrice, setLocalMaxPrice] = useState('');
  const [localMinMarla, setLocalMinMarla] = useState('');
  const [localMaxMarla, setLocalMaxMarla] = useState('');
  const [localBedrooms, setLocalBedrooms] = useState('');
  const [localFurnished, setLocalFurnished] = useState(false);
  const [localHasGarage, setLocalHasGarage] = useState(false);
  const [localHasGarden, setLocalHasGarden] = useState(false);

  const imageUrls = useMemo(() => [
    'https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=500',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
    'https://images.unsplash.com/photo-1668911495278-487418f8f72d?w=500',
    'https://images.unsplash.com/photo-1721815693498-cc28507c0ba2?w=500',
    'https://images.unsplash.com/photo-1682357042725-77af1ef2789b?w=500',
    'https://images.unsplash.com/photo-1616632821499-61ac29f49ff8?w=500',
    'https://images.unsplash.com/photo-1650059232481-352cd48eb740?w=500',
    'https://images.unsplash.com/photo-1768637087224-cffa17561c53?w=500',
  ], []);

  // ✅ Apply filters - stable reference without updateFilters dependency
  const applyLocalFilters = useCallback(() => {
    const newFilters = {};
    if (localMinPrice) newFilters.minPrice = parseInt(localMinPrice);
    if (localMaxPrice) newFilters.maxPrice = parseInt(localMaxPrice);
    if (localMinMarla) newFilters.minMarla = parseInt(localMinMarla);
    if (localMaxMarla) newFilters.maxMarla = parseInt(localMaxMarla);
    if (localBedrooms) newFilters.bedrooms = parseInt(localBedrooms);
    if (localFurnished) newFilters.furnished = localFurnished;
    if (localHasGarage) newFilters.hasGarage = localHasGarage;
    if (localHasGarden) newFilters.hasGarden = localHasGarden;
    
    updateFilters(newFilters);
  // ✅ Removed updateFilters from dependencies to prevent infinite loop
  }, [localMinPrice, localMaxPrice, localMinMarla, localMaxMarla, localBedrooms, 
      localFurnished, localHasGarage, localHasGarden]);

  // ✅ Sync local filters with ViewModel filters when cleared from outside
  useEffect(() => {
    // This runs when clearFilters is called from elsewhere
    if (!localMinPrice && !localMaxPrice && !localMinMarla && !localMaxMarla && 
        !localBedrooms && !localFurnished && !localHasGarage && !localHasGarden) {
      return;
    }
    // Optional: sync logic if needed
  }, []);

  // Reset all filters
  const resetAllFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalMinMarla('');
    setLocalMaxMarla('');
    setLocalBedrooms('');
    setLocalFurnished(false);
    setLocalHasGarage(false);
    setLocalHasGarden(false);
    clearFilters();
    toast.success('Filters cleared successfully!');
  };

  // Handle sort
  const handleSort = useCallback((value) => {
    setSortBy(value);
    sortHouses(value);
  }, [sortHouses]);

  const totalProperties = filteredHouses.length;
  const avgPrice = statistics.avgPrice;
  const cheapestPrice = statistics.minPrice;
  const mostExpensivePrice = statistics.maxPrice;

  // Loading state
  if (loading && allHouses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={refresh}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <Toaster position="top-center" richColors />
      <Navbar />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-3"
          >
            Browse Properties in Lahore
          </motion.h1>
          <p className="text-xl text-emerald-100">
            {totalProperties} properties available • Avg PKR {(avgPrice / 10000000).toFixed(1)} Cr
          </p>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-2xl mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, area, or description..."
                value={searchQuery}
                onChange={(e) => updateSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900"
            >
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="marla_desc">Size: Large to Small</option>
              <option value="marla_asc">Size: Small to Large</option>
              <option value="newest">Newest First</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                showFilters
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </motion.button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                    <select
                      value={selectedArea}
                      onChange={(e) => updateSelectedArea(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    >
                      {uniqueAreas.map((area) => (
                        <option key={area} value={area}>
                          {area === 'all' ? 'All Areas' : area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range (PKR)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder={`Min ${(priceRange.min / 10000000).toFixed(1)}Cr`}
                        value={localMinPrice}
                        onChange={(e) => {
                          setLocalMinPrice(e.target.value);
                          setTimeout(() => applyLocalFilters(), 10);
                        }}
                        className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      />
                      <input
                        type="number"
                        placeholder={`Max ${(priceRange.max / 10000000).toFixed(1)}Cr`}
                        value={localMaxPrice}
                        onChange={(e) => {
                          setLocalMaxPrice(e.target.value);
                          setTimeout(() => applyLocalFilters(), 10);
                        }}
                        className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      placeholder="Min Bedrooms"
                      value={localBedrooms}
                      onChange={(e) => {
                        setLocalBedrooms(e.target.value);
                        setTimeout(() => applyLocalFilters(), 10);
                      }}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marla Size
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder={`Min ${marlaRange.min}`}
                        value={localMinMarla}
                        onChange={(e) => {
                          setLocalMinMarla(e.target.value);
                          setTimeout(() => applyLocalFilters(), 10);
                        }}
                        className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      />
                      <input
                        type="number"
                        placeholder={`Max ${marlaRange.max}`}
                        value={localMaxMarla}
                        onChange={(e) => {
                          setLocalMaxMarla(e.target.value);
                          setTimeout(() => applyLocalFilters(), 10);
                        }}
                        className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={localFurnished}
                          onChange={(e) => {
                            setLocalFurnished(e.target.checked);
                            setTimeout(() => applyLocalFilters(), 10);
                          }}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span className="text-sm">Furnished</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={localHasGarage}
                          onChange={(e) => {
                            setLocalHasGarage(e.target.checked);
                            setTimeout(() => applyLocalFilters(), 10);
                          }}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span className="text-sm">Garage</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={localHasGarden}
                          onChange={(e) => {
                            setLocalHasGarden(e.target.checked);
                            setTimeout(() => applyLocalFilters(), 10);
                          }}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span className="text-sm">Garden</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-3 flex justify-between items-center">
                    <button
                      onClick={resetAllFilters}
                      className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </button>
                    <span className="text-sm text-gray-600">
                      {filteredHouses.length} properties found
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <HomeIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Properties</div>
                  <div className="text-2xl font-bold text-gray-900">{totalProperties}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Avg Price</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(avgPrice / 10000000).toFixed(1)} Cr
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-green-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Starting From</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(cheapestPrice / 10000000).toFixed(1)} Cr
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <HomeIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Premium Upto</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(mostExpensivePrice / 10000000).toFixed(1)} Cr
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Properties Grid */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-900 mb-6"
          >
            Available Properties
          </motion.h2>

          {filteredHouses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg"
            >
              <HomeIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl mb-4">No properties found matching your criteria</p>
              <button
                onClick={resetAllFilters}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-lg"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHouses.map((house, index) => (
                <motion.div
                  key={house.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Link
                    to={`/house/${house.id}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden block"
                  >
                    <div className="relative h-56 bg-gray-200 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      >
                        <ImageWithFallback
                          src={imageUrls[index % imageUrls.length]}
                          alt={house.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {house.marla} Marla
                      </div>
                      {house.yearBuilt >= 2023 && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          NEW
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {house.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm">{house.area}</span>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Bed className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium">{house.bedrooms} Bed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="w-5 h-5 text-teal-600" />
                          <span className="font-medium">{house.bathrooms} Bath</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          PKR {(house.price / 10000000).toFixed(1)} Cr
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {(house.pricePerMarla / 100000).toFixed(1)} Lakh per Marla
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
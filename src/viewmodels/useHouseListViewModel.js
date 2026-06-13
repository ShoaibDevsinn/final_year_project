// src/viewmodels/useHouseListViewModel.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { listingService } from '../services/services';

//  Add global cache outside the hook - persists across page navigation
let globalCache = {
  allHouses: [],
  statistics: {
    total: 0,
    sold: 0,
    available: 0,
    avgPrice: 0,
    minPrice: 0,
    maxPrice: 0
  },
  lastFetchTime: 0,
  isLoading: false
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export const useHouseListViewModel = () => {
  const [allHouses, setAllHouses] = useState(globalCache.allHouses);
  const [filteredHouses, setFilteredHouses] = useState(globalCache.allHouses);
  const [statistics, setStatistics] = useState(globalCache.statistics);
  const [loading, setLoading] = useState(globalCache.allHouses.length === 0);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('price_desc');

  // Derived data (from filtered houses only)
  const uniqueAreas = useMemo(() => {
    const areas = ['all', ...new Set(allHouses.map(house => house.area).filter(Boolean))];
    return areas;
  }, [allHouses]);

  const priceRange = useMemo(() => {
    if (allHouses.length === 0) return { min: 0, max: 0 };
    const prices = allHouses.map(h => h.price).filter(p => p > 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [allHouses]);

  const marlaRange = useMemo(() => {
    if (allHouses.length === 0) return { min: 0, max: 0 };
    const marlas = allHouses.map(h => h.marla).filter(m => m > 0);
    return {
      min: Math.min(...marlas),
      max: Math.max(...marlas)
    };
  }, [allHouses]);

  //  Modified fetchHouses with separate statistics endpoint
  const fetchHouses = async (forceRefresh = false) => {
    const now = Date.now();
    const cacheAge = now - globalCache.lastFetchTime;
    
    //  Use cache if available and not expired
    if (!forceRefresh && globalCache.allHouses.length > 0 && cacheAge < CACHE_DURATION) {
      console.log(' Using cached data, age:', Math.round(cacheAge/1000), 'seconds');
      setAllHouses(globalCache.allHouses);
      setFilteredHouses(globalCache.allHouses);
      setStatistics(globalCache.statistics);
      setLoading(false);
      return;
    }
    
    // Prevent multiple simultaneous fetches
    if (globalCache.isLoading) {
      console.log(' Fetch already in progress');
      return;
    }
    
    globalCache.isLoading = true;
    setLoading(true);
    
    try {
      console.log('🔄 Fetching fresh data from API...');
      
      // Fetch BOTH listings and statistics in parallel
      const [listingsResponse, statsResponse] = await Promise.all([
        listingService.getListings(),
        listingService.getStatistics()
      ]);
      
      console.log('Listings API Response:', listingsResponse);
      console.log('Statistics API Response:', statsResponse);
      
      let listingsData = [];
      if (listingsResponse.data && Array.isArray(listingsResponse.data)) {
        listingsData = listingsResponse.data;
      } else if (listingsResponse.results && Array.isArray(listingsResponse.results)) {
        listingsData = listingsResponse.results;
      } else if (Array.isArray(listingsResponse)) {
        listingsData = listingsResponse;
      }
      
      console.log('Listings data count:', listingsData.length);
      
      // Transform houses (only available properties for display)
      const transformedHouses = listingsData.map(house => ({
        id: house.id || house.listing_id,
        listing_id: house.listing_id || house.id,
        title: house.title || `${house.bedrooms || 3} Bedroom House`,
        area: house.location_name || house.area || 'Lahore',
        location_name: house.location_name || house.area,
        marla: house.area_marla || house.marla || Math.round((house.area_sqft || 0) / 272.25),
        bedrooms: house.bedrooms || 0,
        bathrooms: house.bathrooms || 0,
        yearBuilt: house.construction_year || house.year_built || 2024,
        price: house.price || house.predicted_price || 0,
        pricePerMarla: house.current_per_marla_rate || (house.price / (house.marla || 1)),
        images: house.images || [],
        primary_image: house.primary_image || null,
        image_urls: house.image_urls || [],
        description: house.description || '',
        isFurnished: house.is_furnished || false,
        hasGarage: house.has_parking || false,
        hasGarden: house.has_lawn || false,
        property_type: house.property_type || 'house',
        property_status: house.property_status || 'available',
        created_at: house.created_at,
        created_by_name: house.created_by_name,
      }));
      
      console.log('Transformed houses count:', transformedHouses.length);
      
      //  Update statistics from stats endpoint
      let updatedStatistics = {
        total: 0,
        sold: 0,
        available: 0,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0
      };
      
      if (statsResponse.success && statsResponse.data) {
        updatedStatistics = {
          total: statsResponse.data.total_properties || 0,
          sold: statsResponse.data.sold_properties || 0,
          available: statsResponse.data.available_properties || 0,
          avgPrice: statsResponse.data.avg_price || 0,
          minPrice: statsResponse.data.min_price || 0,
          maxPrice: statsResponse.data.max_price || 0
        };
        console.log('Statistics from API:', updatedStatistics);
      } else {
        // Fallback: calculate from transformed houses if stats endpoint fails
        console.log('Stats endpoint failed, calculating from available data');
        updatedStatistics.total = transformedHouses.length;
        updatedStatistics.sold = transformedHouses.filter(h => h.property_status === 'sold').length;
        updatedStatistics.available = transformedHouses.filter(h => h.property_status === 'available').length;
        
        const prices = transformedHouses.map(h => h.price).filter(p => p > 0);
        if (prices.length > 0) {
          updatedStatistics.avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          updatedStatistics.minPrice = Math.min(...prices);
          updatedStatistics.maxPrice = Math.max(...prices);
        }
      }
      
      // Update cache
      globalCache.allHouses = transformedHouses;
      globalCache.statistics = updatedStatistics;
      globalCache.lastFetchTime = now;
      
      setAllHouses(transformedHouses);
      setFilteredHouses(transformedHouses);
      setStatistics(updatedStatistics);
      setError(null);
    } catch (err) {
      console.error('Error fetching houses:', err);
      setError('Failed to load properties. Please try again later.');
      setAllHouses([]);
      setFilteredHouses([]);
    } finally {
      setLoading(false);
      globalCache.isLoading = false;
    }
  };

  // Apply filters (for display only)
  const applyFilters = useCallback(() => {
    let result = [...allHouses];
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(house =>
        house.title?.toLowerCase().includes(query) ||
        house.area?.toLowerCase().includes(query) ||
        house.description?.toLowerCase().includes(query)
      );
    }
    
    // Area filter
    if (selectedArea && selectedArea !== 'all') {
      result = result.filter(house => house.area === selectedArea);
    }
    
    // Price range filter
    if (filters.minPrice) {
      result = result.filter(house => house.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      result = result.filter(house => house.price <= filters.maxPrice);
    }
    
    // Marla range filter
    if (filters.minMarla) {
      result = result.filter(house => house.marla >= filters.minMarla);
    }
    if (filters.maxMarla) {
      result = result.filter(house => house.marla <= filters.maxMarla);
    }
    
    // Bedrooms filter
    if (filters.bedrooms) {
      result = result.filter(house => house.bedrooms >= filters.bedrooms);
    }
    
    // Features filters
    if (filters.furnished) {
      result = result.filter(house => house.isFurnished === true);
    }
    if (filters.hasGarage) {
      result = result.filter(house => house.hasGarage === true);
    }
    if (filters.hasGarden) {
      result = result.filter(house => house.hasGarden === true);
    }
    
    // Sort
    result = sortHousesList(result, sortBy);
    
    setFilteredHouses(result);
  }, [allHouses, searchQuery, selectedArea, filters, sortBy]);

  const sortHousesList = (houses, sortType) => {
    const sorted = [...houses];
    switch (sortType) {
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'marla_desc':
        return sorted.sort((a, b) => b.marla - a.marla);
      case 'marla_asc':
        return sorted.sort((a, b) => a.marla - b.marla);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      default:
        return sorted;
    }
  };

  // Update functions
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const updateSelectedArea = (area) => {
    setSelectedArea(area);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedArea('all');
    setFilters({});
    setSortBy('price_desc');
  };

  const sortHouses = (sortType) => {
    setSortBy(sortType);
  };

  const refresh = () => {
    fetchHouses(true); // Force refresh
  };

  //  Modified useEffect - only fetch if cache is empty
  useEffect(() => {
    if (globalCache.allHouses.length === 0) {
      fetchHouses();
    } else {
      // Use cached data immediately
      console.log('Using cached data on mount');
      setAllHouses(globalCache.allHouses);
      setFilteredHouses(globalCache.allHouses);
      setStatistics(globalCache.statistics);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    houses: filteredHouses,
    filteredHouses: filteredHouses,
    allHouses: allHouses,
    loading,
    error,
    searchQuery,
    selectedArea,
    uniqueAreas,
    priceRange,
    marlaRange,
    statistics,  //  Now includes total, sold, available, avgPrice, minPrice, maxPrice
    updateSearchQuery,
    updateFilters,
    updateSelectedArea,
    clearFilters,
    sortHouses,
    refresh
  };
};
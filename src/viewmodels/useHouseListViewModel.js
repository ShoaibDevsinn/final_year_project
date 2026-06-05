// src/viewmodels/useHouseListViewModel.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { listingService } from '../services/services';

export const useHouseListViewModel = () => {
  const [allHouses, setAllHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('price_desc');

  // Derived data
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

  const statistics = useMemo(() => {
    if (filteredHouses.length === 0) {
      return { avgPrice: 0, minPrice: 0, maxPrice: 0 };
    }
    const prices = filteredHouses.map(h => h.price);
    return {
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices)
    };
  }, [filteredHouses]);

  // Fetch houses
  const fetchHouses = async () => {
    try {
      setLoading(true);
      const response = await listingService.getListings();
      
      let listingsData = [];
      if (response.data && Array.isArray(response.data)) {
        listingsData = response.data;
      } else if (response.results && Array.isArray(response.results)) {
        listingsData = response.results;
      } else if (Array.isArray(response)) {
        listingsData = response;
      }
      
      const transformedHouses = listingsData.map(house => ({
        id: house.id || house.listing_id,
        title: house.title || `${house.bedrooms || 3} Bedroom House`,
        area: house.location || house.area || 'Lahore',
        marla: house.marla || house.area_marla || Math.round((house.area_sqft || 0) / 272.25),
        bedrooms: house.bedrooms || 0,
        bathrooms: house.bathrooms || 0,
        yearBuilt: house.construction_year || house.year_built || 2024,
        price: house.price || house.predicted_price || 0,
        pricePerMarla: house.price_per_marla || (house.price / (house.marla || 1)),
        images: house.images || [],
        description: house.description || '',
        isFurnished: house.is_furnished || false,
        hasGarage: house.has_parking || false,
        hasGarden: house.has_lawn || false,
      }));
      
      setAllHouses(transformedHouses);
      setFilteredHouses(transformedHouses);
      setError(null);
    } catch (err) {
      console.error('Error fetching houses:', err);
      setError('Failed to load properties. Please try again later.');
      setAllHouses([]);
      setFilteredHouses([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = useCallback(() => {
    let result = [...allHouses];
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(house =>
        house.title.toLowerCase().includes(query) ||
        house.area.toLowerCase().includes(query) ||
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
        return sorted.sort((a, b) => b.yearBuilt - a.yearBuilt);
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
    fetchHouses();
  };

  useEffect(() => {
    fetchHouses();
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
    statistics,
    updateSearchQuery,
    updateFilters,
    updateSelectedArea,
    clearFilters,
    sortHouses,
    refresh
  };
};
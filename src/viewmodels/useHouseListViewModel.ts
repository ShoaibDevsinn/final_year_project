// src/viewmodels/useHouseListViewModel.ts
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { House, SearchFilters } from '../models/House';
import { HouseService } from '../services/HouseService';

export const useHouseListViewModel = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedArea, setSelectedArea] = useState<string>('all');
  
  const houseService = new HouseService();

  // Load all houses
  const loadHouses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await houseService.getAllHouses();
      setHouses(data);
      setFilteredHouses(data);
    } catch (err) {
      setError('Failed to load houses. Please try again.');
      console.error('Error loading houses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Apply filters - using useRef to track if filters should apply
  const applyFilters = useCallback(() => {
    if (houses.length === 0) return;
    
    let results = [...houses];
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(house => 
        house.title.toLowerCase().includes(query) ||
        house.area.toLowerCase().includes(query) ||
        (house.description && house.description.toLowerCase().includes(query))
      );
    }
    
    // Apply area filter
    if (selectedArea !== 'all') {
      results = results.filter(house => house.area === selectedArea);
    }
    
    // Apply price filters
    if (filters.minPrice && filters.minPrice > 0) {
      results = results.filter(h => h.price >= filters.minPrice!);
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      results = results.filter(h => h.price <= filters.maxPrice!);
    }
    
    // Apply marla filters
    if (filters.minMarla && filters.minMarla > 0) {
      results = results.filter(h => h.marla >= filters.minMarla!);
    }
    if (filters.maxMarla && filters.maxMarla > 0) {
      results = results.filter(h => h.marla <= filters.maxMarla!);
    }
    
    // Apply bedroom filter
    if (filters.bedrooms && filters.bedrooms > 0) {
      results = results.filter(h => h.bedrooms >= filters.bedrooms!);
    }
    
    // Apply boolean filters
    if (filters.furnished !== undefined) {
      results = results.filter(h => h.furnished === filters.furnished);
    }
    if (filters.hasGarage !== undefined) {
      results = results.filter(h => h.hasGarage === filters.hasGarage);
    }
    if (filters.hasGarden !== undefined) {
      results = results.filter(h => h.hasGarden === filters.hasGarden);
    }
    
    setFilteredHouses(results);
  }, [houses, searchQuery, filters, selectedArea]);

  // Update search query
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Update selected area
  const updateSelectedArea = useCallback((area: string) => {
    setSelectedArea(area);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setSelectedArea('all');
    setFilteredHouses(houses);
  }, [houses]);

  // Sort houses
  const sortHouses = useCallback((sortBy: 'price_asc' | 'price_desc' | 'marla_asc' | 'marla_desc' | 'newest') => {
    setFilteredHouses(prev => {
      const sorted = [...prev];
      switch (sortBy) {
        case 'price_asc':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          sorted.sort((a, b) => b.price - a.price);
          break;
        case 'marla_asc':
          sorted.sort((a, b) => a.marla - b.marla);
          break;
        case 'marla_desc':
          sorted.sort((a, b) => b.marla - a.marla);
          break;
        case 'newest':
          sorted.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0));
          break;
      }
      return sorted;
    });
  }, []);

  // Get unique areas
  const uniqueAreas = useMemo(() => {
    const areas = houses.map(h => h.area);
    return ['all', ...new Set(areas)];
  }, [houses]);

  // Get price range
  const priceRange = useMemo(() => {
    if (houses.length === 0) return { min: 0, max: 10000000 };
    const prices = houses.map(h => h.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [houses]);

  // Get marla range
  const marlaRange = useMemo(() => {
    if (houses.length === 0) return { min: 0, max: 20 };
    const marlas = houses.map(h => h.marla);
    return {
      min: Math.min(...marlas),
      max: Math.max(...marlas)
    };
  }, [houses]);

  // Get statistics
  const statistics = useMemo(() => {
    if (filteredHouses.length === 0) {
      return {
        total: 0,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgMarla: 0,
        avgPricePerMarla: 0,
        totalValue: 0
      };
    }
    
    const prices = filteredHouses.map(h => h.price);
    const marlas = filteredHouses.map(h => h.marla);
    const pricesPerMarla = filteredHouses.map(h => h.pricePerMarla);
    
    return {
      total: filteredHouses.length,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgMarla: Math.round(marlas.reduce((a, b) => a + b, 0) / marlas.length),
      avgPricePerMarla: Math.round(pricesPerMarla.reduce((a, b) => a + b, 0) / pricesPerMarla.length),
      totalValue: prices.reduce((a, b) => a + b, 0)
    };
  }, [filteredHouses]);

  // Load data on mount
  useEffect(() => {
    loadHouses();
  }, [loadHouses]);

  // ✅ FIXED: Apply filters when dependencies change
  // This runs after houses, searchQuery, filters, selectedArea change
  useEffect(() => {
    if (houses.length > 0) {
      applyFilters();
    }
  }, [houses, searchQuery, filters, selectedArea]); // ✅ Removed applyFilters from deps

  return {
    houses: filteredHouses,
    allHouses: houses,
    loading,
    error,
    searchQuery,
    filters,
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
    refresh: loadHouses
  };
};
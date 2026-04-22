// src/viewmodels/useHouseDetailViewModel.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { House, PricePrediction } from '../models/House';
import { HouseService } from '../services/HouseService';

export const useHouseDetailViewModel = (houseId: string) => {
  const [house, setHouse] = useState<House | null>(null);
  const [similarHouses, setSimilarHouses] = useState<House[]>([]);
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const houseService = new HouseService();

  // Load house details
  const loadHouseDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const houseData = await houseService.getHouseById(houseId);
      if (!houseData) {
        throw new Error('House not found');
      }
      
      setHouse(houseData);
      
      // Load similar houses
      const similar = await houseService.getSimilarHouses(houseId);
      setSimilarHouses(similar);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load house details');
      console.error('Error loading house:', err);
    } finally {
      setLoading(false);
    }
  }, [houseId]);

  // Get price prediction
  const getPrediction = useCallback(async () => {
    if (!house) return;
    
    try {
      setPredicting(true);
      const predictionData = await houseService.predictPrice(house);
      setPrediction(predictionData);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setPredicting(false);
    }
  }, [house]);

  // Format price in PKR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PK').format(num);
  };

  // Calculate ROI
  const calculateROI = useMemo(() => {
    if (!house || !prediction) return null;
    const roi = ((prediction.predictedPrice - house.price) / house.price) * 100;
    return roi.toFixed(1);
  }, [house, prediction]);

  // Get investment potential
  const investmentPotential = useMemo(() => {
    if (!house || !prediction) return null;
    
    const roi = calculateROI;
    if (roi && parseFloat(roi) > 10) return 'High';
    if (roi && parseFloat(roi) > 5) return 'Medium';
    return 'Low';
  }, [house, prediction, calculateROI]);

  // Get confidence color
  const confidenceColor = useMemo(() => {
    if (!prediction) return 'gray';
    if (prediction.confidence && prediction.confidence >= 0.8) return 'green';
    if (prediction.confidence && prediction.confidence >= 0.6) return 'yellow';
    return 'red';
  }, [prediction]);

  // Get trend icon
  const trendIcon = useMemo(() => {
    if (!prediction) return '📊';
    switch (prediction.trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '📊';
    }
  }, [prediction]);

  // Get trend color
  const trendColor = useMemo(() => {
    if (!prediction) return 'text-gray-500';
    switch (prediction.trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  }, [prediction]);

  // Change active image
  const changeImage = (index: number) => {
    setActiveImageIndex(index);
  };

  // Get property age
  const propertyAge = useMemo(() => {
    if (!house) return 0;
    return new Date().getFullYear() - house.yearBuilt;
  }, [house]);

  // Get property condition label
  const propertyCondition = useMemo(() => {
    const age = propertyAge;
    if (age < 5) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (age < 10) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (age < 20) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Needs Renovation', color: 'text-red-600', bg: 'bg-red-100' };
  }, [propertyAge]);

  // Load data on mount
  useEffect(() => {
    loadHouseDetails();
  }, [loadHouseDetails]);

  // Load prediction when house is loaded
  useEffect(() => {
    if (house) {
      getPrediction();
    }
  }, [house, getPrediction]);

  return {
    // Data
    house,
    similarHouses,
    prediction,
    loading,
    predicting,
    error,
    activeImageIndex,
    
    // Calculated values
    formatPrice,
    formatNumber,
    calculateROI: calculateROI ? parseFloat(calculateROI) : null,
    investmentPotential,
    confidenceColor,
    trendIcon,
    trendColor,
    propertyAge,
    propertyCondition,
    
    // Actions
    changeImage,
    refresh: loadHouseDetails,
    refreshPrediction: getPrediction
  };
};
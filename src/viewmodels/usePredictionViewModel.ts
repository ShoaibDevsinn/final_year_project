// src/viewmodels/usePredictionViewModel.ts
import { useState, useCallback } from 'react';
import { House, PricePrediction, PredictionFactor } from '../models/House';
import { PredictionService } from '../services/PredictionService';

export const usePredictionViewModel = () => {
  const [predictions, setPredictions] = useState<Map<string, PricePrediction>>(new Map());
  const [predicting, setPredicting] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  const predictionService = new PredictionService();

  const getPrediction = useCallback(async (house: House): Promise<PricePrediction | null> => {
    if (predictions.has(house.id)) {
      return predictions.get(house.id)!;
    }
    
    try {
      setPredicting(prev => new Set(prev).add(house.id));
      setError(null);
      
      const prediction = await predictionService.predictPrice(house);
      
      setPredictions(prev => new Map(prev).set(house.id, prediction));
      
      return prediction;
    } catch (err) {
      setError(`Failed to predict price for ${house.title}`);
      console.error('Prediction error:', err);
      return null;
    } finally {
      setPredicting(prev => {
        const newSet = new Set(prev);
        newSet.delete(house.id);
        return newSet;
      });
    }
  }, [predictions]);

  const getBatchPredictions = useCallback(async (houses: House[]): Promise<Map<string, PricePrediction>> => {
    const results = new Map<string, PricePrediction>();
    const toFetch = houses.filter(house => !predictions.has(house.id));
    
    const batchSize = 3;
    for (let i = 0; i < toFetch.length; i += batchSize) {
      const batch = toFetch.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(house => getPrediction(house))
      );
      
      batchResults.forEach((result, index) => {
        if (result) {
          results.set(batch[index].id, result);
        }
      });
    }
    
    const allResults = new Map(predictions);
    results.forEach((value, key) => {
      allResults.set(key, value);
    });
    
    return allResults;
  }, [predictions, getPrediction]);

  const getPredictionById = useCallback((houseId: string): PricePrediction | null => {
    return predictions.get(houseId) || null;
  }, [predictions]);

  const isPredicting = useCallback((houseId: string): boolean => {
    return predicting.has(houseId);
  }, [predicting]);

  const clearCache = useCallback(() => {
    setPredictions(new Map());
    setPredicting(new Set());
    setError(null);
  }, []);

  const getPredictionStats = useCallback(() => {
    const predictionsList = Array.from(predictions.values());
    if (predictionsList.length === 0) return null;
    
    const avgConfidence = predictionsList.reduce((sum, p) => sum + (p.confidence || 0), 0) / predictionsList.length;
    const avgUpside = predictionsList.reduce((sum, p) => sum + (p.percentageChange || 0), 0) / predictionsList.length;
    
    const trends = {
      up: predictionsList.filter(p => p.trend === 'up').length,
      down: predictionsList.filter(p => p.trend === 'down').length,
      stable: predictionsList.filter(p => p.trend === 'stable').length
    };
    
    return {
      totalPredictions: predictionsList.length,
      avgConfidence: (avgConfidence * 100).toFixed(1),
      avgUpside: avgUpside.toFixed(1),
      trends,
      totalValueIncrease: predictionsList.reduce((sum, p) => sum + (p.predictedPrice - (p.currentPrice || 0)), 0)
    };
  }, [predictions]);

  const getTopFactors = useCallback((): any[] => {
    const allFactors: PredictionFactor[] = [];
    predictions.forEach(prediction => {
      if (prediction.factors) {
        allFactors.push(...prediction.factors);
      }
    });
    
    const factorCount = new Map<string, { count: number; totalWeight: number }>();
    allFactors.forEach(factor => {
      const existing = factorCount.get(factor.name);
      if (existing) {
        factorCount.set(factor.name, {
          count: existing.count + 1,
          totalWeight: existing.totalWeight + factor.weight
        });
      } else {
        factorCount.set(factor.name, {
          count: 1,
          totalWeight: factor.weight
        });
      }
    });
    
    const sortedFactors = Array.from(factorCount.entries())
      .map(([name, data]) => ({
        name,
        occurrences: data.count,
        avgWeight: data.totalWeight / data.count,
        description: allFactors.find(f => f.name === name)?.description || ''
      }))
      .sort((a, b) => b.avgWeight - a.avgWeight)
      .slice(0, 5);
    
    return sortedFactors;
  }, [predictions]);

  return {
    predictions,
    predicting: isPredicting,
    error,
    getPrediction,
    getBatchPredictions,
    getPredictionById,
    clearCache,
    getPredictionStats,
    getTopFactors
  };
};
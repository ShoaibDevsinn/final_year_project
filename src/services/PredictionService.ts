// src/services/PredictionService.ts
import { House } from '../models/House';
import { PricePrediction, PredictionFactor } from '../models/House';
import { MOCK_HISTORICAL_RATES } from '../data/mock/HistoricalRates';
import { AREA_MULTIPLIERS } from '../constants/LahoreData';

export class PredictionService {
  
  async predictPrice(house: House): Promise<PricePrediction> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prediction = this.calculatePrediction(house);
        resolve(prediction);
      }, 800);
    });
  }

  private calculatePrediction(house: House): PricePrediction {
    const areaMultiplier = AREA_MULTIPLIERS[house.area as keyof typeof AREA_MULTIPLIERS] || 1.0;
    
    // Calculate historical growth
    const historicalData = MOCK_HISTORICAL_RATES.filter(
      h => h.area === house.area && Math.abs(h.marlaSize - house.marla) <= 3
    );
    
    let averageGrowth = 0.05; // Default 5% growth
    
    if (historicalData.length > 0) {
      const recentData = historicalData.slice(-3);
      averageGrowth = recentData.reduce((sum, d) => sum + (d.growthRate || 0.05), 0) / recentData.length / 100;
    }
    
    // Calculate base price if house.price is 0 (for prediction form)
    let currentPrice = house.price;
    if (currentPrice === 0) {
      // Calculate based on marla and area
      const basePricePerMarla = 2500000;
      currentPrice = basePricePerMarla * house.marla * areaMultiplier;
      currentPrice += house.bedrooms * 1500000;
      currentPrice += house.bathrooms * 800000;
      currentPrice += house.kitchen * 1200000;
      if (house.hasGarage) currentPrice += 2000000;
      if (house.hasGarden) currentPrice += 1500000;
      if (house.hasRoofAccess) currentPrice += 800000;
      if (house.furnished) currentPrice += house.marla * 500000;
    }
    
    const predictedPrice = Math.round(currentPrice * (1 + averageGrowth));
    const percentageChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (percentageChange > 5) trend = 'up';
    else if (percentageChange < -5) trend = 'down';
    else trend = 'stable';
    
    return {
      id: `${house.id}_pred_${Date.now()}`,
      houseId: house.id,
      location: house.location,
      area: house.area,
      marla: house.marla,
      bedrooms: house.bedrooms,
      bathrooms: house.bathrooms,
      kitchen: house.kitchen,
      hasGarage: house.hasGarage,
      hasGarden: house.hasGarden,
      hasRoofAccess: house.hasRoofAccess,
      furnished: house.furnished,
      currentPrice: currentPrice,  // ✅ Add currentPrice
      predictedPrice,
      pricePerMarla: Math.round(predictedPrice / house.marla),
      confidence: 0.85,
      trend,
      percentageChange,
      date: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      factors: [
        {
          name: 'Area Value',
          impact: 'positive',
          weight: 0.35,
          description: `${house.area} is a premium location with ${areaMultiplier}x multiplier`,
          value: `${areaMultiplier}`
        },
        {
          name: 'Market Growth',
          impact: averageGrowth > 0 ? 'positive' : 'negative',
          weight: 0.25,
          description: `Historical growth rate of ${(averageGrowth * 100).toFixed(1)}% annually`,
          value: `${(averageGrowth * 100).toFixed(1)}%`
        },
        {
          name: 'Property Features',
          impact: 'positive',
          weight: 0.25,
          description: `${house.features.length} premium features included`,
          value: house.features.slice(0, 3).join(', ')
        },
        {
          name: 'Property Age',
          impact: new Date().getFullYear() - house.yearBuilt < 5 ? 'positive' : 'neutral',
          weight: 0.15,
          description: `${new Date().getFullYear() - house.yearBuilt} years old property`,
          value: `${new Date().getFullYear() - house.yearBuilt} years`
        }
      ]
    };
  }

  async predictMultiplePrices(houses: House[]): Promise<Map<string, PricePrediction>> {
    const predictions = new Map<string, PricePrediction>();
    
    for (const house of houses) {
      const prediction = await this.predictPrice(house);
      predictions.set(house.id, prediction);
    }
    
    return predictions;
  }
}
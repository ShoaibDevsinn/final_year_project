// src/services/HouseService.ts
import { House, SearchFilters, PricePrediction } from '../models/House';
import { MOCK_HOUSES } from '../data/mock/House';           // ← Fixed: lowercase 'houses'
import { MOCK_HISTORICAL_RATES } from '../data/mock/HistoricalRates';  // ← Fixed: lowercase 'historicalRates'
import { AREA_MULTIPLIERS, PRICE_CONSTANTS } from '../constants/LahoreData';  // ← Fixed: lowercase 'lahoreData'

export class HouseService {
  private houses: House[] = MOCK_HOUSES;

  // Get all houses
  async getAllHouses(): Promise<House[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.houses]), 300);
    });
  }

  // Get house by ID
  async getHouseById(id: string): Promise<House | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const house = this.houses.find(h => h.id === id);
        resolve(house || null);
      }, 200);
    });
  }

  // Get houses by filters
  async getHousesByFilters(filters: SearchFilters): Promise<House[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.houses];
        
        if (filters.minPrice) {
          filtered = filtered.filter(h => h.price >= filters.minPrice!);
        }
        if (filters.maxPrice) {
          filtered = filtered.filter(h => h.price <= filters.maxPrice!);
        }
        if (filters.minMarla) {
          filtered = filtered.filter(h => h.marla >= filters.minMarla!);
        }
        if (filters.maxMarla) {
          filtered = filtered.filter(h => h.marla <= filters.maxMarla!);
        }
        if (filters.bedrooms) {
          filtered = filtered.filter(h => h.bedrooms >= filters.bedrooms!);
        }
        if (filters.bathrooms) {
          filtered = filtered.filter(h => h.bathrooms >= filters.bathrooms!);
        }
        if (filters.area && filters.area.length > 0) {
          filtered = filtered.filter(h => filters.area!.includes(h.area));
        }
        if (filters.furnished !== undefined) {
          filtered = filtered.filter(h => h.furnished === filters.furnished);
        }
        if (filters.hasGarage !== undefined) {
          filtered = filtered.filter(h => h.hasGarage === filters.hasGarage);
        }
        if (filters.hasGarden !== undefined) {
          filtered = filtered.filter(h => h.hasGarden === filters.hasGarden);
        }
        
        resolve(filtered);
      }, 400);
    });
  }

  // Get price prediction for a house
  async predictPrice(house: House): Promise<PricePrediction> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prediction = this.calculatePrediction(house);
        resolve(prediction);
      }, 600);
    });
  }

  private calculatePrediction(house: House): PricePrediction {
    const areaMultiplier = AREA_MULTIPLIERS[house.area as keyof typeof AREA_MULTIPLIERS] || 1.0;
    
    // Calculate future price based on historical trends
    const historicalData = MOCK_HISTORICAL_RATES.filter(
      h => h.area === house.area && Math.abs(h.marlaSize - house.marla) <= 3
    );
    
    let averageGrowth = 0.05; // Default 5% growth
    
    if (historicalData.length > 0) {
      const recentData = historicalData.slice(-3);
      averageGrowth = recentData.reduce((sum, d) => sum + (d.growthRate || 0.05), 0) / recentData.length / 100;
    }
    
    const predictedPrice = Math.round(house.price * (1 + averageGrowth));
    const percentageChange = ((predictedPrice - house.price) / house.price) * 100;
    
    // Determine trend
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
      predictedPrice,
      pricePerMarla: Math.round(predictedPrice / house.marla),
      confidence: 0.85,
      trend,                          // ← Added
      percentageChange,               // ← Added
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

  // Get similar houses
  async getSimilarHouses(houseId: string): Promise<House[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentHouse = this.houses.find(h => h.id === houseId);
        if (!currentHouse) {
          resolve([]);
          return;
        }
        
        const similar = this.houses.filter(house => 
          house.id !== houseId &&
          house.area === currentHouse.area &&
          Math.abs(house.marla - currentHouse.marla) <= 3 &&
          Math.abs(house.price - currentHouse.price) < currentHouse.price * 0.3
        ).slice(0, 4);
        
        resolve(similar);
      }, 300);
    });
  }

  // Get market statistics
  async getMarketStats() {
    const prices = this.houses.map(h => h.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const areaStats = this.houses.reduce((acc, house) => {
      if (!acc[house.area]) {
        acc[house.area] = { count: 0, totalPrice: 0 };
      }
      acc[house.area].count++;
      acc[house.area].totalPrice += house.price;
      return acc;
    }, {} as Record<string, { count: number; totalPrice: number }>);
    
    const avgPriceByArea = Object.entries(areaStats).map(([area, stats]) => ({
      area,
      avgPrice: stats.totalPrice / stats.count,
      count: stats.count
    }));
    
    return {
      totalHouses: this.houses.length,
      averagePrice: avgPrice,
      minPrice,
      maxPrice,
      averageMarla: this.houses.reduce((sum, h) => sum + h.marla, 0) / this.houses.length,
      avgPriceByArea,
      totalValue: prices.reduce((a, b) => a + b, 0)
    };
  }
}
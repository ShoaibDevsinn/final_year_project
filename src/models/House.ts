// src/models/House.ts

export interface House {
  id: string;
  title: string;
  location: string;
  area: string; // e.g., "DHA Phase 5", "Bahria Town"
  marla: number;
  bedrooms: number;
  bathrooms: number;
  kitchen: number;
  hasGarage: boolean;
  hasGarden: boolean;
  hasRoofAccess: boolean;
  furnished: boolean;
  price: number;
  pricePerMarla: number;
  description: string;
  image: string;
  yearBuilt: number;
  features: string[];
  // Additional professional fields
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'available' | 'sold' | 'pending';
  views?: number;
  favorites?: number;
}

export interface PricePrediction {
  id: string;
  houseId?: string;
  location: string;
  area: string;
  marla: number;
  bedrooms: number;
  bathrooms: number;
  kitchen: number;
  hasGarage: boolean;
  hasGarden: boolean;
  hasRoofAccess: boolean;
  furnished: boolean;
  currentPrice?: number;      // ✅ Add this
  predictedPrice: number;
  pricePerMarla: number;
  confidence?: number;
  trend?: 'up' | 'down' | 'stable';
  percentageChange?: number;
  date: string;
  validUntil?: string;
  factors?: PredictionFactor[];
}

export interface PredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
  value: string;
}

export interface HistoricalRate {
  year: number;
  area: string;
  marlaSize: number;
  averagePrice: number;
  pricePerMarla: number;
  growthRate?: number; // Year over year growth
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  predictions: PricePrediction[];
  favorites?: string[]; // House IDs
  searchHistory?: SearchHistory[];
}

export interface SearchHistory {
  id: string;
  query: string;
  filters: SearchFilters;
  timestamp: Date;
  resultsCount: number;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  minMarla?: number;
  maxMarla?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string[];
  furnished?: boolean;
  hasGarage?: boolean;
  hasGarden?: boolean;
}

// Export all interfaces
export type { SearchFilters as SearchFiltersType };
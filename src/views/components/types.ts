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
}

export interface PricePrediction {
  id: string;
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
  predictedPrice: number;
  pricePerMarla: number;
  date: string;
}

export interface HistoricalRate {
  year: number;
  area: string;
  marlaSize: number;
  averagePrice: number;
  pricePerMarla: number;
}

export interface UserProfile {
  name: string;
  email: string;
  predictions: PricePrediction[];
}

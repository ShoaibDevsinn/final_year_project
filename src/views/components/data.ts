import { House, PricePrediction, HistoricalRate } from './types';

// Lahore specific location data
export const lahoreAreas = [
  'DHA Phase 1',
  'DHA Phase 2',
  'DHA Phase 3',
  'DHA Phase 4',
  'DHA Phase 5',
  'DHA Phase 6',
  'DHA Phase 7',
  'DHA Phase 8',
  'Bahria Town',
  'Bahria Orchard',
  'Johar Town',
  'Gulberg',
  'Model Town',
  'Faisal Town',
  'Garden Town',
  'Wapda Town',
  'Cantt',
  'Iqbal Town',
  'Allama Iqbal Town',
  'Township',
];

// Price multipliers for different areas in Lahore
export const areaMultipliers: { [key: string]: number } = {
  'DHA Phase 1': 2.5,
  'DHA Phase 2': 2.4,
  'DHA Phase 3': 2.3,
  'DHA Phase 4': 2.2,
  'DHA Phase 5': 2.6,
  'DHA Phase 6': 2.4,
  'DHA Phase 7': 2.1,
  'DHA Phase 8': 2.0,
  'Bahria Town': 1.8,
  'Bahria Orchard': 1.5,
  'Johar Town': 1.9,
  'Gulberg': 2.7,
  'Model Town': 2.3,
  'Faisal Town': 1.4,
  'Garden Town': 2.2,
  'Wapda Town': 1.7,
  'Cantt': 2.5,
  'Iqbal Town': 1.3,
  'Allama Iqbal Town': 1.2,
  'Township': 1.1,
};

// Mock houses data for Lahore
export const mockHouses: House[] = [
  {
    id: '1',
    title: 'Luxurious Villa in DHA Phase 5',
    location: 'Lahore',
    area: 'DHA Phase 5',
    marla: 10,
    bedrooms: 5,
    bathrooms: 6,
    kitchen: 1,
    hasGarage: true,
    hasGarden: true,
    hasRoofAccess: true,
    furnished: true,
    price: 65000000,
    pricePerMarla: 6500000,
    description: 'Beautiful modern villa with all amenities, prime location',
    image: 'modern luxury villa',
    yearBuilt: 2020,
    features: ['Swimming Pool', 'Servant Quarter', 'Solar System', 'CCTV Security'],
  },
  {
    id: '2',
    title: 'Modern House in Bahria Town',
    location: 'Lahore',
    area: 'Bahria Town',
    marla: 8,
    bedrooms: 4,
    bathrooms: 4,
    kitchen: 1,
    hasGarage: true,
    hasGarden: true,
    hasRoofAccess: false,
    furnished: false,
    price: 36000000,
    pricePerMarla: 4500000,
    description: 'Well-maintained house with modern architecture',
    image: 'modern house exterior',
    yearBuilt: 2019,
    features: ['Marble Flooring', 'Central AC', 'Parking Space'],
  },
  {
    id: '3',
    title: 'Spacious Home in Johar Town',
    location: 'Lahore',
    area: 'Johar Town',
    marla: 7,
    bedrooms: 4,
    bathrooms: 3,
    kitchen: 1,
    hasGarage: true,
    hasGarden: false,
    hasRoofAccess: true,
    furnished: false,
    price: 33250000,
    pricePerMarla: 4750000,
    description: 'Family friendly home near schools and markets',
    image: 'residential house',
    yearBuilt: 2018,
    features: ['Terrace', 'Store Room', 'Powder Room'],
  },
  {
    id: '4',
    title: 'Corner House in Gulberg',
    location: 'Lahore',
    area: 'Gulberg',
    marla: 12,
    bedrooms: 6,
    bathrooms: 5,
    kitchen: 2,
    hasGarage: true,
    hasGarden: true,
    hasRoofAccess: true,
    furnished: true,
    price: 81000000,
    pricePerMarla: 6750000,
    description: 'Premium corner house in the heart of Gulberg',
    image: 'luxury corner house',
    yearBuilt: 2021,
    features: ['Gym Room', 'Home Theater', 'Study Room', 'Basement'],
  },
  {
    id: '5',
    title: 'Affordable House in Wapda Town',
    location: 'Lahore',
    area: 'Wapda Town',
    marla: 5,
    bedrooms: 3,
    bathrooms: 3,
    kitchen: 1,
    hasGarage: false,
    hasGarden: false,
    hasRoofAccess: true,
    furnished: false,
    price: 21250000,
    pricePerMarla: 4250000,
    description: 'Ideal for small families, well-connected location',
    image: 'small family house',
    yearBuilt: 2017,
    features: ['Tiled Flooring', 'Water Tank', 'Boundary Wall'],
  },
  {
    id: '6',
    title: 'Brand New Villa in DHA Phase 6',
    location: 'Lahore',
    area: 'DHA Phase 6',
    marla: 15,
    bedrooms: 7,
    bathrooms: 7,
    kitchen: 2,
    hasGarage: true,
    hasGarden: true,
    hasRoofAccess: true,
    furnished: true,
    price: 90000000,
    pricePerMarla: 6000000,
    description: 'State-of-the-art villa with smart home features',
    image: 'smart home villa',
    yearBuilt: 2023,
    features: ['Smart Home System', 'Underground Water Tank', 'Generator', 'Jacuzzi'],
  },
  {
    id: '7',
    title: 'Classic House in Model Town',
    location: 'Lahore',
    area: 'Model Town',
    marla: 10,
    bedrooms: 5,
    bathrooms: 4,
    kitchen: 1,
    hasGarage: true,
    hasGarden: true,
    hasRoofAccess: false,
    furnished: false,
    price: 57500000,
    pricePerMarla: 5750000,
    description: 'Traditional architecture with modern facilities',
    image: 'traditional house',
    yearBuilt: 2016,
    features: ['Lawn', 'Porch', 'Drawing Room', 'Dining Room'],
  },
  {
    id: '8',
    title: 'Budget Home in Township',
    location: 'Lahore',
    area: 'Township',
    marla: 5,
    bedrooms: 3,
    bathrooms: 2,
    kitchen: 1,
    hasGarage: false,
    hasGarden: false,
    hasRoofAccess: true,
    furnished: false,
    price: 13750000,
    pricePerMarla: 2750000,
    description: 'Perfect starter home for young families',
    image: 'starter home',
    yearBuilt: 2015,
    features: ['Separate Entry', 'Gas Connection', 'Electricity Backup'],
  },
];

// Historical rates data for Lahore
export const mockHistoricalRates: HistoricalRate[] = [
  // DHA Phase 5 - 10 Marla
  { year: 2019, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 45000000, pricePerMarla: 4500000 },
  { year: 2020, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 50000000, pricePerMarla: 5000000 },
  { year: 2021, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 55000000, pricePerMarla: 5500000 },
  { year: 2022, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 60000000, pricePerMarla: 6000000 },
  { year: 2023, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 62000000, pricePerMarla: 6200000 },
  { year: 2024, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 65000000, pricePerMarla: 6500000 },
  { year: 2025, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 68000000, pricePerMarla: 6800000 },
  { year: 2026, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 70000000, pricePerMarla: 7000000 },

  // Bahria Town - 8 Marla
  { year: 2019, area: 'Bahria Town', marlaSize: 8, averagePrice: 25000000, pricePerMarla: 3125000 },
  { year: 2020, area: 'Bahria Town', marlaSize: 8, averagePrice: 28000000, pricePerMarla: 3500000 },
  { year: 2021, area: 'Bahria Town', marlaSize: 8, averagePrice: 30000000, pricePerMarla: 3750000 },
  { year: 2022, area: 'Bahria Town', marlaSize: 8, averagePrice: 33000000, pricePerMarla: 4125000 },
  { year: 2023, area: 'Bahria Town', marlaSize: 8, averagePrice: 35000000, pricePerMarla: 4375000 },
  { year: 2024, area: 'Bahria Town', marlaSize: 8, averagePrice: 36000000, pricePerMarla: 4500000 },
  { year: 2025, area: 'Bahria Town', marlaSize: 8, averagePrice: 38000000, pricePerMarla: 4750000 },
  { year: 2026, area: 'Bahria Town', marlaSize: 8, averagePrice: 40000000, pricePerMarla: 5000000 },

  // Gulberg - 12 Marla
  { year: 2019, area: 'Gulberg', marlaSize: 12, averagePrice: 60000000, pricePerMarla: 5000000 },
  { year: 2020, area: 'Gulberg', marlaSize: 12, averagePrice: 66000000, pricePerMarla: 5500000 },
  { year: 2021, area: 'Gulberg', marlaSize: 12, averagePrice: 72000000, pricePerMarla: 6000000 },
  { year: 2022, area: 'Gulberg', marlaSize: 12, averagePrice: 75000000, pricePerMarla: 6250000 },
  { year: 2023, area: 'Gulberg', marlaSize: 12, averagePrice: 78000000, pricePerMarla: 6500000 },
  { year: 2024, area: 'Gulberg', marlaSize: 12, averagePrice: 81000000, pricePerMarla: 6750000 },
  { year: 2025, area: 'Gulberg', marlaSize: 12, averagePrice: 84000000, pricePerMarla: 7000000 },
  { year: 2026, area: 'Gulberg', marlaSize: 12, averagePrice: 87000000, pricePerMarla: 7250000 },

  // Johar Town - 7 Marla
  { year: 2019, area: 'Johar Town', marlaSize: 7, averagePrice: 23000000, pricePerMarla: 3285714 },
  { year: 2020, area: 'Johar Town', marlaSize: 7, averagePrice: 25200000, pricePerMarla: 3600000 },
  { year: 2021, area: 'Johar Town', marlaSize: 7, averagePrice: 28000000, pricePerMarla: 4000000 },
  { year: 2022, area: 'Johar Town', marlaSize: 7, averagePrice: 30100000, pricePerMarla: 4300000 },
  { year: 2023, area: 'Johar Town', marlaSize: 7, averagePrice: 31500000, pricePerMarla: 4500000 },
  { year: 2024, area: 'Johar Town', marlaSize: 7, averagePrice: 33250000, pricePerMarla: 4750000 },
  { year: 2025, area: 'Johar Town', marlaSize: 7, averagePrice: 35000000, pricePerMarla: 5000000 },
  { year: 2026, area: 'Johar Town', marlaSize: 7, averagePrice: 36750000, pricePerMarla: 5250000 },

  // Model Town - 10 Marla
  { year: 2019, area: 'Model Town', marlaSize: 10, averagePrice: 40000000, pricePerMarla: 4000000 },
  { year: 2020, area: 'Model Town', marlaSize: 10, averagePrice: 44000000, pricePerMarla: 4400000 },
  { year: 2021, area: 'Model Town', marlaSize: 10, averagePrice: 48000000, pricePerMarla: 4800000 },
  { year: 2022, area: 'Model Town', marlaSize: 10, averagePrice: 52000000, pricePerMarla: 5200000 },
  { year: 2023, area: 'Model Town', marlaSize: 10, averagePrice: 55000000, pricePerMarla: 5500000 },
  { year: 2024, area: 'Model Town', marlaSize: 10, averagePrice: 57500000, pricePerMarla: 5750000 },
  { year: 2025, area: 'Model Town', marlaSize: 10, averagePrice: 60000000, pricePerMarla: 6000000 },
  { year: 2026, area: 'Model Town', marlaSize: 10, averagePrice: 62500000, pricePerMarla: 6250000 },

  // Township - 5 Marla
  { year: 2019, area: 'Township', marlaSize: 5, averagePrice: 9000000, pricePerMarla: 1800000 },
  { year: 2020, area: 'Township', marlaSize: 5, averagePrice: 10000000, pricePerMarla: 2000000 },
  { year: 2021, area: 'Township', marlaSize: 5, averagePrice: 11000000, pricePerMarla: 2200000 },
  { year: 2022, area: 'Township', marlaSize: 5, averagePrice: 12000000, pricePerMarla: 2400000 },
  { year: 2023, area: 'Township', marlaSize: 5, averagePrice: 12750000, pricePerMarla: 2550000 },
  { year: 2024, area: 'Township', marlaSize: 5, averagePrice: 13750000, pricePerMarla: 2750000 },
  { year: 2025, area: 'Township', marlaSize: 5, averagePrice: 14500000, pricePerMarla: 2900000 },
  { year: 2026, area: 'Township', marlaSize: 5, averagePrice: 15250000, pricePerMarla: 3050000 },
];

// Price calculation function for Lahore
export const calculateHousePrice = (
  area: string,
  marla: number,
  bedrooms: number,
  bathrooms: number,
  kitchen: number,
  hasGarage: boolean,
  hasGarden: boolean,
  hasRoofAccess: boolean,
  furnished: boolean
): { totalPrice: number; pricePerMarla: number } => {
  // Base price per marla in PKR
  const basePrice = 2500000; // 25 Lakh per marla base

  // Area multiplier
  const areaMultiplier = areaMultipliers[area] || 1.0;

  // Calculate base price for plot size
  let totalPrice = basePrice * marla * areaMultiplier;

  // Add value for bedrooms
  totalPrice += bedrooms * 1500000; // 15 Lakh per bedroom

  // Add value for bathrooms
  totalPrice += bathrooms * 800000; // 8 Lakh per bathroom

  // Add value for kitchen
  totalPrice += kitchen * 1200000; // 12 Lakh per kitchen

  // Additional features
  if (hasGarage) totalPrice += 2000000; // 20 Lakh for garage
  if (hasGarden) totalPrice += 1500000; // 15 Lakh for garden
  if (hasRoofAccess) totalPrice += 800000; // 8 Lakh for roof access
  if (furnished) totalPrice += marla * 500000; // 5 Lakh per marla for furnishing

  const pricePerMarla = Math.round(totalPrice / marla);

  return {
    totalPrice: Math.round(totalPrice),
    pricePerMarla,
  };
};

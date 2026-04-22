// src/constants/lahoreData.ts

// Lahore specific location data
export const LAHORE_AREAS = [
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
] as const;

export type LahoreArea = typeof LAHORE_AREAS[number];

// Price multipliers for different areas in Lahore
export const AREA_MULTIPLIERS: Record<LahoreArea, number> = {
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

// Price calculation constants
export const PRICE_CONSTANTS = {
  BASE_PRICE_PER_MARLA: 2500000, // 25 Lakh
  BEDROOM_VALUE: 1500000, // 15 Lakh per bedroom
  BATHROOM_VALUE: 800000, // 8 Lakh per bathroom
  KITCHEN_VALUE: 1200000, // 12 Lakh per kitchen
  GARAGE_VALUE: 2000000, // 20 Lakh
  GARDEN_VALUE: 1500000, // 15 Lakh
  ROOF_ACCESS_VALUE: 800000, // 8 Lakh
  FURNISHING_VALUE_PER_MARLA: 500000, // 5 Lakh per marla
} as const;
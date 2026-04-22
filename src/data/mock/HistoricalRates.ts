// src/data/mock/historicalRates.ts
import { HistoricalRate } from '../../models/House';

export const MOCK_HISTORICAL_RATES: HistoricalRate[] = [
  // DHA Phase 5 - 10 Marla
  { year: 2019, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 45000000, pricePerMarla: 4500000, growthRate: 11.1 },
  { year: 2020, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 50000000, pricePerMarla: 5000000, growthRate: 10.0 },
  { year: 2021, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 55000000, pricePerMarla: 5500000, growthRate: 9.1 },
  { year: 2022, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 60000000, pricePerMarla: 6000000, growthRate: 3.3 },
  { year: 2023, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 62000000, pricePerMarla: 6200000, growthRate: 4.8 },
  { year: 2024, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 65000000, pricePerMarla: 6500000, growthRate: 4.6 },
  { year: 2025, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 68000000, pricePerMarla: 6800000, growthRate: 2.9 },
  { year: 2026, area: 'DHA Phase 5', marlaSize: 10, averagePrice: 70000000, pricePerMarla: 7000000, growthRate: 0 },

  // Bahria Town - 8 Marla
  { year: 2019, area: 'Bahria Town', marlaSize: 8, averagePrice: 25000000, pricePerMarla: 3125000, growthRate: 12.0 },
  { year: 2020, area: 'Bahria Town', marlaSize: 8, averagePrice: 28000000, pricePerMarla: 3500000, growthRate: 7.1 },
  { year: 2021, area: 'Bahria Town', marlaSize: 8, averagePrice: 30000000, pricePerMarla: 3750000, growthRate: 10.0 },
  { year: 2022, area: 'Bahria Town', marlaSize: 8, averagePrice: 33000000, pricePerMarla: 4125000, growthRate: 6.1 },
  { year: 2023, area: 'Bahria Town', marlaSize: 8, averagePrice: 35000000, pricePerMarla: 4375000, growthRate: 2.9 },
  { year: 2024, area: 'Bahria Town', marlaSize: 8, averagePrice: 36000000, pricePerMarla: 4500000, growthRate: 5.6 },
  { year: 2025, area: 'Bahria Town', marlaSize: 8, averagePrice: 38000000, pricePerMarla: 4750000, growthRate: 5.3 },
  { year: 2026, area: 'Bahria Town', marlaSize: 8, averagePrice: 40000000, pricePerMarla: 5000000, growthRate: 0 },

  // Gulberg - 12 Marla
  { year: 2019, area: 'Gulberg', marlaSize: 12, averagePrice: 60000000, pricePerMarla: 5000000, growthRate: 10.0 },
  { year: 2020, area: 'Gulberg', marlaSize: 12, averagePrice: 66000000, pricePerMarla: 5500000, growthRate: 9.1 },
  { year: 2021, area: 'Gulberg', marlaSize: 12, averagePrice: 72000000, pricePerMarla: 6000000, growthRate: 4.2 },
  { year: 2022, area: 'Gulberg', marlaSize: 12, averagePrice: 75000000, pricePerMarla: 6250000, growthRate: 4.0 },
  { year: 2023, area: 'Gulberg', marlaSize: 12, averagePrice: 78000000, pricePerMarla: 6500000, growthRate: 3.8 },
  { year: 2024, area: 'Gulberg', marlaSize: 12, averagePrice: 81000000, pricePerMarla: 6750000, growthRate: 3.7 },
  { year: 2025, area: 'Gulberg', marlaSize: 12, averagePrice: 84000000, pricePerMarla: 7000000, growthRate: 3.6 },
  { year: 2026, area: 'Gulberg', marlaSize: 12, averagePrice: 87000000, pricePerMarla: 7250000, growthRate: 0 },

  // Johar Town - 7 Marla
  { year: 2019, area: 'Johar Town', marlaSize: 7, averagePrice: 23000000, pricePerMarla: 3285714, growthRate: 9.6 },
  { year: 2020, area: 'Johar Town', marlaSize: 7, averagePrice: 25200000, pricePerMarla: 3600000, growthRate: 11.1 },
  { year: 2021, area: 'Johar Town', marlaSize: 7, averagePrice: 28000000, pricePerMarla: 4000000, growthRate: 7.5 },
  { year: 2022, area: 'Johar Town', marlaSize: 7, averagePrice: 30100000, pricePerMarla: 4300000, growthRate: 4.7 },
  { year: 2023, area: 'Johar Town', marlaSize: 7, averagePrice: 31500000, pricePerMarla: 4500000, growthRate: 5.6 },
  { year: 2024, area: 'Johar Town', marlaSize: 7, averagePrice: 33250000, pricePerMarla: 4750000, growthRate: 5.3 },
  { year: 2025, area: 'Johar Town', marlaSize: 7, averagePrice: 35000000, pricePerMarla: 5000000, growthRate: 5.0 },
  { year: 2026, area: 'Johar Town', marlaSize: 7, averagePrice: 36750000, pricePerMarla: 5250000, growthRate: 0 },

  // Model Town - 10 Marla
  { year: 2019, area: 'Model Town', marlaSize: 10, averagePrice: 40000000, pricePerMarla: 4000000, growthRate: 10.0 },
  { year: 2020, area: 'Model Town', marlaSize: 10, averagePrice: 44000000, pricePerMarla: 4400000, growthRate: 9.1 },
  { year: 2021, area: 'Model Town', marlaSize: 10, averagePrice: 48000000, pricePerMarla: 4800000, growthRate: 8.3 },
  { year: 2022, area: 'Model Town', marlaSize: 10, averagePrice: 52000000, pricePerMarla: 5200000, growthRate: 5.8 },
  { year: 2023, area: 'Model Town', marlaSize: 10, averagePrice: 55000000, pricePerMarla: 5500000, growthRate: 4.5 },
  { year: 2024, area: 'Model Town', marlaSize: 10, averagePrice: 57500000, pricePerMarla: 5750000, growthRate: 4.3 },
  { year: 2025, area: 'Model Town', marlaSize: 10, averagePrice: 60000000, pricePerMarla: 6000000, growthRate: 4.2 },
  { year: 2026, area: 'Model Town', marlaSize: 10, averagePrice: 62500000, pricePerMarla: 6250000, growthRate: 0 },

  // Township - 5 Marla
  { year: 2019, area: 'Township', marlaSize: 5, averagePrice: 9000000, pricePerMarla: 1800000, growthRate: 11.1 },
  { year: 2020, area: 'Township', marlaSize: 5, averagePrice: 10000000, pricePerMarla: 2000000, growthRate: 10.0 },
  { year: 2021, area: 'Township', marlaSize: 5, averagePrice: 11000000, pricePerMarla: 2200000, growthRate: 9.1 },
  { year: 2022, area: 'Township', marlaSize: 5, averagePrice: 12000000, pricePerMarla: 2400000, growthRate: 6.3 },
  { year: 2023, area: 'Township', marlaSize: 5, averagePrice: 12750000, pricePerMarla: 2550000, growthRate: 7.8 },
  { year: 2024, area: 'Township', marlaSize: 5, averagePrice: 13750000, pricePerMarla: 2750000, growthRate: 5.5 },
  { year: 2025, area: 'Township', marlaSize: 5, averagePrice: 14500000, pricePerMarla: 2900000, growthRate: 5.2 },
  { year: 2026, area: 'Township', marlaSize: 5, averagePrice: 15250000, pricePerMarla: 3050000, growthRate: 0 },
];
import { CarbonFootprint, CarbonFootprintResult } from './carbon-footprint.interface';

// Emission factors (example values, replace with accurate data)
const EMISSION_FACTORS = {
  TRANSPORTATION: 0.21, // kg CO2e per km
  ELECTRICITY: 0.82,    // kg CO2e per kWh
  FOOD: 2.5,            // kg CO2e per kg
  WASTE: 0.5,           // kg CO2e per kg
};

export class CarbonFootprintCalculator {
  static calculate(data: CarbonFootprint): CarbonFootprintResult {
    const transportation = data.transportation * EMISSION_FACTORS.TRANSPORTATION;
    const electricity = data.electricity * EMISSION_FACTORS.ELECTRICITY;
    const food = data.food * EMISSION_FACTORS.FOOD;
    const waste = data.waste * EMISSION_FACTORS.WASTE;

    const monthly = transportation + electricity + food + waste;
    const annual = monthly * 12;

    return {
      monthly,
      annual,
      categoryBreakdown: {
        transportation,
        electricity,
        food,
        waste,
      },
    };
  }
}

import { CarbonFootprint, CarbonFootprintResult } from './carbon-footprint.interface';
import { CONSTANTS } from '@/lib/constants';

export class CarbonFootprintCalculator {
  static calculate(data: CarbonFootprint): CarbonFootprintResult {
    const transportation = data.transportation * CONSTANTS.FACTORS.TRANSPORT_MULTIPLIER;
    const electricity = data.electricity * CONSTANTS.FACTORS.ELECTRICITY_MULTIPLIER;
    const food = data.food * CONSTANTS.FACTORS.FOOD_MULTIPLIER;
    const waste = data.waste * CONSTANTS.FACTORS.WASTE_MULTIPLIER;

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

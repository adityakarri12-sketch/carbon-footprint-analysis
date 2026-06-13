import { CarbonFootprintCalculator } from '../../src/domain/carbon-footprint/carbon-footprint.calculator';
import { CONSTANTS } from '../../src/lib/constants';

describe('CarbonFootprintCalculator', () => {
  it('should correctly calculate footprints with positive values', () => {
    const input = {
      transportation: 100, // miles
      electricity: 200,    // kWh
      food: 3,             // days
      waste: 10,           // kg
    };

    const result = CarbonFootprintCalculator.calculate(input);

    const expectedTransport = 100 * CONSTANTS.FACTORS.TRANSPORT_MULTIPLIER;
    const expectedElectricity = 200 * CONSTANTS.FACTORS.ELECTRICITY_MULTIPLIER;
    const expectedFood = 3 * CONSTANTS.FACTORS.FOOD_MULTIPLIER;
    const expectedWaste = 10 * CONSTANTS.FACTORS.WASTE_MULTIPLIER;

    const expectedMonthly = expectedTransport + expectedElectricity + expectedFood + expectedWaste;

    expect(result.monthly).toBeCloseTo(expectedMonthly);
    expect(result.annual).toBeCloseTo(expectedMonthly * 12);
    expect(result.categoryBreakdown.transportation).toBeCloseTo(expectedTransport);
  });

  it('should handle zero values securely without NaN errors', () => {
    const input = { transportation: 0, electricity: 0, food: 0, waste: 0 };
    const result = CarbonFootprintCalculator.calculate(input);

    expect(result.monthly).toBe(0);
    expect(result.annual).toBe(0);
    expect(result.categoryBreakdown.transportation).toBe(0);
  });

  it('should process massive numbers correctly without overflow', () => {
    const massive = 9999999;
    const input = { transportation: massive, electricity: massive, food: massive, waste: massive };
    
    const result = CarbonFootprintCalculator.calculate(input);
    expect(result.monthly).toBeGreaterThan(0);
    expect(result.annual).toBe(result.monthly * 12);
  });
});

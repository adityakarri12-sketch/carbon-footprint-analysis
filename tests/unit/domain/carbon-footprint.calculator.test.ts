import { CarbonFootprintCalculator } from '@/domain/carbon-footprint/carbon-footprint.calculator';
import { CarbonFootprint } from '@/domain/carbon-footprint/carbon-footprint.interface';

describe('CarbonFootprintCalculator', () => {
  it('should calculate the carbon footprint correctly', () => {
    const data: CarbonFootprint = {
      transportation: 100,
      electricity: 200,
      food: 50,
      waste: 20,
    };

    const result = CarbonFootprintCalculator.calculate(data);

    expect(result.monthly).toBeCloseTo(320);
    expect(result.annual).toBeCloseTo(3840);
    expect(result.categoryBreakdown.transportation).toBeCloseTo(21);
    expect(result.categoryBreakdown.electricity).toBeCloseTo(164);
    expect(result.categoryBreakdown.food).toBeCloseTo(125);
    expect(result.categoryBreakdown.waste).toBeCloseTo(10);
  });
});

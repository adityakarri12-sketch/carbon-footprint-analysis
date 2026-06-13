import { CarbonFootprintCalculator } from '../src/domain/carbon-footprint/carbon-footprint.calculator';
import { CarbonFootprint } from '../src/domain/carbon-footprint/carbon-footprint.interface';

describe('CarbonFootprintCalculator', () => {
  it('should accurately calculate the total monthly and annual carbon footprint', () => {
    // Arrange
    const input: CarbonFootprint = {
      transportation: 100, // 100 * 0.21 = 21
      electricity: 200,    // 200 * 0.82 = 164
      food: 30,            // 30 * 2.5 = 75
      waste: 20,           // 20 * 0.5 = 10
    };
    
    // Expected monthly = 21 + 164 + 75 + 10 = 270
    // Expected annual = 270 * 12 = 3240

    // Act
    const result = CarbonFootprintCalculator.calculate(input);

    // Assert
    expect(result.monthly).toBeCloseTo(270);
    expect(result.annual).toBeCloseTo(3240);
  });

  it('should correctly break down emissions by category', () => {
    // Arrange
    const input: CarbonFootprint = {
      transportation: 50,
      electricity: 100,
      food: 10,
      waste: 5,
    };

    // Act
    const result = CarbonFootprintCalculator.calculate(input);

    // Assert
    expect(result.categoryBreakdown.transportation).toBeCloseTo(10.5); // 50 * 0.21
    expect(result.categoryBreakdown.electricity).toBeCloseTo(82);      // 100 * 0.82
    expect(result.categoryBreakdown.food).toBeCloseTo(25);             // 10 * 2.5
    expect(result.categoryBreakdown.waste).toBeCloseTo(2.5);           // 5 * 0.5
  });

  it('should return 0 for all metrics if inputs are 0', () => {
    const input: CarbonFootprint = { transportation: 0, electricity: 0, food: 0, waste: 0 };
    const result = CarbonFootprintCalculator.calculate(input);

    expect(result.monthly).toBe(0);
    expect(result.annual).toBe(0);
    expect(result.categoryBreakdown.transportation).toBe(0);
    expect(result.categoryBreakdown.electricity).toBe(0);
  });
});

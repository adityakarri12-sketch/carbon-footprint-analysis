export interface CarbonFootprint {
  transportation: number;
  electricity: number;
  food: number;
  waste: number;
}

export interface CarbonFootprintResult {
  monthly: number;
  annual: number;
  categoryBreakdown: {
    transportation: number;
    electricity: number;
    food: number;
    waste: number;
  };
}

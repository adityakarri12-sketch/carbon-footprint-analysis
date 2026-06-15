export const CONSTANTS = {
  // Footprint Calculation Factors
  FACTORS: {
    TRANSPORT_MULTIPLIER: 0.192, // kg CO2e per mile
    ELECTRICITY_MULTIPLIER: 0.385, // kg CO2e per kWh
    FOOD_MULTIPLIER: 3.3, // kg CO2e per day
    WASTE_MULTIPLIER: 0.5, // kg CO2e per kg waste
  },

  // UI Configuration
  UI: {
    TOAST_DURATION: 3000,
    MAX_GOAL_TITLE_LENGTH: 100,
    MAX_FOOTPRINT_HISTORY_POINTS: 12,
  },

  // Models
  MODELS: {
    GEMINI_FAST: 'gemini-flash-latest',
  },
};

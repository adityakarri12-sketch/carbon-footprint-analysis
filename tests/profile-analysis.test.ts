import { POST } from '../src/app/api/gemini/plan/route';
import { NextRequest } from 'next/server';

// Mock the clerk auth and carbon footprint service
jest.mock('@clerk/nextjs/server', () => ({
  auth: () => ({ userId: 'test_user_profile_analysis' }),
}));

jest.mock('@/application/carbon-footprint/carbon-footprint.service', () => {
  return {
    CarbonFootprintService: jest.fn().mockImplementation(() => ({
      getHistory: jest.fn().mockResolvedValue([
        { id: '1', transportation: 200, electricity: 100, food: 50, waste: 30 }
      ]),
    })),
  };
});

describe('Profile Analysis API validation', () => {
  it('should return a valid structured response array that the Profile component can parse', async () => {
    // The profile page relies on data.plan[0] existing
    const req = new NextRequest('http://localhost:3000/api/gemini/plan', {
      method: 'POST',
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    
    // Validate the exact schema that the Profile page relies upon
    expect(data.plan).toBeDefined();
    expect(Array.isArray(data.plan)).toBe(true);
    expect(data.plan.length).toBeGreaterThan(0);

    const firstStep = data.plan[0];
    expect(firstStep.title).toBeDefined();
    expect(typeof firstStep.title).toBe('string');
    expect(firstStep.description).toBeDefined();
    expect(typeof firstStep.description).toBe('string');
  });
});

import { POST } from '../src/app/api/gemini/plan/route';
import { NextRequest } from 'next/server';

// Mock the clerk auth and carbon footprint service
jest.mock('@clerk/nextjs/server', () => ({
  auth: () => ({ userId: 'test_user_123' }),
}));

jest.mock('@/application/carbon-footprint/carbon-footprint.service', () => {
  return {
    CarbonFootprintService: jest.fn().mockImplementation(() => ({
      getHistory: jest.fn().mockResolvedValue([
        { id: '1', transportation: 100, electricity: 50, food: 30, waste: 20 }
      ]),
    })),
  };
});

describe('Gemini Plan API', () => {
  it('should return a structured JSON plan with title, impact, and description', async () => {
    // If GEMINI_API_KEY is not set in CI, it will hit the graceful fallback.
    // We test that the response matches the expected schema in either case.
    const req = new NextRequest('http://localhost:3000/api/gemini/plan', {
      method: 'POST',
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.plan).toBeDefined();
    expect(Array.isArray(data.plan)).toBe(true);
    expect(data.plan.length).toBeGreaterThan(0);

    const firstStep = data.plan[0];
    expect(firstStep).toHaveProperty('title');
    expect(firstStep).toHaveProperty('impact');
    expect(firstStep).toHaveProperty('description');
  });
});

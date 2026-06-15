/**
 * @jest-environment node
 */
import { POST } from '../src/app/api/gemini/plan/route';
import { NextRequest } from 'next/server';

// Mock the clerk auth and carbon footprint service
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
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

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: () => JSON.stringify([
              { title: "Mock AI Goal", impact: "High", description: "This is a mocked goal." }
            ])
          }
        })
      })
    }))
  };
});

import { auth } from '@clerk/nextjs/server';

describe('Gemini Plan API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 401 if unauthorized', async () => {
    (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: null });
    const req = new NextRequest('http://localhost:3000/api/gemini/plan', { method: 'POST' });
    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('should hit the fallback if GEMINI_API_KEY is not set', async () => {
    (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: 'test_user_123' });
    delete process.env.GEMINI_API_KEY;

    const req = new NextRequest('http://localhost:3000/api/gemini/plan', { method: 'POST' });
    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.plan[0].title).toBe("Reduce Driving");
  });

  it('should use Gemini API if GEMINI_API_KEY is set', async () => {
    (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: 'test_user_123' });
    process.env.GEMINI_API_KEY = "test_api_key";

    const req = new NextRequest('http://localhost:3000/api/gemini/plan', { method: 'POST' });
    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.plan[0].title).toBe("Mock AI Goal");
  });
});

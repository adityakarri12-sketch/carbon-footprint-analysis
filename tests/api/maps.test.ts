/**
 * @jest-environment node
 */
import { GET as distanceGET } from '@/app/api/maps/distance/route';
import { GET as geocodeGET } from '@/app/api/maps/geocode/route';
import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

describe('Maps API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Distance API', () => {
    it('returns 401 if unauthenticated', async () => {
      (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: null });
      const req = new NextRequest('http://localhost/api/maps/distance', { method: 'GET' });
      const res = await distanceGET(req);
      expect(res.status).toBe(401);
    });

    it('returns 400 validation error if missing params', async () => {
      (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: 'user_123' });
      const req = new NextRequest('http://localhost/api/maps/distance', { method: 'GET' });
      const res = await distanceGET(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Validation Error');
    });
  });

  describe('Geocode API', () => {
    it('returns 401 if unauthenticated', async () => {
      (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: null });
      const req = new NextRequest('http://localhost/api/maps/geocode', { method: 'GET' });
      const res = await geocodeGET(req);
      expect(res.status).toBe(401);
    });

    it('returns 400 validation error if missing address', async () => {
      (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: 'user_123' });
      const req = new NextRequest('http://localhost/api/maps/geocode', { method: 'GET' });
      const res = await geocodeGET(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Validation Error');
    });
  });
});

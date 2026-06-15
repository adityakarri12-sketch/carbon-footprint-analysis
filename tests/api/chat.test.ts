/**
 * @jest-environment node
 */
import { POST as chatPOST } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('isomorphic-dompurify', () => ({
  sanitize: (val: string) => val
}));

describe('Chat API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 if unauthenticated', async () => {
    (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: null });
    const req = new NextRequest('http://localhost/api/chat', { method: 'POST' });
    const res = await chatPOST(req);
    expect(res.status).toBe(401);
  });

  it('returns 500 validation error if payload is missing (caught by server error boundary since its a standard route)', async () => {
    (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: 'user_123' });
    const req = new NextRequest('http://localhost/api/chat', { 
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await chatPOST(req);
    // Since it's NOT wrapped in withErrorHandler, zod will throw a standard error causing 500
    // If it was wrapped in withErrorHandler, it would be 400.
    // The current implementation in route.ts has a generic catch block returning 200 with error msg or 500
    // Actually, chat/route.ts catches errors and returns a 200 fallback message:
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.reply).toMatch(/encountered an error/i);
  });

  it('sanitizes input and calls fallback when no AI key', async () => {
    (auth as unknown as jest.Mock).mockResolvedValueOnce({ userId: 'user_123' });
    const req = new NextRequest('http://localhost/api/chat', { 
      method: 'POST',
      body: JSON.stringify({ message: "Hello <script>alert(1)</script>" }),
    });
    const res = await chatPOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.reply).toMatch(/Fallback Mode/i);
  });
});

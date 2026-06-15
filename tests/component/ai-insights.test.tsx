import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AiInsights } from '@/components/progress-dashboard/ai-insights';

jest.mock('isomorphic-dompurify', () => ({
  sanitize: (val: string) => val
}));

global.fetch = jest.fn();

describe('AiInsights Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true, json: () => Promise.resolve({ analysis: 'Test' })
      }), 100))
    );
    render(<AiInsights />);
    expect(screen.getByText(/Synthesizing Footprint Data/i)).toBeInTheDocument();
  });

  it('renders analysis successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ analysis: '<p>AI Insight</p>' }),
    });

    render(<AiInsights />);
    await waitFor(() => {
      expect(screen.getByText('AI Insight')).toBeInTheDocument();
    });
  });

  it('renders error state when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<AiInsights />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to generate analysis/i)).toBeInTheDocument();
    });
  });
});

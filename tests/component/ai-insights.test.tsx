import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AiInsights } from '@/components/progress-dashboard/ai-insights';

jest.mock('dompurify', () => ({
  sanitize: (val: string) => val
}));

jest.mock('react-markdown', () => (props: any) => <>{props.children}</>);

describe('AiInsights Component', () => {
  beforeAll(() => {
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) })) as jest.Mock;
  });
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
      expect(screen.getByText('<p>AI Insight</p>')).toBeInTheDocument();
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

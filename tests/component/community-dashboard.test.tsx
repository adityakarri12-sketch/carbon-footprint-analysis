import { render, screen } from '@testing-library/react';

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div data-testid="lottie-mock" />
}));

import { CommunityDashboard } from '@/components/community/community-dashboard';

describe('CommunityDashboard', () => {
  it('renders without crashing', () => {
    render(<CommunityDashboard />);
    expect(screen.getAllByText(/Gemini Community Insight/i)[0]).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: { fullName: 'Test User' },
  }),
}));

describe('DashboardLayout', () => {
  it('renders the dashboard components properly', () => {
    render(<DashboardLayout />);
    expect(screen.getAllByText(/Calculate Footprint/i)[0]).toBeInTheDocument();
  });
});

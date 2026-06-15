import { render, screen } from '@testing-library/react';

jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ isLoaded: true, isSignedIn: true, user: { imageUrl: '' } }),
  UserProfile: () => <div data-testid="user-profile-mock">Clerk Profile</div>
}));

import ProfilePage from '@/app/profile/page';

describe('ProfilePage', () => {
  it('renders without crashing', () => {
    render(<ProfilePage />);
    expect(screen.getAllByText(/Manage your identity/i)[0]).toBeInTheDocument();
  });
});

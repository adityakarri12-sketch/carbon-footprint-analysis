import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from '@/components/navbar';

jest.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid="user-button">UserButton</div>,
  useUser: () => ({ isSignedIn: true, user: { fullName: 'Test User' } }),
  useAuth: () => ({ userId: 'user_123' }),
}));

jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar Component', () => {
  it('renders brand logo', () => {
    render(<Navbar />);
    expect(screen.getByText(/Carbon/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';

jest.mock('lottie-react', () => {
  return function DummyLottie() {
    return <div data-testid="lottie-mock" />;
  };
});

import { HeroSection } from '@/components/home/hero-section';

describe('HeroSection', () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;
  });

  it('renders the hero section correctly', () => {
    render(<HeroSection />);
    expect(screen.getByText(/Empowering Your Journey/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div data-testid="lottie-mock" />
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

import { VisionScanner } from '@/components/vision/vision-scanner';

global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) })) as jest.Mock;

describe('VisionScanner', () => {
  it('renders without crashing', () => {
    render(<VisionScanner />);
    expect(screen.getAllByText(/AI Vision Scanner/i)[0]).toBeInTheDocument();
  });
});

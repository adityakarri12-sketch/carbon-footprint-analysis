import { render, screen } from '@testing-library/react';

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div data-testid="lottie-mock" />
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

import { AdvisorDashboard } from '@/components/advisor/advisor-dashboard';

describe('AdvisorDashboard', () => {
  it('renders without crashing', () => {
    render(<AdvisorDashboard />);
    expect(screen.getAllByText(/AI Sustainability Advisor/i)[0]).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';

// Mock the heavy recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="recharts-mock">{children}</div>,
  LineChart: () => null,
  BarChart: () => null,
  AreaChart: () => null,
  PieChart: () => null,
  Line: () => null,
  Bar: () => null,
  Area: () => null,
  Pie: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: () => null,
}));

import VisualizationsPage from '@/app/visualizations/page';

describe('VisualizationsPage', () => {
  it('renders without crashing', () => {
    render(<VisualizationsPage />);
    expect(screen.getAllByText(/Visualizations/i)[0]).toBeInTheDocument();
  });
});

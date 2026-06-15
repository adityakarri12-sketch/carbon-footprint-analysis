import { render, screen } from '@testing-library/react';
import { GoalList } from '../../src/components/goal-setting/goal-list';
import '@testing-library/jest-dom';

// Mocking useToast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('GoalList UI Component', () => {
  it('renders a list of goals accurately', () => {
    const mockGoals = [
      { id: '1', description: 'Run 5k', targetDate: '2026-12-31T00:00:00Z', isCompleted: false },
    ];
    
    render(<GoalList goals={mockGoals} onGoalChange={jest.fn()} />);
    
    expect(screen.getByText('Run 5k')).toBeInTheDocument();
    expect(screen.getByLabelText(/Mark goal "Run 5k" as complete/i)).toBeInTheDocument();
  });
});

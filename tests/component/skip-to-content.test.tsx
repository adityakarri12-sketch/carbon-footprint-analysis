import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SkipToContent } from '@/components/skip-to-content';

describe('SkipToContent Component', () => {
  it('renders correctly and has proper href', () => {
    render(<SkipToContent />);
    const link = screen.getByText(/Skip to main content/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('gains focus when tabbed', () => {
    render(<SkipToContent />);
    const link = screen.getByText(/Skip to main content/i);
    link.focus();
    expect(link).toHaveFocus();
  });
});


import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from './ProgressBar';
// In a real setup, import jest-dom for extended matchers like toHaveStyle
import '@testing-library/jest-dom';

describe('ProgressBar Component', () => {

  it('renders the label correctly', () => {
    render(<ProgressBar label="Savings Goal" percentage={50} />);

    // Assert that the label text is in the document
    expect(screen.getByText('Savings Goal')).toBeInTheDocument();
  });

  it('renders the default percentage text when textValue is not provided', () => {
    render(<ProgressBar label="Test" percentage={75} />);

    // Should default to "75%"
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders a custom textValue if provided', () => {
    render(<ProgressBar label="Test" percentage={75} textValue="LKR 75,000" />);

    // Should show custom text instead of percentage
    expect(screen.getByText('LKR 75,000')).toBeInTheDocument();
  });

  it('applies the correct width style based on percentage', () => {
    // We need to query the actual fill div. We can do this by adding a data-testid to it in the component, 
    // or by querying the CSS class. Assuming the class is 'progress-fill'.
    const { container } = render(<ProgressBar label="Test" percentage={60} />);

    const fillElement = container.querySelector('.progress-fill');

    // Assert the inline style was calculated correctly
    expect(fillElement).toHaveStyle({ width: '60%' });
  });

  it('clamps the percentage between 0 and 100', () => {
    // Testing the Math.min(Math.max(percentage, 0), 100) logic
    const { container } = render(<ProgressBar label="Test" percentage={150} />);

    const fillElement = container.querySelector('.progress-fill');

    // Even though we passed 150, the width should be capped at 100%
    expect(fillElement).toHaveStyle({ width: '100%' });
  });

  it('applies the correct color variant class', () => {
    const { container } = render(<ProgressBar label="Test" percentage={50} variant="danger" />);

    const fillElement = container.querySelector('.progress-fill');

    // Assert the variant prop translated to the correct CSS class
    expect(fillElement).toHaveClass('bg-danger');
  });
});

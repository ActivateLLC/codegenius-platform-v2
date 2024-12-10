import { render, screen, fireEvent } from '@testing-library/react';
import { Assistant } from '@/components/AI/Assistant';

describe('Assistant', () => {
  it('renders the input field', () => {
    render(<Assistant />);
    expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<Assistant />);
    const input = screen.getByPlaceholderText('Ask me anything...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(input).toHaveValue('Test message');
  });
});
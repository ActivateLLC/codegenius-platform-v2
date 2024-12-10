import { render, screen } from '@testing-library/react';
import { MonacoEditor } from '@/components/Editor/MonacoEditor';

jest.mock('@monaco-editor/react', () => {
  return jest.fn().mockImplementation(({ value, onChange }) => (
    <div data-testid="mock-monaco-editor">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ));
});

describe('MonacoEditor', () => {
  it('renders the editor', () => {
    render(<MonacoEditor />);
    expect(screen.getByTestId('mock-monaco-editor')).toBeInTheDocument();
  });
});
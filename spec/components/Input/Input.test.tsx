import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../../../src/components/Input/Input';

describe('Input Component', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders with default placeholder', () => {
    const { getByPlaceholderText } = render(<Input onSubmit={mockSubmit} />);
    expect(getByPlaceholderText('Ask anything')).toBeInTheDocument();
  });

  it('renders with custom placeholder via translations', () => {
    const { getByPlaceholderText } = render(
      <Input onSubmit={mockSubmit} translations={{ 'Ask anything': 'Custom placeholder' }} />,
    );
    expect(getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('renders with placeholder prop when translations not provided', () => {
    const { getByPlaceholderText } = render(
      <Input onSubmit={mockSubmit} placeholder='Custom placeholder' />,
    );
    expect(getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('prefers translations over placeholder prop', () => {
    const { getByPlaceholderText } = render(
      <Input
        onSubmit={mockSubmit}
        placeholder='From prop'
        translations={{ 'Ask anything': 'From translations' }}
      />,
    );
    expect(getByPlaceholderText('From translations')).toBeInTheDocument();
  });

  it('handles text input', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} />);
    const input = queryByRole('textbox')! as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test input' } });
    expect(input.value).toBe('test input');
  });

  it('calls onSubmit when clicking send button', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} />);
    const input = queryByRole('textbox')!;
    const button = queryByRole('button')!;

    fireEvent.change(input, { target: { value: 'test input' } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('test input');
  });

  it('calls onSubmit when pressing Enter', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} />);
    const input = queryByRole('textbox')!;

    fireEvent.change(input, { target: { value: 'test input' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSubmit).toHaveBeenCalledWith('test input');
  });

  it('calls preventDefault on Enter to avoid parent form submission', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} />);
    const input = queryByRole('textbox')!;

    fireEvent.change(input, { target: { value: 'test input' } });

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    act(() => {
      input.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });

  it('does not call onSubmit with empty input', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} />);
    const button = queryByRole('button')!;

    fireEvent.click(button);

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('disables input and button when disabled prop is true', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} disabled />);

    const input = queryByRole('textbox')!;
    const button = queryByRole('button')!;

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('retains value after submit when it matches providedValue (default mode)', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} value='Does this come in blue?' />);
    const input = queryByRole('textbox')! as HTMLInputElement;
    const button = queryByRole('button')!;

    expect(input.value).toBe('Does this come in blue?');

    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('Does this come in blue?');
    expect(input.value).toBe('Does this come in blue?');
  });

  it('clears value after submit when it differs from providedValue', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} value='Does this come in blue?' />);
    const input = queryByRole('textbox')! as HTMLInputElement;
    const button = queryByRole('button')!;

    fireEvent.change(input, { target: { value: 'A different question' } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('A different question');
    expect(input.value).toBe('');
  });

  describe('componentOverride', () => {
    it('renders the override and passes render props', () => {
      const override = jest.fn(() => <div data-testid='custom-input'>Custom</div>);
      const mockFocus = jest.fn();
      const { getByTestId, queryByRole } = render(
        <Input
          onSubmit={mockSubmit}
          onFocus={mockFocus}
          disabled
          translations={{ 'Ask anything': 'Type here' }}
          componentOverride={{ reactNode: override }}
        />,
      );

      expect(getByTestId('custom-input')).toBeInTheDocument();
      expect(queryByRole('textbox')).not.toBeInTheDocument();
      expect(override).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
          placeholder: 'Type here',
          onSubmit: expect.any(Function),
          onFocus: mockFocus,
          translations: { 'Ask anything': 'Type here' },
        }),
      );
    });

    it('trims and guards empty values in override onSubmit', () => {
      let capturedSubmit: (val: string) => void = () => {};
      const override = jest.fn((props) => {
        capturedSubmit = props.onSubmit;
        return <div data-testid='custom-input' />;
      });

      render(<Input onSubmit={mockSubmit} componentOverride={{ reactNode: override }} />);
      expect(override).toHaveBeenCalled();

      act(() => { capturedSubmit('   '); });
      expect(mockSubmit).not.toHaveBeenCalled();

      act(() => { capturedSubmit('  hello world  '); });
      expect(mockSubmit).toHaveBeenCalledWith('hello world');
    });
  });
});

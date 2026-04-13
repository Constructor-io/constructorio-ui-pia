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
    const input = queryByRole('textbox');
    fireEvent.change(input, { target: { value: 'test input' } });
    expect(input.value).toBe('test input');
  });

  it('calls onSubmit when clicking send button', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} />);
    const input = queryByRole('textbox');
    const button = queryByRole('button');

    fireEvent.change(input, { target: { value: 'test input' } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('test input');
  });

  it('calls onSubmit when pressing Enter', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} />);
    const input = queryByRole('textbox');

    fireEvent.change(input, { target: { value: 'test input' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockSubmit).toHaveBeenCalledWith('test input');
  });

  it('calls preventDefault on Enter to avoid parent form submission', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} />);
    const input = queryByRole('textbox');

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
    const button = queryByRole('button');

    fireEvent.click(button);

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('disables input and button when disabled prop is true', () => {
    const { queryByRole } = render(<Input onSubmit={mockSubmit} disabled />);

    const input = queryByRole('textbox');
    const button = queryByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});

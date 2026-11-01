import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import useUserInitiatedFocus from '../../../src/hooks/useUserInitiatedFocus';

let isUserInitiatedFocus: () => boolean;

function Harness() {
  isUserInitiatedFocus = useUserInitiatedFocus();

  return (
    <>
      <label htmlFor='question'>Ask a question</label>
      <input id='question' />
      <button type='button'>Close</button>
    </>
  );
}

describe('Testing Hook: useUserInitiatedFocus', () => {
  let now: number;

  beforeEach(() => {
    now = 1000;
    jest.spyOn(performance, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('is false for focus moved in code', () => {
    render(<Harness />);
    screen.getByRole('textbox').focus();

    expect(isUserInitiatedFocus()).toBe(false);
  });

  it('is true when the focused input was just pressed', () => {
    render(<Harness />);
    const input = screen.getByRole('textbox');
    fireEvent.pointerDown(input);
    input.focus();

    expect(isUserInitiatedFocus()).toBe(true);
  });

  it('is true when the input was focused by pressing its label', () => {
    render(<Harness />);
    fireEvent.pointerDown(screen.getByText('Ask a question'));
    screen.getByRole('textbox').focus();

    expect(isUserInitiatedFocus()).toBe(true);
  });

  it('is false when the press was on another control', () => {
    render(<Harness />);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Close' }));
    screen.getByRole('textbox').focus();

    expect(isUserInitiatedFocus()).toBe(false);
  });

  it('is true when the shopper just pressed Tab', () => {
    render(<Harness />);
    fireEvent.keyDown(document.body, { key: 'Tab' });
    screen.getByRole('textbox').focus();

    expect(isUserInitiatedFocus()).toBe(true);
  });

  it('is false once the press or Tab is no longer recent', () => {
    render(<Harness />);
    const input = screen.getByRole('textbox');
    fireEvent.pointerDown(input);
    fireEvent.keyDown(document.body, { key: 'Tab' });
    now += 5000;
    input.focus();

    expect(isUserInitiatedFocus()).toBe(false);
  });

  it('stops listening once unmounted', () => {
    const removeEventListener = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(<Harness />);
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), true);
    expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), true);
  });
});

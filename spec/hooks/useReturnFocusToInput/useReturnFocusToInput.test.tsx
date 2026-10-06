import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import useReturnFocusToInput from '../../../src/hooks/useReturnFocusToInput';

let ask: () => void;

function Harness({ isLoading }: { isLoading: boolean }) {
  const { inputRef, returnFocusAfterLoading } = useReturnFocusToInput(isLoading);
  ask = returnFocusAfterLoading;

  return (
    <>
      <input aria-label='Question' ref={inputRef} />
      <button type='button'>Elsewhere</button>
    </>
  );
}

describe('Testing Hook: useReturnFocusToInput', () => {
  it('focuses the input once loading ends if focus was dropped to the page', () => {
    const { rerender } = render(<Harness isLoading={false} />);
    ask();
    rerender(<Harness isLoading />);
    rerender(<Harness isLoading={false} />);

    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('leaves focus alone if the shopper moved it while loading', () => {
    const { rerender } = render(<Harness isLoading={false} />);
    ask();
    rerender(<Harness isLoading />);
    const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
    elsewhere.focus();
    rerender(<Harness isLoading={false} />);

    expect(elsewhere).toHaveFocus();
  });

  it('does not take focus when loading ends without the shopper asking', () => {
    const { rerender } = render(<Harness isLoading />);
    rerender(<Harness isLoading={false} />);

    expect(screen.getByRole('textbox')).not.toHaveFocus();
  });

  it('only returns focus once per ask', () => {
    const { rerender } = render(<Harness isLoading={false} />);
    ask();
    rerender(<Harness isLoading />);
    rerender(<Harness isLoading={false} />);
    screen.getByRole('textbox').blur();
    rerender(<Harness isLoading />);
    rerender(<Harness isLoading={false} />);

    expect(screen.getByRole('textbox')).not.toHaveFocus();
  });
});

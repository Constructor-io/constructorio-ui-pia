import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSkeleton from '../../../src/components/LoadingSkeleton/LoadingSkeleton';

describe('LoadingSkeleton Component', () => {
  it('renders the skeleton bars', () => {
    render(<LoadingSkeleton />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    it('is decorative rather than a live region of its own', () => {
      render(<LoadingSkeleton />);

      const skeleton = screen.getByTestId('loading-skeleton');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      // The loading state is announced by the always-mounted status region in
      // CioPiaQna and by the surrounding role='log' in conversation mode. A second
      // live region here would duplicate that announcement or nest inside it, and
      // the `aria-busy` it used to carry suppressed announcements outright.
      expect(skeleton).not.toHaveAttribute('role');
      expect(skeleton).not.toHaveAttribute('aria-busy');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('renders a component override instead of the default skeleton', () => {
    render(
      <LoadingSkeleton
        componentOverride={{
          reactNode: () => <div data-testid='custom-skeleton'>Loading…</div>,
        }}
      />,
    );

    expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
  });
});

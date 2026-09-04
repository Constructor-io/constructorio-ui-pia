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

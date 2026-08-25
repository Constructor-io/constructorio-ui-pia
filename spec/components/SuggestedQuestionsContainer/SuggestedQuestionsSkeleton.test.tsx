import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestedQuestionsSkeleton from '../../../src/components/SuggestedQuestionsContainer/SuggestedQuestionsSkeleton';

describe('SuggestedQuestionsSkeleton Component', () => {
  it('renders the placeholder pills', () => {
    render(<SuggestedQuestionsSkeleton />);

    expect(screen.getByTestId('suggested-questions-skeleton')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    it('is decorative rather than a live region of its own', () => {
      render(<SuggestedQuestionsSkeleton />);

      const skeleton = screen.getByTestId('suggested-questions-skeleton');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      // Suggested questions are ancillary to the answer: announcing their loading
      // state competes with the answer status region for the same politeness queue.
      expect(skeleton).not.toHaveAttribute('role');
      expect(skeleton).not.toHaveAttribute('aria-busy');
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});

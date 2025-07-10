import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestedQuestion from '../../../src/components/SuggestedQuestion/SuggestedQuestion';

const testSuggestedQuestion = 'Test question?';

describe('SuggestedQuestion Component', () => {
  const defaultProps = {
    question: testSuggestedQuestion,
    onClick: jest.fn(),
  };

  it('renders the question text', () => {
    const { getByText } = render(<SuggestedQuestion {...defaultProps} />);
    expect(getByText(testSuggestedQuestion)).toBeInTheDocument();
  });

  it('renders the question icon', () => {
    const { queryByRole } = render(<SuggestedQuestion {...defaultProps} />);
    expect(queryByRole('button')).toContainElement(
      document.querySelector('.cio-pia-suggested-question-icon'),
    );
  });

  it('calls onClick when clicked', () => {
    const { queryByRole } = render(<SuggestedQuestion {...defaultProps} />);
    fireEvent.click(queryByRole('button'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});

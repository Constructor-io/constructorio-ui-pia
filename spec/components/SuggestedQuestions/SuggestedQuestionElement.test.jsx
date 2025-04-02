import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestedQuestionElement from '../../../src/components/SuggestedQuestions/SuggestedQuestionElement';

describe('Testing Component: SuggestedQuestionElement', () => {
  const defaultProps = {
    question: 'Test question?',
    onClick: jest.fn(),
  };

  it('renders the question text', () => {
    const { getByText } = render(<SuggestedQuestionElement {...defaultProps} />);
    expect(getByText('Test question?')).toBeInTheDocument();
  });

  it('renders the question icon', () => {
    const { queryByRole } = render(<SuggestedQuestionElement {...defaultProps} />);
    expect(queryByRole('button')).toContainElement(
      document.querySelector('.cio-asa-pdp-suggested-question-icon'),
    );
  });

  it('calls onClick when clicked', () => {
    const { queryByRole } = render(<SuggestedQuestionElement {...defaultProps} />);
    fireEvent.click(queryByRole('button'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});

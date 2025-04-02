import React from 'react';
import { render, fireEvent, getByTestId, queryByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestedQuestions from '../../../src/components/SuggestedQuestions/SuggestedQuestions';
import { MOCK_QUESTIONS } from '../../../src/constants';

describe('Testing Component: SuggestedQuestions', () => {
  const defaultProps = {
    itemId: 'test-item-id',
    onQuestionClick: jest.fn(),
  };

  it('Should render the component with default props', () => {
    const { container } = render(<SuggestedQuestions {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Should render questions when provided', () => {
    const { getByText } = render(<SuggestedQuestions {...defaultProps} />);

    expect(getByText(MOCK_QUESTIONS[0])).toBeInTheDocument();
    expect(getByText(MOCK_QUESTIONS[1])).toBeInTheDocument();
  });

  it('Should call onQuestionClick when a question is clicked', () => {
    const { getByText } = render(<SuggestedQuestions {...defaultProps} />);
    fireEvent.click(getByText(MOCK_QUESTIONS[0]));
    expect(defaultProps.onQuestionClick).toHaveBeenCalledWith(MOCK_QUESTIONS[0]);
  });
});

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestedQuestionsContainer from '../../../src/components/SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import { MOCK_QUESTIONS } from '../../../src/constants';
import useSuggestedQuestions from '../../../src/hooks/useSuggestedQuestions';

// Mock useSuggestedQuestions hook
jest.mock('../../../src/hooks/useSuggestedQuestions', () => jest.fn());

describe('SuggestedQuestionsContainer Component', () => {
  const defaultProps = {
    questions: MOCK_QUESTIONS,
    onQuestionClick: jest.fn(),
  };

  beforeEach(() => {
    useSuggestedQuestions.mockReturnValue({
      questions: MOCK_QUESTIONS,
      error: null,
      refetch: jest.fn(),
    });

    defaultProps.onQuestionClick.mockClear();
  });

  it('renders the component with questions', () => {
    render(<SuggestedQuestionsContainer {...defaultProps} />);

    expect(screen.getByTestId('suggested-questions-list')).toBeInTheDocument();
    MOCK_QUESTIONS.forEach((question) => {
      expect(screen.getByText(question.value)).toBeInTheDocument();
    });
  });

  it('does not render any questions when none is provided', async () => {
    const { container } = render(
      <SuggestedQuestionsContainer questions={[]} onQuestionClick={defaultProps.onQuestionClick} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('calls onQuestionClick when a question is clicked', async () => {
    const { getByText } = render(<SuggestedQuestionsContainer {...defaultProps} />);

    expect(getByText(MOCK_QUESTIONS[0].value)).toBeInTheDocument();

    fireEvent.click(getByText(MOCK_QUESTIONS[0].value));
    expect(defaultProps.onQuestionClick).toHaveBeenCalledWith(MOCK_QUESTIONS[0].value);
  });
});

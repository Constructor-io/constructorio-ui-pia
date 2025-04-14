import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestedQuestionsContainer from '../../../src/components/SuggestedQuestion/SuggestedQuestionsContainer';
import { MOCK_QUESTIONS } from '../../../src/constants';
import useSuggestedQuestions from '../../../src/hooks/useSuggestedQuestions';

// Mock useSuggestedQuestions hook
jest.mock('../../../src/hooks/useSuggestedQuestions', () => jest.fn());

describe('Testing Component: SuggestedQuestionsContainer', () => {
  const defaultProps = {
    itemId: 'test-item-id',
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

  it('Should render the component with questions', () => {
    render(<SuggestedQuestionsContainer {...defaultProps} />);

    expect(useSuggestedQuestions).toHaveBeenCalledWith({ itemId: defaultProps.itemId });

    expect(screen.getByTestId('suggested-questions-list')).toBeInTheDocument();
    MOCK_QUESTIONS.forEach((question) => {
      expect(screen.getByText(question.value)).toBeInTheDocument();
    });
  });

  it('Should not render any questions when none are returned', async () => {
    // Mock fetch to return empty questions array
    useSuggestedQuestions.mockReturnValueOnce({
      questions: [],
      error: null,
      refetch: jest.fn(),
    });

    render(<SuggestedQuestionsContainer {...defaultProps} />);

    await waitFor(() => {
      // Verify no questions are rendered
      MOCK_QUESTIONS.forEach((question) => {
        expect(screen.queryByText(question.value)).not.toBeInTheDocument();
      });
    });
  });

  it('Should call onQuestionClick when a question is clicked', async () => {
    const { getByText } = render(<SuggestedQuestionsContainer {...defaultProps} />);

    await waitFor(() => {
      expect(getByText(MOCK_QUESTIONS[0].value)).toBeInTheDocument();
    });

    fireEvent.click(getByText(MOCK_QUESTIONS[0].value));
    expect(defaultProps.onQuestionClick).toHaveBeenCalledWith(MOCK_QUESTIONS[0]);
  });

  it('Should handle fetch errors gracefully', async () => {
    const { container, getByTestId } = render(
      <SuggestedQuestionsContainer {...defaultProps} isError={true} />,
    );

    // Component should still render without crashing
    expect(container.firstChild).toBeInTheDocument();
    expect(getByTestId('suggested-questions-container-error-block')).toBeInTheDocument();
  });
});

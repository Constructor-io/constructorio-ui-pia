import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestedQuestionsContainer from '../../../src/components/SuggestedQuestion/SuggestedQuestionsContainer';
import { MOCK_QUESTIONS } from '../../../src/constants';
import useSuggestedQuestions from '../../../src/hooks/useSuggestedQuestions';

// Mock useSuggestedQuestions hook
jest.mock('../../../src/hooks/useSuggestedQuestions', () => ({
  default: jest.fn(),
}));

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

    MOCK_QUESTIONS.forEach((question) => {
      expect(screen.getByText(question.value)).toBeInTheDocument();
    });

    expect(screen.getByTestId('suggested-questions-list')).toBeInTheDocument();
  });

  it('Should render questions when provided', async () => {
    await act(async () => {
      render(<SuggestedQuestionsContainer {...defaultProps} />);
    });

    await waitFor(() => {
      expect(screen.getByText(MOCK_QUESTIONS[0])).toBeInTheDocument();
      expect(screen.getByText(MOCK_QUESTIONS[1])).toBeInTheDocument();
    });
  });

  it('Should call onQuestionClick when a question is clicked', async () => {
    const { getByText } = render(<SuggestedQuestionsContainer {...defaultProps} />);

    await waitFor(() => {
      expect(getByText(MOCK_QUESTIONS[0])).toBeInTheDocument();
    });

    fireEvent.click(getByText(MOCK_QUESTIONS[0]));
    expect(defaultProps.onQuestionClick).toHaveBeenCalledWith(MOCK_QUESTIONS[0]);
  });

  it('Should fetch questions using the provided itemId', async () => {
    render(<SuggestedQuestionsContainer {...defaultProps} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(defaultProps.itemId));
    });
  });

  it('Should handle fetch errors gracefully', async () => {
    // Mock fetch to return an error
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to fetch' }),
      }),
    );

    const { container } = render(<SuggestedQuestionsContainer {...defaultProps} />);

    // Component should still render without crashing
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Should not render any questions when none are returned', async () => {
    // Mock fetch to return empty questions array
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ questions: [] }),
      }),
    );

    const { container } = render(<SuggestedQuestionsContainer {...defaultProps} />);

    await waitFor(() => {
      // Verify no questions are rendered
      MOCK_QUESTIONS.forEach((question) => {
        expect(screen.queryByText(question)).not.toBeInTheDocument();
      });
    });
  });
  expect(defaultProps.onQuestionClick).toHaveBeenCalledWith(MOCK_QUESTIONS[0]);
});

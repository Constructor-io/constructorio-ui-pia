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

  describe('Component Override Tests', () => {
    it('renders custom content when componentOverride.reactNode is a render props function', () => {
      render(
        <SuggestedQuestionsContainer
          {...defaultProps}
          componentOverride={{
            reactNode: ({ questions, onQuestionClick }) => (
              <div data-testid='custom-suggested-questions'>
                <span data-testid='custom-questions-count'>{questions.length}</span>
                <button
                  type='button'
                  data-testid='custom-question-button'
                  onClick={() => onQuestionClick(questions[0].value)}>
                  {questions[0].value}
                </button>
              </div>
            ),
          }}
        />,
      );

      expect(screen.getByTestId('custom-suggested-questions')).toBeInTheDocument();
      expect(screen.getByTestId('custom-questions-count')).toHaveTextContent(
        MOCK_QUESTIONS.length.toString(),
      );
      expect(screen.getByTestId('custom-question-button')).toHaveTextContent(
        MOCK_QUESTIONS[0].value,
      );
      expect(screen.queryByTestId('suggested-questions-list')).not.toBeInTheDocument();
    });

    it('renders a static ReactNode override instead of the default list', () => {
      render(
        <SuggestedQuestionsContainer
          {...defaultProps}
          componentOverride={{
            reactNode: <div data-testid='static-override'>Static Override Content</div>,
          }}
        />,
      );

      expect(screen.getByTestId('static-override')).toBeInTheDocument();
      expect(screen.getByText('Static Override Content')).toBeInTheDocument();
      expect(screen.queryByTestId('suggested-questions-list')).not.toBeInTheDocument();
    });

    it('calls onQuestionClick received in render props function when invoked', () => {
      render(
        <SuggestedQuestionsContainer
          {...defaultProps}
          componentOverride={{
            reactNode: ({ questions, onQuestionClick }) => (
              <div data-testid='custom-suggested-questions'>
                {questions.map((question) => (
                  <button
                    key={question.value}
                    type='button'
                    data-testid='custom-question-button'
                    onClick={() => onQuestionClick(question.value)}>
                    {question.value}
                  </button>
                ))}
              </div>
            ),
          }}
        />,
      );

      const buttons = screen.getAllByTestId('custom-question-button');
      fireEvent.click(buttons[0]);

      expect(defaultProps.onQuestionClick).toHaveBeenCalledWith(MOCK_QUESTIONS[0].value);
      expect(defaultProps.onQuestionClick).toHaveBeenCalledTimes(1);
    });
  });
});

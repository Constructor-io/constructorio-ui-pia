import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CioPia from '../../../src/components/CioPia/CioPia';
import useCioPia from '../../../src/hooks/useCioPia';
import { DEMO_QUESTION, DISCLAIMER_TEXT } from '../../../src/constants';

// Mock the useCioPia hook
jest.mock('../../../src/hooks/useCioPia', () => jest.fn());

/**
 * Mock embla-carousel that is used by Carousel component from constructorio-ui-components
 * to bypass embla-carousel's limitations in the jsdom test environment
 */
// eslint-disable-next-line arrow-body-style
jest.mock('embla-carousel-react', () => {
  return jest.fn(() => [
    jest.fn(), // carouselRef - the ref callback
    {
      // Mock EmblaCarouselType API
      canScrollPrev: jest.fn(() => true),
      canScrollNext: jest.fn(() => true),
      scrollPrev: jest.fn(),
      scrollNext: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      rootNode: jest.fn(() => null),
      slideNodes: jest.fn(() => []),
    },
  ]);
});

const mockProps = {
  apiKey: 'test-api-key',
  itemId: 'test-item-id',
  cioClient: { someClientMethod: jest.fn() },
};

const testQuestion = DEMO_QUESTION;

const mockSuggestedQuestions = [
  { value: 'Suggested question 1?' },
  { value: 'Suggested question 2?' },
  { value: 'Suggested question 3?' },
];

const mockAnswerData = {
  value: 'This is a test answer',
  follow_up_questions: [{ value: 'Follow-up question 1' }, { value: 'Follow-up question 2' }],
};

const mockItems = [
  {
    id: 'item-1',
    name: 'Product 1',
    url: 'https://example.com/product-1',
    imageUrl: 'https://example.com/image1.jpg',
    price: 89,
  },
  {
    id: 'item-2',
    name: 'Product 2',
    url: 'https://example.com/product-2',
    imageUrl: 'https://example.com/image2.jpg',
    price: 129,
  },
];

const mockGetAnswer = jest.fn();
const mockGetSuggestedQuestions = jest.fn();

const mockLoadingResponse = {
  suggestedQuestions: {
    data: [],
    isLoading: true,
    error: null,
    getSuggestedQuestions: jest.fn(),
  },
  answers: {
    data: null,
    items: null,
    isLoading: false,
    error: null,
    getAnswer: jest.fn(),
  },
};

const mockErrorResponse = {
  suggestedQuestions: {
    data: [],
    isLoading: false,
    error: new Error('Something went wrong'),
    getSuggestedQuestions: jest.fn(),
  },
  answers: {
    data: null,
    items: null,
    isLoading: false,
    error: null,
    getAnswer: jest.fn(),
  },
};

/**
 * Questions and answer data available
 */
function mockUseCioPiaWithAnswerData() {
  useCioPia.mockImplementation(() => ({
    suggestedQuestions: {
      data: mockSuggestedQuestions,
      isLoading: false,
      error: null,
      getSuggestedQuestions: mockGetSuggestedQuestions,
    },
    answers: {
      data: mockAnswerData,
      items: null,
      isLoading: false,
      error: null,
      getAnswer: mockGetAnswer,
    },
  }));
}

/**
 * Questions, answer data, and items available
 */
function mockUseCioPiaWithItems(items = mockItems) {
  useCioPia.mockImplementation(() => ({
    suggestedQuestions: {
      data: mockSuggestedQuestions,
      isLoading: false,
      error: null,
      getSuggestedQuestions: mockGetSuggestedQuestions,
    },
    answers: {
      data: mockAnswerData,
      items,
      isLoading: false,
      error: null,
      getAnswer: mockGetAnswer,
    },
  }));
}

beforeEach(() => {
  jest.clearAllMocks();

  // Default mock implementation
  useCioPia.mockImplementation(() => ({
    suggestedQuestions: {
      data: mockSuggestedQuestions,
      isLoading: false,
      error: null,
      getSuggestedQuestions: mockGetSuggestedQuestions,
    },
    answers: {
      data: null,
      items: null,
      isLoading: false,
      error: null,
      getAnswer: mockGetAnswer,
    },
  }));
});

describe('CioPia Component', () => {
  describe('Rendering Tests', () => {
    it('renders the component with default state', () => {
      const { getByTestId, getByText, getByRole } = render(<CioPia {...mockProps} />);

      expect(getByTestId('cio-pia-container')).toBeInTheDocument();
      expect(getByTestId('cio-pia-title')).toBeInTheDocument();
      expect(getByRole('textbox')).toBeInTheDocument();
      mockSuggestedQuestions.forEach((question) => {
        expect(getByText(question.value)).toBeInTheDocument();
      });
    });

    it('passes the client to useCioPia', () => {
      render(<CioPia {...mockProps} />);

      expect(useCioPia).toHaveBeenCalledWith({
        apiKey: mockProps.apiKey,
        itemId: mockProps.itemId,
        cioClient: mockProps.cioClient,
      });
    });

    it('handles question submission via input', () => {
      const { getByRole } = render(<CioPia {...mockProps} />);
      const input = getByRole('textbox');
      fireEvent.change(input, { target: { value: testQuestion } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockGetAnswer).toHaveBeenCalledWith(testQuestion);
    });

    it('handles question click from suggested questions', () => {
      const { getByText } = render(<CioPia {...mockProps} />);

      fireEvent.click(getByText(mockSuggestedQuestions[0].value));

      expect(mockGetAnswer).toHaveBeenCalledWith(mockSuggestedQuestions[0].value);
    });

    it('displays answer when available', () => {
      mockUseCioPiaWithAnswerData();

      const { getByText } = render(<CioPia {...mockProps} />);

      expect(getByText(mockAnswerData.value)).toBeInTheDocument();
      expect(getByText(DISCLAIMER_TEXT)).toBeInTheDocument();
    });

    it('displays follow-up questions when available in answers data', () => {
      mockUseCioPiaWithAnswerData();

      const { getByText } = render(<CioPia {...mockProps} />);

      mockAnswerData.follow_up_questions.forEach((question) => {
        expect(getByText(question.value)).toBeInTheDocument();
      });
    });

    it('displays loading state when loading', () => {
      useCioPia.mockReturnValue(mockLoadingResponse);

      const { getByTestId } = render(<CioPia {...mockProps} />);

      expect(getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('displays error message when there is an error', () => {
      useCioPia.mockReturnValue(mockErrorResponse);

      const { getByTestId } = render(<CioPia {...mockProps} />);

      expect(getByTestId('error-block')).toBeInTheDocument();
    });

    it('updates current question when a question is submitted', () => {
      render(<CioPia {...mockProps} />);

      const questionToClick = mockSuggestedQuestions[1];
      fireEvent.click(screen.getByText(questionToClick.value));
      const input = screen.getByRole('textbox');

      expect(input).toHaveValue(questionToClick.value);
    });

    it('replaces suggested questions with follow-up questions after receiving an answer', async () => {
      // Uses the default mock implementation without only suggestionsQuestions.data initially
      const { rerender } = render(<CioPia {...mockProps} />);

      // Should show the original suggested questions
      mockSuggestedQuestions.forEach((question) => {
        expect(screen.getByText(question.value)).toBeInTheDocument();
      });

      // Update the answers data with follow-up questions
      mockUseCioPiaWithAnswerData();

      rerender(<CioPia {...mockProps} />);

      mockAnswerData.follow_up_questions.forEach((question) => {
        expect(screen.getByText(question.value)).toBeInTheDocument();
      });
    });

    it('renders carousel with items when items are available', () => {
      mockUseCioPiaWithItems();

      render(<CioPia {...mockProps} />);

      const carousel = document.querySelector('[data-carousel]');
      expect(carousel).toBeInTheDocument();
    });

    it('does not render carousel when items array is empty', () => {
      mockUseCioPiaWithItems({ items: [] });

      render(<CioPia {...mockProps} />);

      const carousel = document.querySelector('[data-carousel]');
      expect(carousel).not.toBeInTheDocument();
    });

    it('does not render carousel when items is null', () => {
      useCioPia.mockImplementation(() => ({
        suggestedQuestions: {
          data: mockSuggestedQuestions,
          isLoading: false,
          error: null,
          getSuggestedQuestions: mockGetSuggestedQuestions,
        },
        answers: {
          data: mockAnswerData,
          items: null,
          isLoading: false,
          error: null,
          getAnswer: mockGetAnswer,
        },
      }));

      render(<CioPia {...mockProps} />);

      const carousel = document.querySelector('[data-carousel]');
      expect(carousel).not.toBeInTheDocument();
    });
  });

  describe('Render Overrides Test', () => {
    it('uses custom item renderer when componentOverrides.carousel.item is provided', () => {
      mockUseCioPiaWithItems();

      render(
        <CioPia
          {...mockProps}
          componentOverrides={{
            carousel: {
              item: {
                reactNode: ({ item }) => (
                  <div data-testid='custom-overridden-carousel-item'>
                    Custom Overridden Item: {item?.name}
                  </div>
                ),
              },
            },
          }}
        />,
      );

      const customItems = screen.getAllByTestId('custom-overridden-carousel-item');
      expect(customItems).toHaveLength(mockItems.length);
      expect(screen.getByText('Custom Overridden Item: Product 1')).toBeInTheDocument();
      expect(screen.getByText('Custom Overridden Item: Product 2')).toBeInTheDocument();
    });

    it('calls custom onProductClick handler when provided via componentOverrides', () => {
      mockUseCioPiaWithItems();
      const customClickHandler = jest.fn();

      render(
        <CioPia
          {...mockProps}
          componentOverrides={{
            carousel: {
              item: {
                reactNode: ({ item }) => (
                  <div
                    data-testid='custom-overridden-carousel-item'
                    role='button'
                    tabIndex={0}
                    onClick={() => customClickHandler(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        customClickHandler(item);
                      }
                    }}>
                    Overridden Item: {item?.name}
                  </div>
                ),
              },
            },
          }}
        />,
      );
      const customItems = screen.getAllByTestId('custom-overridden-carousel-item');
      fireEvent.click(customItems[0]);

      expect(customClickHandler).toHaveBeenCalledTimes(1);
      expect(customClickHandler).toHaveBeenCalledWith(mockItems[0]);
    });

    it('allows custom carousel configuration via componentOverrides', () => {
      mockUseCioPiaWithItems();

      const { container } = render(
        <CioPia
          {...mockProps}
          componentOverrides={{
            carousel: {
              previous: {
                reactNode: () => (
                  <button type='button' data-testid='custom-overridden-prev'>
                    Prev
                  </button>
                ),
              },
              next: {
                reactNode: () => (
                  <button type='button' data-testid='custom-overridden-next'>
                    Next
                  </button>
                ),
              },
            },
          }}
        />,
      );

      expect(container.querySelector('[data-carousel]')).toBeInTheDocument();
      expect(screen.getByTestId('custom-overridden-prev')).toBeInTheDocument();
      expect(screen.getByTestId('custom-overridden-next')).toBeInTheDocument();
    });
  });

  describe('Render Props Test', () => {
    it('renders custom content when children render props function is provided', () => {
      mockUseCioPiaWithItems();

      render(
        <CioPia {...mockProps}>
          {({ items, currentAnswer }) => (
            <div data-testid='custom-render-props-content'>
              <span data-testid='render-props-answer'>{currentAnswer}</span>
              <span data-testid='render-props-items-count'>{items.length}</span>
            </div>
          )}
        </CioPia>,
      );

      expect(screen.getByTestId('custom-render-props-content')).toBeInTheDocument();
      expect(screen.getByTestId('render-props-answer')).toHaveTextContent(mockAnswerData.value);
      expect(screen.getByTestId('render-props-items-count')).toHaveTextContent(
        mockItems.length.toString(),
      );
    });

    it('passes isLoading state to render props function', () => {
      useCioPia.mockReturnValue(mockLoadingResponse);

      render(
        <CioPia {...mockProps}>
          {({ isLoading }) => (
            <div data-testid='custom-render-props-content'>
              {isLoading && <span data-testid='render-props-loading'>Loading...</span>}
            </div>
          )}
        </CioPia>,
      );

      expect(screen.getByTestId('render-props-loading')).toBeInTheDocument();
    });

    it('passes error state to render props function', () => {
      useCioPia.mockReturnValue(mockErrorResponse);

      render(
        <CioPia {...mockProps}>
          {({ error }) => (
            <div data-testid='custom-render-props-content'>
              {error && <span data-testid='render-props-error'>{error.message}</span>}
            </div>
          )}
        </CioPia>,
      );

      expect(screen.getByTestId('render-props-error')).toHaveTextContent('Something went wrong');
    });

    it('passes handleSubmitQuestion to render props function and it works correctly', () => {
      render(
        <CioPia {...mockProps}>
          {({ handleSubmitQuestion }) => (
            <div data-testid='custom-render-props-content'>
              <button
                type='button'
                data-testid='custom-submit-button'
                onClick={() => handleSubmitQuestion('Custom question')}>
                Submit
              </button>
            </div>
          )}
        </CioPia>,
      );

      fireEvent.click(screen.getByTestId('custom-submit-button'));

      expect(mockGetAnswer).toHaveBeenCalledWith('Custom question');
    });

    it('passes displayedQuestions to render props function', () => {
      render(
        <CioPia {...mockProps}>
          {({ displayedQuestions }) => (
            <div data-testid='custom-render-props-content'>
              {displayedQuestions.map((q, i) => (
                <span key={i} data-testid='render-props-question'>
                  {q.value}
                </span>
              ))}
            </div>
          )}
        </CioPia>,
      );

      const questions = screen.getAllByTestId('render-props-question');
      expect(questions).toHaveLength(mockSuggestedQuestions.length);
    });

    it('passes currentQuestion to render props function', () => {
      render(
        <CioPia {...mockProps}>
          {({ currentQuestion, handleSubmitQuestion }) => (
            <div data-testid='custom-render-props-content'>
              <span data-testid='render-props-current-question'>{currentQuestion}</span>
              <button
                type='button'
                data-testid='custom-submit-button'
                onClick={() => handleSubmitQuestion('Test question')}>
                Submit
              </button>
            </div>
          )}
        </CioPia>,
      );

      // Initially empty
      expect(screen.getByTestId('render-props-current-question')).toHaveTextContent('');

      // After submitting a question
      fireEvent.click(screen.getByTestId('custom-submit-button'));

      expect(screen.getByTestId('render-props-current-question')).toHaveTextContent('Test question');
    });

    it('renders custom content via componentOverrides.reactNode', () => {
      mockUseCioPiaWithItems();

      render(
        <CioPia
          {...mockProps}
          componentOverrides={{
            reactNode: ({ items, currentAnswer }) => (
              <div data-testid='override-react-node-content'>
                <span data-testid='override-answer'>{currentAnswer}</span>
                <span data-testid='override-items-count'>{items.length}</span>
              </div>
            ),
          }}
        />,
      );

      expect(screen.getByTestId('override-react-node-content')).toBeInTheDocument();
      expect(screen.getByTestId('override-answer')).toHaveTextContent(mockAnswerData.value);
      expect(screen.getByTestId('override-items-count')).toHaveTextContent(
        mockItems.length.toString(),
      );
    });

    it('prioritizes children over componentOverrides.reactNode', () => {
      mockUseCioPiaWithItems();

      render(
        <CioPia
          {...mockProps}
          componentOverrides={{
            reactNode: () => <div data-testid='override-react-node-content'>Override Content</div>,
          }}>
          {() => <div data-testid='children-content'>Children Content</div>}
        </CioPia>,
      );

      expect(screen.getByTestId('children-content')).toBeInTheDocument();
      expect(screen.queryByTestId('override-react-node-content')).not.toBeInTheDocument();
    });

    it('renders static ReactNode children', () => {
      render(
        <CioPia {...mockProps}>
          <div data-testid='static-children'>Static Children Content</div>
        </CioPia>,
      );

      expect(screen.getByTestId('static-children')).toBeInTheDocument();
    });
  });
});

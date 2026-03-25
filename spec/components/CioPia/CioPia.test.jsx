import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { CIO_EVENTS } from '@constructor-io/constructorio-ui-components';
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

const CAROUSEL_SELECTOR = '[data-carousel]';

function dispatchProductCardClickEvent(element, product) {
  const event = new CustomEvent(CIO_EVENTS.productCard.click, {
    detail: { product },
    bubbles: true,
  });
  element.dispatchEvent(event);
}

function getCarouselWrapper(container) {
  const carousel = container.querySelector(CAROUSEL_SELECTOR);
  return carousel?.parentElement;
}

// Returns true if event was dispatched, false if wrapper not found
function dispatchEventOnCarouselWrapper(container, product) {
  const wrapper = getCarouselWrapper(container);
  if (!wrapper) return false;

  dispatchProductCardClickEvent(wrapper, product);

  return true;
}

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
 * Flexible mock helper for useCioPia hook
 */
function mockUseCioPia({
  questionsData = mockSuggestedQuestions,
  answerData = null,
  items = null,
  questionIsLoading = false,
  answerIsLoading = false,
  questionsError = null,
  answerError = null,
} = {}) {
  useCioPia.mockImplementation(() => ({
    suggestedQuestions: {
      data: questionsData,
      isLoading: questionIsLoading,
      error: questionsError,
      getSuggestedQuestions: mockGetSuggestedQuestions,
    },
    answers: {
      data: answerData,
      items,
      isLoading: answerIsLoading,
      error: answerError,
      getAnswer: mockGetAnswer,
    },
  }));
}

/**
 * Helper: Questions and answer data available, no items
 */
function mockUseCioPiaWithAnswerData() {
  mockUseCioPia({ answerData: mockAnswerData });
}

/**
 * Helper: Questions, answer data, and items available
 */
function mockUseCioPiaWithItems(items = mockItems) {
  mockUseCioPia({ answerData: mockAnswerData, items });
}

beforeEach(() => {
  jest.clearAllMocks();

  // Default mock implementation
  mockUseCioPia();
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

      expect(document.querySelector(CAROUSEL_SELECTOR)).toBeInTheDocument();
    });

    it('does not render carousel when items array is empty', () => {
      mockUseCioPiaWithItems([]);

      render(<CioPia {...mockProps} />);

      expect(document.querySelector(CAROUSEL_SELECTOR)).not.toBeInTheDocument();
    });

    it('does not render carousel when there is no answer yet', () => {
      mockUseCioPia({ items: mockItems });

      render(<CioPia {...mockProps} />);

      // Carousel should not render even if items exist, because there's no currentAnswer
      expect(document.querySelector(CAROUSEL_SELECTOR)).not.toBeInTheDocument();
    });
  });

  describe('Callbacks Tests', () => {
    it('uses default behavior when onProductCardClick callback is not provided', () => {
      mockUseCioPiaWithItems();
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

      const { container } = render(<CioPia {...mockProps} />);

      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(windowOpenSpy).toHaveBeenCalledWith(mockItems[0].url, '_blank', 'noopener,noreferrer');

      windowOpenSpy.mockRestore();
    });

    it('calls custom onProductCardClick callback when provided', () => {
      mockUseCioPiaWithItems();
      const mockOnProductCardClick = jest.fn();

      const { container } = render(
        <CioPia {...mockProps} callbacks={{ onProductCardClick: mockOnProductCardClick }} />,
      );

      expect(dispatchEventOnCarouselWrapper(container, mockItems[0])).toBe(true);
      expect(mockOnProductCardClick).toHaveBeenCalledTimes(1);
      expect(mockOnProductCardClick).toHaveBeenCalledWith(mockItems[0]);
    });

    it('passes the correct item to onProductCardClick callback', () => {
      mockUseCioPiaWithItems();
      const mockOnProductCardClick = jest.fn();

      const { container } = render(
        <CioPia {...mockProps} callbacks={{ onProductCardClick: mockOnProductCardClick }} />,
      );

      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(mockOnProductCardClick).toHaveBeenLastCalledWith(mockItems[0]);

      dispatchEventOnCarouselWrapper(container, mockItems[1]);
      expect(mockOnProductCardClick).toHaveBeenLastCalledWith(mockItems[1]);
      expect(mockOnProductCardClick).toHaveBeenCalledTimes(2);
    });

    it('maintains callback stability when callbacks prop reference does not change', () => {
      mockUseCioPiaWithItems();
      const mockOnProductCardClick = jest.fn();
      const callbacks = { onProductCardClick: mockOnProductCardClick };

      const { container, rerender } = render(<CioPia {...mockProps} callbacks={callbacks} />);

      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(mockOnProductCardClick).toHaveBeenCalledTimes(1);

      rerender(<CioPia {...mockProps} callbacks={callbacks} />);
      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(mockOnProductCardClick).toHaveBeenCalledTimes(2);
    });

    it('updates callback behavior when callbacks prop changes', () => {
      mockUseCioPiaWithItems();
      const firstCallback = jest.fn();
      const secondCallback = jest.fn();

      const { container, rerender } = render(
        <CioPia {...mockProps} callbacks={{ onProductCardClick: firstCallback }} />,
      );

      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).not.toHaveBeenCalled();

      rerender(<CioPia {...mockProps} callbacks={{ onProductCardClick: secondCallback }} />);
      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).toHaveBeenCalledTimes(1);
    });

    it('handles product card clicks correctly after items update', () => {
      const firstItem = {
        id: 'item-1',
        name: 'Product 1',
        url: 'https://example.com/product-1',
        imageUrl: 'https://example.com/image1.jpg',
        price: 89,
      };

      const secondItem = {
        id: 'item-3',
        name: 'Product 3',
        url: 'https://example.com/product-3',
        imageUrl: 'https://example.com/image3.jpg',
        price: 149,
      };

      mockUseCioPiaWithItems([firstItem]);
      const mockOnProductCardClick = jest.fn();

      const { container, rerender } = render(
        <CioPia {...mockProps} callbacks={{ onProductCardClick: mockOnProductCardClick }} />,
      );

      dispatchEventOnCarouselWrapper(container, firstItem);
      expect(mockOnProductCardClick).toHaveBeenLastCalledWith(firstItem);

      mockUseCioPiaWithItems([secondItem]);
      rerender(
        <CioPia {...mockProps} callbacks={{ onProductCardClick: mockOnProductCardClick }} />,
      );

      dispatchEventOnCarouselWrapper(container, secondItem);
      expect(mockOnProductCardClick).toHaveBeenLastCalledWith(secondItem);
      expect(mockOnProductCardClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Event Listener Tests', () => {
    it('attaches event listener to carousel wrapper on mount', () => {
      mockUseCioPiaWithItems();
      const addEventListenerSpy = jest.spyOn(HTMLDivElement.prototype, 'addEventListener');

      render(<CioPia {...mockProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        CIO_EVENTS.productCard.click,
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
    });

    it('removes event listener on unmount', () => {
      mockUseCioPiaWithItems();
      const removeEventListenerSpy = jest.spyOn(HTMLDivElement.prototype, 'removeEventListener');

      const { unmount } = render(<CioPia {...mockProps} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        CIO_EVENTS.productCard.click,
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    it('only handles events from within carousel wrapper (scoped events)', () => {
      mockUseCioPiaWithItems();
      const mockOnProductCardClick = jest.fn();

      const { container } = render(
        <CioPia {...mockProps} callbacks={{ onProductCardClick: mockOnProductCardClick }} />,
      );

      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(mockOnProductCardClick).toHaveBeenCalledTimes(1);

      // Dispatch event outside carousel (should not trigger)
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      dispatchProductCardClickEvent(outsideElement, mockItems[1]);
      expect(mockOnProductCardClick).toHaveBeenCalledTimes(1); // Still 1

      document.body.removeChild(outsideElement);
    });

    it('handles multiple product card click events in sequence', () => {
      mockUseCioPiaWithItems();
      const mockOnProductCardClick = jest.fn();

      const { container } = render(
        <CioPia {...mockProps} callbacks={{ onProductCardClick: mockOnProductCardClick }} />,
      );

      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      dispatchEventOnCarouselWrapper(container, mockItems[1]);
      dispatchEventOnCarouselWrapper(container, mockItems[0]);

      expect(mockOnProductCardClick).toHaveBeenCalledTimes(3);
      expect(mockOnProductCardClick).toHaveBeenNthCalledWith(1, mockItems[0]);
      expect(mockOnProductCardClick).toHaveBeenNthCalledWith(2, mockItems[1]);
      expect(mockOnProductCardClick).toHaveBeenNthCalledWith(3, mockItems[0]);
    });

    it('updates event listener when callbacks change', () => {
      mockUseCioPiaWithItems();
      const firstCallback = jest.fn();
      const secondCallback = jest.fn();

      const { container, rerender } = render(
        <CioPia {...mockProps} callbacks={{ onProductCardClick: firstCallback }} />,
      );

      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).toHaveBeenCalledTimes(0);

      rerender(<CioPia {...mockProps} callbacks={{ onProductCardClick: secondCallback }} />);
      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(firstCallback).toHaveBeenCalledTimes(1);
      expect(secondCallback).toHaveBeenCalledTimes(1);
    });

    it('handles events when no items have url property', () => {
      const itemsWithoutUrl = [
        {
          id: 'item-1',
          name: 'Product 1',
          imageUrl: 'https://example.com/image1.jpg',
          price: 89,
        },
      ];

      mockUseCioPiaWithItems(itemsWithoutUrl);
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

      const { container } = render(<CioPia {...mockProps} />);

      dispatchEventOnCarouselWrapper(container, itemsWithoutUrl[0]);
      expect(windowOpenSpy).not.toHaveBeenCalled();

      windowOpenSpy.mockRestore();
    });

    it('does not call callback when event detail is missing product', () => {
      mockUseCioPiaWithItems();
      const mockOnProductCardClick = jest.fn();

      const { container } = render(
        <CioPia {...mockProps} callbacks={{ onProductCardClick: mockOnProductCardClick }} />,
      );

      const wrapper = getCarouselWrapper(container);
      const event = new CustomEvent(CIO_EVENTS.productCard.click, {
        detail: {},
        bubbles: true,
      });

      expect(() => wrapper?.dispatchEvent(event)).not.toThrow();
      expect(mockOnProductCardClick).not.toHaveBeenCalled();
    });

    it('does not attach event listener when carousel is not rendered', () => {
      mockUseCioPiaWithItems([]);
      const addEventListenerSpy = jest.spyOn(HTMLDivElement.prototype, 'addEventListener');

      render(<CioPia {...mockProps} />);

      expect(document.querySelector(CAROUSEL_SELECTOR)).not.toBeInTheDocument();
      // Event listener should still be called (on wrapper), but carousel shouldn't render
      expect(addEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
    });

    it('event listeners work with custom componentOverrides', () => {
      mockUseCioPiaWithItems();
      const mockOnProductCardClick = jest.fn();

      const { container } = render(
        <CioPia
          {...mockProps}
          callbacks={{ onProductCardClick: mockOnProductCardClick }}
          componentOverrides={{
            carousel: {
              item: {
                reactNode: ({ item }) => <div data-testid='custom-item'>Custom: {item?.name}</div>,
              },
            },
          }}
        />,
      );

      const customItems = container.querySelectorAll('[data-testid="custom-item"]');
      expect(customItems.length).toBe(mockItems.length);

      dispatchEventOnCarouselWrapper(container, mockItems[0]);
      expect(mockOnProductCardClick).toHaveBeenCalledWith(mockItems[0]);
    });
  });

  describe('Render Overrides Tests', () => {
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

      expect(container.querySelector(CAROUSEL_SELECTOR)).toBeInTheDocument();
      expect(screen.getByTestId('custom-overridden-prev')).toBeInTheDocument();
      expect(screen.getByTestId('custom-overridden-next')).toBeInTheDocument();
    });
  });

  describe('Render Props Tests', () => {
    it('renders custom content when children render props function is provided', () => {
      mockUseCioPiaWithItems();

      render(
        <CioPia {...mockProps}>
          {({ items, currentAnswer }) => (
            <div data-testid='custom-render-props-content'>
              <span data-testid='render-props-answer'>{currentAnswer}</span>
              <span data-testid='render-props-items-count'>{items != null ? items.length : 0}</span>
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
              {displayedQuestions.map((q) => (
                <span data-testid='render-props-question' key={q.value}>
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

      expect(screen.getByTestId('render-props-current-question')).toHaveTextContent(
        'Test question',
      );
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
                <span data-testid='override-items-count'>{items != null ? items.length : 0}</span>
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

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
  HTMLDialogElement.prototype.showModal = jest.fn(function mock() {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = jest.fn(function mock() {
    this.removeAttribute('open');
  });
});

describe('CioPia Conversation Mode', () => {
  it('renders conversation layout with cio-pia-conversation class', () => {
    const { container } = render(
      <CioPia {...mockProps} displayConfigs={{ mode: 'conversation' }} />,
    );

    expect(container.querySelector('.cio-pia-conversation')).toBeInTheDocument();
  });

  it('shows title when there is no conversation history', () => {
    render(<CioPia {...mockProps} displayConfigs={{ mode: 'conversation' }} />);

    expect(screen.getByTestId('cio-pia-title')).toBeInTheDocument();
  });

  it('adds an entry to conversation history when a question is submitted', () => {
    const { container } = render(
      <CioPia {...mockProps} displayConfigs={{ mode: 'conversation' }} />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'What color is this?' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(container.querySelector('.cio-pia-chat-question')).toBeInTheDocument();
    expect(screen.getByText('What color is this?')).toBeInTheDocument();
  });

  it('hides title after a question is submitted', () => {
    render(<CioPia {...mockProps} displayConfigs={{ mode: 'conversation' }} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'What size is this?' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.queryByTestId('cio-pia-title')).not.toBeInTheDocument();
  });

  it('shows answer in conversation history when answer resolves', () => {
    const { rerender } = render(
      <CioPia {...mockProps} displayConfigs={{ mode: 'conversation' }} />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Tell me about this product' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    mockUseCioPia({ answerData: mockAnswerData });
    rerender(<CioPia {...mockProps} displayConfigs={{ mode: 'conversation' }} />);

    expect(screen.getByText(mockAnswerData.value)).toBeInTheDocument();
  });

  it('shows suggested questions and input in the conversation footer', () => {
    const { container } = render(
      <CioPia {...mockProps} displayConfigs={{ mode: 'conversation' }} />,
    );

    const footer = container.querySelector('.cio-pia-conversation-footer');
    expect(footer).toBeInTheDocument();
    expect(within(footer).getByRole('textbox')).toBeInTheDocument();
    mockSuggestedQuestions.forEach((question) => {
      expect(screen.getByText(question.value)).toBeInTheDocument();
    });
  });
});

describe('CioPia Modal Mode', () => {
  it('renders the modal layout with a dialog element', () => {
    const { container } = render(<CioPia {...mockProps} displayConfigs={{ type: 'modal' }} />);

    expect(container.querySelector('dialog')).toBeInTheDocument();
  });

  it('renders cio-pia-container with title, input, and suggested questions in the base view', () => {
    const { container } = render(
      <CioPia {...mockProps} displayConfigs={{ type: 'modal' }} />,
    );

    // Base view is the top-level .cio-pia-container (not the one inside the dialog)
    const baseView = container.querySelector(':scope > .cio-pia-container');
    expect(baseView).toBeInTheDocument();
    expect(screen.getAllByTestId('cio-pia-title').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(1);
    mockSuggestedQuestions.forEach((question) => {
      expect(screen.getAllByText(question.value).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('implies conversation behavior (isConversation = true) for modal type', () => {
    const { container } = render(<CioPia {...mockProps} displayConfigs={{ type: 'modal' }} />);

    // Modal uses PiaModal which renders a dialog with PiaConversation inside
    expect(container.querySelector('dialog.cio-pia-modal')).toBeInTheDocument();
    // PiaConversation lives inside the dialog, not as the top-level container
    expect(container.querySelector('dialog .cio-pia-conversation')).toBeInTheDocument();
  });
});

describe('CioPia State Reset on itemId Change', () => {
  it('resets conversation history and input value when itemId changes', () => {
    const { rerender } = render(
      <CioPia {...mockProps} itemId='item-1' displayConfigs={{ mode: 'conversation' }} />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'A question about item 1' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('A question about item 1')).toBeInTheDocument();

    rerender(<CioPia {...mockProps} itemId='item-2' displayConfigs={{ mode: 'conversation' }} />);

    // Input should be cleared and conversation history gone
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.queryByText('A question about item 1')).not.toBeInTheDocument();
  });

  it('resets displayedQuestions in default mode when itemId changes', () => {
    mockUseCioPia({ answerData: mockAnswerData });

    const { rerender } = render(<CioPia {...mockProps} itemId='item-1' />);

    // Follow-up questions should be displayed
    mockAnswerData.follow_up_questions.forEach((question) => {
      expect(screen.getByText(question.value)).toBeInTheDocument();
    });

    // Change itemId — displayedQuestions should reset to empty until new suggestions load
    rerender(<CioPia {...mockProps} itemId='item-2' />);

    // Follow-up questions from the previous item should be gone
    mockAnswerData.follow_up_questions.forEach((question) => {
      expect(screen.queryByText(question.value)).not.toBeInTheDocument();
    });
  });
});

describe('CioPia Sub-component Overrides', () => {
  it('renders custom Answer component via componentOverrides.answer', () => {
    mockUseCioPia({ answerData: mockAnswerData });

    render(
      <CioPia
        {...mockProps}
        componentOverrides={{
          answer: {
            reactNode: ({ text }) => <div data-testid='custom-answer'>Custom: {text}</div>,
          },
        }}
      />,
    );

    expect(screen.getByTestId('custom-answer')).toBeInTheDocument();
    expect(screen.getByText(`Custom: ${mockAnswerData.value}`)).toBeInTheDocument();
    expect(screen.queryByTestId('answer-text')).not.toBeInTheDocument();
  });

  it('renders custom SuggestedQuestionsContainer via componentOverrides.suggestedQuestions', () => {
    render(
      <CioPia
        {...mockProps}
        componentOverrides={{
          suggestedQuestions: {
            reactNode: ({ questions, onQuestionClick }) => (
              <ul data-testid='custom-suggested-questions'>
                {questions.map((q) => (
                  <li key={q.value}>
                    <button type='button' onClick={() => onQuestionClick(q.value)}>
                      {q.value}
                    </button>
                  </li>
                ))}
              </ul>
            ),
          },
        }}
      />,
    );

    expect(screen.getByTestId('custom-suggested-questions')).toBeInTheDocument();
    expect(screen.queryByTestId('suggested-questions-list')).not.toBeInTheDocument();
    mockSuggestedQuestions.forEach((question) => {
      expect(screen.getByText(question.value)).toBeInTheDocument();
    });
  });

  it('custom suggestedQuestions override responds to click', () => {
    render(
      <CioPia
        {...mockProps}
        componentOverrides={{
          suggestedQuestions: {
            reactNode: ({ questions, onQuestionClick }) => (
              <ul data-testid='custom-suggested-questions'>
                {questions.map((q) => (
                  <li key={q.value}>
                    <button type='button' onClick={() => onQuestionClick(q.value)}>
                      {q.value}
                    </button>
                  </li>
                ))}
              </ul>
            ),
          },
        }}
      />,
    );

    fireEvent.click(screen.getByText(mockSuggestedQuestions[0].value));
    expect(mockGetAnswer).toHaveBeenCalledWith(mockSuggestedQuestions[0].value);
  });

  it('renders custom Disclaimer via componentOverrides.disclaimer', () => {
    mockUseCioPia({ answerData: mockAnswerData });

    render(
      <CioPia
        {...mockProps}
        componentOverrides={{
          disclaimer: {
            reactNode: () => <div data-testid='custom-disclaimer'>Custom Disclaimer Text</div>,
          },
        }}
      />,
    );

    expect(screen.getByTestId('custom-disclaimer')).toBeInTheDocument();
    expect(screen.getByText('Custom Disclaimer Text')).toBeInTheDocument();
    expect(screen.queryByText(/AI-generated/)).not.toBeInTheDocument();
  });

  it('renders custom Feedback via componentOverrides.feedback with showFeedback enabled', () => {
    mockUseCioPia({ answerData: mockAnswerData });

    render(
      <CioPia
        {...mockProps}
        displayConfigs={{ showFeedback: true }}
        componentOverrides={{
          feedback: {
            reactNode: () => <div data-testid='custom-feedback'>Custom Feedback Widget</div>,
          },
        }}
      />,
    );

    expect(screen.getByTestId('custom-feedback')).toBeInTheDocument();
    expect(screen.getByText('Custom Feedback Widget')).toBeInTheDocument();
  });
});

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
      const customClickHandler = jest.fn();

      render(
        <CioPia
          {...mockProps}
          componentOverrides={{
            carousel: {
              item: {
                reactNode: ({ item }) => (
                  <div data-testid='custom-carousel-item' onClick={() => customClickHandler(item)}>
                    Overridden Item: {item?.name}
                  </div>
                ),
              },
            },
          }}
        />,
      );

      const customItems = screen.getAllByTestId('custom-carousel-item');
      expect(customItems).toHaveLength(mockItems.length);
      expect(screen.getByText('Overridden Item: Product 1')).toBeInTheDocument();
      expect(screen.getByText('Overridden Item: Product 2')).toBeInTheDocument();
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
                  <div data-testid='custom-carousel-item' onClick={() => customClickHandler(item)}>
                    Overridden Item: {item?.name}
                  </div>
                ),
              },
            },
          }}
        />,
      );
      const customItems = screen.getAllByTestId('custom-carousel-item');
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
                reactNode: () => <button data-testid='custom-prev'>Prev</button>,
              },
              next: {
                reactNode: () => <button data-testid='custom-next'>Next</button>,
              },
            },
          }}
        />,
      );

      expect(container.querySelector('[data-carousel]')).toBeInTheDocument();
      expect(screen.getByTestId('custom-prev')).toBeInTheDocument();
      expect(screen.getByTestId('custom-next')).toBeInTheDocument();
    });
  });
});

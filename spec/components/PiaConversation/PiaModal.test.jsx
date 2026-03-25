import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen, within } from '@testing-library/react';
import PiaModal from '../../../src/components/PiaConversation/PiaModal';
import { DISCLAIMER_TEXT } from '../../../src/constants';

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

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function mock() {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = jest.fn(function mock() {
    this.removeAttribute('open');
  });
});

const CAROUSEL_SELECTOR = '[data-carousel]';

const mockSuggestedQuestions = [
  { value: 'Suggested question 1?' },
  { value: 'Suggested question 2?' },
  { value: 'Suggested question 3?' },
];

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

const mockHandleSubmitQuestion = jest.fn();

const defaultProps = {
  currentAnswer: '',
  currentItems: null,
  displayedQuestions: mockSuggestedQuestions,
  handleSubmitQuestion: mockHandleSubmitQuestion,
  isLoading: false,
  children: <div data-testid='dialog-content'>Dialog Content</div>,
};

beforeEach(() => {
  jest.clearAllMocks();
});

// Selectors scoped to base view (direct children of .cio-pia-container, excluding dialog)
const BASE_INPUT = '.cio-pia-container > .cio-pia-input-container input';
const BASE_QUESTIONS = '.cio-pia-container > .cio-pia-suggested-questions-container';
const BASE_ANSWER = '.cio-pia-container > .cio-pia-answer-container';

describe('PiaModal Component', () => {
  describe('Base View', () => {
    it('renders title, input, and suggested questions', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      expect(screen.getByTestId('cio-pia-title')).toBeInTheDocument();
      expect(screen.getByTestId('cio-pia-title')).toHaveTextContent(
        'Any questions about this product?',
      );

      expect(container.querySelector(BASE_INPUT)).toBeInTheDocument();

      const baseQuestions = container.querySelector(BASE_QUESTIONS);
      mockSuggestedQuestions.forEach((question) => {
        expect(within(baseQuestions).getByText(question.value)).toBeInTheDocument();
      });
    });

    it('does not render answer section when currentAnswer is empty', () => {
      const { container } = render(<PiaModal {...defaultProps} currentAnswer='' />);

      expect(container.querySelector(BASE_ANSWER)).not.toBeInTheDocument();
    });

    it('renders answer and disclaimer when currentAnswer is available', () => {
      const { container } = render(
        <PiaModal {...defaultProps} currentAnswer='This is the answer' />,
      );

      const answerContainer = container.querySelector(BASE_ANSWER);
      expect(answerContainer).toBeInTheDocument();
      expect(within(answerContainer).getByText('This is the answer')).toBeInTheDocument();
      expect(within(answerContainer).getByText(DISCLAIMER_TEXT)).toBeInTheDocument();
    });

    it('renders carousel when currentItems are provided', () => {
      const { container } = render(
        <PiaModal {...defaultProps} currentAnswer='Some answer' currentItems={mockItems} />,
      );

      const answerContainer = container.querySelector(BASE_ANSWER);
      expect(answerContainer.querySelector(CAROUSEL_SELECTOR)).toBeInTheDocument();
    });

    it('does not render carousel when currentItems is null', () => {
      const { container } = render(
        <PiaModal {...defaultProps} currentAnswer='Some answer' currentItems={null} />,
      );

      const answerContainer = container.querySelector(BASE_ANSWER);
      expect(answerContainer.querySelector(CAROUSEL_SELECTOR)).not.toBeInTheDocument();
    });

    it('renders feedback when showFeedback is true and answer exists', () => {
      const { container } = render(
        <PiaModal {...defaultProps} currentAnswer='Some answer' showFeedback />,
      );

      const answerContainer = container.querySelector(BASE_ANSWER);
      expect(within(answerContainer).getByText('Is this answer useful?')).toBeInTheDocument();
      expect(within(answerContainer).getByLabelText('thumbs up')).toBeInTheDocument();
      expect(within(answerContainer).getByLabelText('thumbs down')).toBeInTheDocument();
    });

    it('input is disabled when isLoading is true', () => {
      const { container } = render(<PiaModal {...defaultProps} isLoading />);

      expect(container.querySelector(BASE_INPUT)).toBeDisabled();
    });

    it('hides suggested questions when loading', () => {
      const { container } = render(<PiaModal {...defaultProps} isLoading />);

      expect(container.querySelector(BASE_QUESTIONS)).not.toBeInTheDocument();
    });
  });

  describe('Modal Opening and Closing', () => {
    it('opens modal when question is submitted from base input', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      const baseInput = container.querySelector(BASE_INPUT);
      fireEvent.change(baseInput, { target: { value: 'What is this product?' } });
      fireEvent.keyDown(baseInput, { key: 'Enter', code: 'Enter' });

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it('opens modal when suggested question is clicked', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      const baseQuestions = container.querySelector(BASE_QUESTIONS);
      const firstQuestion = within(baseQuestions).getByText(mockSuggestedQuestions[0].value);
      fireEvent.click(firstQuestion);

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it('closes modal when close button is clicked', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      // Open modal first
      const baseInput = container.querySelector(BASE_INPUT);
      fireEvent.change(baseInput, { target: { value: 'What is this product?' } });
      fireEvent.keyDown(baseInput, { key: 'Enter', code: 'Enter' });

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

      const dialog = container.querySelector('dialog');
      const closeButton = within(dialog).getByRole('button', { name: 'Close', hidden: true });
      fireEvent.click(closeButton);

      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it('calls handleSubmitQuestion when question is submitted', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      const baseInput = container.querySelector(BASE_INPUT);
      fireEvent.change(baseInput, { target: { value: 'What is this product made of?' } });
      fireEvent.keyDown(baseInput, { key: 'Enter', code: 'Enter' });

      expect(mockHandleSubmitQuestion).toHaveBeenCalledWith('What is this product made of?');
    });
  });

  describe('Dialog Content', () => {
    it('renders dialogContent inside the dialog', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      const dialog = container.querySelector('dialog');
      expect(within(dialog).getByTestId('dialog-content')).toBeInTheDocument();
      expect(within(dialog).getByText('Dialog Content')).toBeInTheDocument();
    });

    it('dialog has aria-label', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      const dialog = container.querySelector('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Product questions');
    });
  });

  describe('Base view hides after modal opens', () => {
    it('hides base view answer and suggested questions when modal is open', () => {
      const { container } = render(<PiaModal {...defaultProps} currentAnswer='Some answer' />);

      // Before opening — base view shows answer and questions
      expect(container.querySelector(BASE_ANSWER)).toBeInTheDocument();
      expect(container.querySelector(BASE_QUESTIONS)).toBeInTheDocument();

      // Open modal
      const baseInput = container.querySelector(BASE_INPUT);
      fireEvent.change(baseInput, { target: { value: 'Follow up?' } });
      fireEvent.keyDown(baseInput, { key: 'Enter', code: 'Enter' });

      // After opening — base view hides answer and questions
      expect(container.querySelector(BASE_ANSWER)).not.toBeInTheDocument();
      expect(container.querySelector(BASE_QUESTIONS)).not.toBeInTheDocument();
    });
  });
});

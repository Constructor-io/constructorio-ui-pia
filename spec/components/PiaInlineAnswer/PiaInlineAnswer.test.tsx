import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PiaInlineAnswer from '../../../src/components/PiaInlineAnswer/PiaInlineAnswer';
import { DISCLAIMER_TEXT } from '../../../src/constants';

const CAROUSEL_SELECTOR = '[data-carousel]';

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

const defaultProps = {
  currentAnswer: 'This is a test answer',
  currentItems: null,
};

describe('PiaInlineAnswer Component', () => {
  describe('Answer rendering', () => {
    it('renders the answer text', () => {
      render(<PiaInlineAnswer {...defaultProps} />);

      expect(screen.getByTestId('answer-text')).toBeInTheDocument();
      expect(screen.getByText(defaultProps.currentAnswer)).toBeInTheDocument();
    });

    it('renders the disclaimer', () => {
      render(<PiaInlineAnswer {...defaultProps} />);

      expect(screen.getByText(DISCLAIMER_TEXT)).toBeInTheDocument();
    });
  });

  describe('Carousel conditional rendering', () => {
    it('does not render carousel when currentItems is null', () => {
      const { container } = render(<PiaInlineAnswer {...defaultProps} currentItems={null} />);

      expect(container.querySelector(CAROUSEL_SELECTOR)).not.toBeInTheDocument();
    });

    it('does not render carousel when currentItems is an empty array', () => {
      const { container } = render(<PiaInlineAnswer {...defaultProps} currentItems={[]} />);

      expect(container.querySelector(CAROUSEL_SELECTOR)).not.toBeInTheDocument();
    });

    it('renders carousel when currentItems has items', () => {
      const { container } = render(<PiaInlineAnswer {...defaultProps} currentItems={mockItems} />);

      expect(container.querySelector(CAROUSEL_SELECTOR)).toBeInTheDocument();
    });
  });

  describe('Feedback conditional rendering', () => {
    it('does not render feedback when showFeedback is not provided', () => {
      render(<PiaInlineAnswer {...defaultProps} />);

      expect(screen.queryByText('Is this answer useful?')).not.toBeInTheDocument();
    });

    it('does not render feedback when showFeedback is false', () => {
      render(<PiaInlineAnswer {...defaultProps} showFeedback={false} />);

      expect(screen.queryByText('Is this answer useful?')).not.toBeInTheDocument();
    });

    it('renders feedback when showFeedback is true', () => {
      render(<PiaInlineAnswer {...defaultProps} showFeedback />);

      expect(screen.getByText('Is this answer useful?')).toBeInTheDocument();
    });

    it('calls onFeedback prop when feedback button is clicked', () => {
      const onFeedback = jest.fn();
      render(<PiaInlineAnswer {...defaultProps} showFeedback onFeedback={onFeedback} />);

      fireEvent.click(screen.getByLabelText('thumbs up'));

      expect(onFeedback).toHaveBeenCalledWith('up');
      expect(onFeedback).toHaveBeenCalledTimes(1);
    });

    it('falls back to callbacks.onFeedback when onFeedback prop is not provided', () => {
      const callbackFeedback = jest.fn();
      render(
        <PiaInlineAnswer
          {...defaultProps}
          showFeedback
          callbacks={{ onFeedback: callbackFeedback }}
        />,
      );

      fireEvent.click(screen.getByLabelText('thumbs down'));

      expect(callbackFeedback).toHaveBeenCalledWith('down');
      expect(callbackFeedback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disclaimer', () => {
    it('renders learn more link when learnMoreUrl is provided', () => {
      render(<PiaInlineAnswer {...defaultProps} learnMoreUrl='https://example.com/learn' />);

      const link = screen.getByText('Learn More.');
      expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/learn');
    });

    it('does not render learn more link when learnMoreUrl is not provided', () => {
      render(<PiaInlineAnswer {...defaultProps} />);

      expect(screen.queryByText('Learn More.')).not.toBeInTheDocument();
    });
  });

  describe('Disclaimer position', () => {
    it('renders disclaimer below the answer by default', () => {
      const { container } = render(<PiaInlineAnswer {...defaultProps} />);

      const answerContainer = container.querySelector('.cio-pia-answer-container')!;
      const children = [...answerContainer.children];
      const answerIndex = children.findIndex((el) => el.getAttribute('data-testid') === 'answer-text');
      const disclaimerIndex = children.findIndex((el) => el.classList.contains('cio-pia-disclaimer'));

      expect(disclaimerIndex).toBeGreaterThan(answerIndex);
    });

    it('renders disclaimer above the answer when disclaimerPosition is top', () => {
      const { container } = render(<PiaInlineAnswer {...defaultProps} disclaimerPosition='top' />);

      const answerContainer = container.querySelector('.cio-pia-answer-container')!;
      const children = [...answerContainer.children];
      const answerIndex = children.findIndex((el) => el.getAttribute('data-testid') === 'answer-text');
      const disclaimerIndex = children.findIndex((el) => el.classList.contains('cio-pia-disclaimer'));

      expect(disclaimerIndex).toBeLessThan(answerIndex);
    });

    it('does not render disclaimer at top when position is bottom', () => {
      const { container } = render(<PiaInlineAnswer {...defaultProps} disclaimerPosition='bottom' />);

      const answerContainer = container.querySelector('.cio-pia-answer-container')!;
      const firstChild = answerContainer.children[0];

      expect(firstChild.classList.contains('cio-pia-disclaimer')).toBe(false);
    });
  });

  describe('Component overrides', () => {
    it('renders custom answer via componentOverrides.answer', () => {
      render(
        <PiaInlineAnswer
          {...defaultProps}
          componentOverrides={{
            answer: {
              reactNode: ({ text }) => <div data-testid='custom-answer'>Custom: {text}</div>,
            },
          }}
        />,
      );

      expect(screen.getByTestId('custom-answer')).toBeInTheDocument();
      expect(screen.getByText(`Custom: ${defaultProps.currentAnswer}`)).toBeInTheDocument();
    });

    it('renders custom feedback via componentOverrides.feedback', () => {
      render(
        <PiaInlineAnswer
          {...defaultProps}
          showFeedback
          componentOverrides={{
            feedback: {
              reactNode: () => <div data-testid='custom-feedback'>Custom Feedback</div>,
            },
          }}
        />,
      );

      expect(screen.getByTestId('custom-feedback')).toBeInTheDocument();
    });

    it('renders custom disclaimer via componentOverrides.disclaimer', () => {
      render(
        <PiaInlineAnswer
          {...defaultProps}
          componentOverrides={{
            disclaimer: {
              reactNode: () => <div data-testid='custom-disclaimer'>Custom Disclaimer</div>,
            },
          }}
        />,
      );

      expect(screen.getByTestId('custom-disclaimer')).toBeInTheDocument();
      expect(screen.queryByText(DISCLAIMER_TEXT)).not.toBeInTheDocument();
    });
  });
});

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ConversationHistory from '../../../src/components/ConversationHistory/ConversationHistory';
import { DISCLAIMER_TEXT } from '../../../src/constants';

const baseProps = {
  conversationHistory: [],
  isLoading: false,
  error: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ConversationHistory Component', () => {
  it('has role="log" and aria-label for accessibility', () => {
    render(<ConversationHistory {...baseProps} conversationHistory={[]} />);

    const historyContainer = screen.getByRole('log');
    expect(historyContainer).toBeInTheDocument();
    expect(historyContainer).toHaveAttribute('aria-label', 'Conversation history');
  });

  it('renders all conversation entries with question and answer', () => {
    const conversationHistory = [
      { id: 1, question: 'What is this product?', answer: 'It is a rug.' },
      { id: 2, question: 'What material is it?', answer: 'It is made of wool.' },
    ];

    render(<ConversationHistory {...baseProps} conversationHistory={conversationHistory} />);

    expect(screen.getByText('What is this product?')).toBeInTheDocument();
    expect(screen.getByText('It is a rug.')).toBeInTheDocument();
    expect(screen.getByText('What material is it?')).toBeInTheDocument();
    expect(screen.getByText('It is made of wool.')).toBeInTheDocument();
  });

  it('shows loading skeleton on the last entry only when loading', () => {
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer' },
      { id: 2, question: 'Last question', answer: '' },
    ];

    render(
      <ConversationHistory {...baseProps} conversationHistory={conversationHistory} isLoading />,
    );

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('does not show loading skeleton on non-last entries', () => {
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer' },
      { id: 2, question: 'Last question', answer: '' },
    ];

    render(
      <ConversationHistory {...baseProps} conversationHistory={conversationHistory} isLoading />,
    );

    // Only one loading skeleton should exist (on the last entry)
    expect(screen.getAllByTestId('loading-skeleton')).toHaveLength(1);
  });

  it('shows error block on the last entry only when error and not loading', () => {
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer' },
      { id: 2, question: 'Last question', answer: '' },
    ];

    render(
      <ConversationHistory
        {...baseProps}
        conversationHistory={conversationHistory}
        error={new Error('Something went wrong')}
        isLoading={false}
      />,
    );

    expect(screen.getByTestId('error-block')).toBeInTheDocument();
    expect(screen.getAllByTestId('error-block')).toHaveLength(1);
  });

  it('does not show error block when loading even if error exists', () => {
    const conversationHistory = [{ id: 1, question: 'Last question', answer: '' }];

    render(
      <ConversationHistory
        {...baseProps}
        conversationHistory={conversationHistory}
        error={new Error('Something went wrong')}
        isLoading
      />,
    );

    expect(screen.queryByTestId('error-block')).not.toBeInTheDocument();
  });

  it('shows feedback on the last entry only when showFeedback is true', () => {
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer' },
      { id: 2, question: 'Last question', answer: 'Last answer' },
    ];

    render(
      <ConversationHistory {...baseProps} conversationHistory={conversationHistory} showFeedback />,
    );

    // Feedback should only appear once (on the last entry)
    const feedbackElements = document.querySelectorAll('.cio-pia-feedback-container');
    expect(feedbackElements).toHaveLength(1);
  });

  it('does not show feedback on non-last entries that have answers', () => {
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer' },
      { id: 2, question: 'Second question', answer: 'Second answer' },
      { id: 3, question: 'Last question', answer: 'Last answer' },
    ];

    render(
      <ConversationHistory {...baseProps} conversationHistory={conversationHistory} showFeedback />,
    );

    // Only the last entry should have feedback
    const feedbackElements = document.querySelectorAll('.cio-pia-feedback-container');
    expect(feedbackElements).toHaveLength(1);
  });

  it('shows disclaimer on the last entry when it has an answer', () => {
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer' },
      { id: 2, question: 'Last question', answer: 'Last answer' },
    ];

    render(<ConversationHistory {...baseProps} conversationHistory={conversationHistory} />);

    expect(screen.getByText(DISCLAIMER_TEXT)).toBeInTheDocument();
  });

  it('does not show disclaimer on non-last entries', () => {
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer' },
      { id: 2, question: 'Last question', answer: 'Last answer' },
    ];

    render(<ConversationHistory {...baseProps} conversationHistory={conversationHistory} />);

    // Disclaimer appears exactly once (on the last entry only)
    expect(screen.getAllByText(DISCLAIMER_TEXT)).toHaveLength(1);
  });

  it('renders carousel on the last entry only when currentItems are provided', () => {
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer' },
      { id: 2, question: 'Last question', answer: 'Last answer' },
    ];
    const currentItems = [
      {
        id: 'item-1',
        name: 'Product 1',
        url: 'https://example.com/1',
        imageUrl: 'https://example.com/img.jpg',
        price: 10,
      },
    ];

    const { container } = render(
      <ConversationHistory
        {...baseProps}
        conversationHistory={conversationHistory}
        currentItems={currentItems}
      />,
    );

    const carousels = container.querySelectorAll('[data-carousel]');
    expect(carousels).toHaveLength(1);
  });

  it('does not render carousel when currentItems is null', () => {
    const conversationHistory = [{ id: 1, question: 'Last question', answer: 'Last answer' }];

    const { container } = render(
      <ConversationHistory
        {...baseProps}
        conversationHistory={conversationHistory}
        currentItems={null}
      />,
    );

    expect(container.querySelector('[data-carousel]')).not.toBeInTheDocument();
  });

  it('does not show feedback on last entry when showFeedback is false or not provided', () => {
    const conversationHistory = [{ id: 1, question: 'Last question', answer: 'Last answer' }];

    render(<ConversationHistory {...baseProps} conversationHistory={conversationHistory} />);

    const feedbackElements = document.querySelectorAll('.cio-pia-feedback-container');
    expect(feedbackElements).toHaveLength(0);
  });
});

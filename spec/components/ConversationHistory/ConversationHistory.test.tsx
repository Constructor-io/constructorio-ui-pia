import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ConversationHistory from '../../../src/components/ConversationHistory/ConversationHistory';
import { DISCLAIMER_TEXT } from '../../../src/constants';

describe('ConversationHistory Component', () => {
  const baseProps = {
    conversationHistory: [],
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has role="log" and aria-label for accessibility', () => {
    render(<ConversationHistory {...baseProps} conversationHistory={[]} />);

    const historyContainer = screen.getByRole('log');
    expect(historyContainer).toBeInTheDocument();
    expect(historyContainer).toHaveAttribute('aria-label', 'Conversation history');
  });

  it('makes the scrollable history reachable by keyboard', () => {
    render(<ConversationHistory {...baseProps} conversationHistory={[]} />);

    expect(screen.getByRole('log')).toHaveAttribute('tabindex', '0');
  });

  it('translates the history region label', () => {
    render(
      <ConversationHistory
        {...baseProps}
        conversationHistory={[]}
        translations={{ 'Conversation history': 'Historial de conversación' }}
      />,
    );

    expect(screen.getByRole('log')).toHaveAttribute('aria-label', 'Historial de conversación');
  });

  describe('answer status live region', () => {
    const entry = { id: 1, question: 'What is this product?', answer: '' };

    it('is mounted before anything loads and is reused across states', () => {
      const { rerender } = render(<ConversationHistory {...baseProps} />);

      const region = screen.getByTestId('answer-status');
      expect(region).toHaveAttribute('role', 'status');
      expect(region).toBeEmptyDOMElement();

      rerender(<ConversationHistory {...baseProps} conversationHistory={[entry]} isLoading />);
      expect(screen.getByTestId('answer-status')).toHaveTextContent('Loading answer');

      rerender(
        <ConversationHistory
          {...baseProps}
          conversationHistory={[{ ...entry, answer: 'It is a rug.' }]}
        />,
      );
      expect(screen.getByTestId('answer-status')).toHaveTextContent('Answer ready');

      // Recreating the region with its text would not announce reliably.
      expect(screen.getByTestId('answer-status')).toBe(region);
    });

    it('stays silent while only the follow-up questions are loading', () => {
      render(
        <ConversationHistory
          {...baseProps}
          conversationHistory={[{ ...entry, answer: 'It is a rug.' }]}
          isLoading
          isAnswerLoading={false}
        />,
      );

      expect(screen.getByTestId('answer-status')).toHaveTextContent('Answer ready');
      expect(screen.getByTestId('answer-status')).not.toHaveTextContent('Loading answer');
    });

    it('keeps the status region outside the conversation log', () => {
      render(<ConversationHistory {...baseProps} isLoading />);

      expect(screen.getByRole('log')).not.toContainElement(screen.getByTestId('answer-status'));
    });

    it('translates the status messages', () => {
      render(
        <ConversationHistory
          {...baseProps}
          isLoading
          translations={{ 'Loading answer': 'Cargando respuesta' }}
        />,
      );

      expect(screen.getByTestId('answer-status')).toHaveTextContent('Cargando respuesta');
    });
  });

  describe('error inside the conversation log', () => {
    const entry = { id: 1, question: 'What is this product?', answer: '' };

    it('is not a second live region nested in the log', () => {
      render(
        <ConversationHistory
          {...baseProps}
          conversationHistory={[entry]}
          error={new Error('First failure')}
        />,
      );

      const errorBlock = screen.getByTestId('error-block');
      expect(screen.getByRole('log')).toContainElement(errorBlock);
      expect(errorBlock).toHaveTextContent('First failure');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('remounts the error block when a second failure has a different message', () => {
      const { rerender } = render(
        <ConversationHistory
          {...baseProps}
          conversationHistory={[entry]}
          error={new Error('First failure')}
        />,
      );

      const firstBlock = screen.getByTestId('error-block');

      rerender(
        <ConversationHistory
          {...baseProps}
          conversationHistory={[entry]}
          error={new Error('Second failure')}
        />,
      );

      // The log announces insertions, so the node has to be a new one.
      const secondBlock = screen.getByTestId('error-block');
      expect(secondBlock).toHaveTextContent('Second failure');
      expect(secondBlock).not.toBe(firstBlock);
    });
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

  it('renders carousel from entry.items on previous entries', () => {
    const previousItems = [
      {
        id: 'item-prev',
        name: 'Previous Product',
        url: 'https://example.com/prev',
        imageUrl: 'https://example.com/prev.jpg',
        price: 5,
      },
    ];
    const currentItems = [
      {
        id: 'item-cur',
        name: 'Current Product',
        url: 'https://example.com/cur',
        imageUrl: 'https://example.com/cur.jpg',
        price: 10,
      },
    ];
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer', items: previousItems },
      { id: 2, question: 'Last question', answer: 'Last answer' },
    ];

    const { container } = render(
      <ConversationHistory
        {...baseProps}
        conversationHistory={conversationHistory}
        currentItems={currentItems}
      />,
    );

    const carousels = container.querySelectorAll('[data-carousel]');
    expect(carousels).toHaveLength(2);
  });

  it('does not render carousel on previous entries without items', () => {
    const currentItems = [
      {
        id: 'item-1',
        name: 'Product 1',
        url: 'https://example.com/1',
        imageUrl: 'https://example.com/img.jpg',
        price: 10,
      },
    ];
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer' },
      { id: 2, question: 'Last question', answer: 'Last answer' },
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

  it('hides carousels on previous entries when showPreviousItems is false', () => {
    const previousItems = [
      {
        id: 'item-prev',
        name: 'Previous Product',
        url: 'https://example.com/prev',
        imageUrl: 'https://example.com/prev.jpg',
        price: 5,
      },
    ];
    const currentItems = [
      {
        id: 'item-cur',
        name: 'Current Product',
        url: 'https://example.com/cur',
        imageUrl: 'https://example.com/cur.jpg',
        price: 10,
      },
    ];
    const conversationHistory = [
      { id: 1, question: 'First question', answer: 'First answer', items: previousItems },
      { id: 2, question: 'Last question', answer: 'Last answer' },
    ];

    const { container } = render(
      <ConversationHistory
        {...baseProps}
        conversationHistory={conversationHistory}
        currentItems={currentItems}
        showPreviousItems={false}
      />,
    );

    const carousels = container.querySelectorAll('[data-carousel]');
    expect(carousels).toHaveLength(1);
  });

  it('does not render carousel when currentItems is null even if entry has items', () => {
    const conversationHistory = [
      {
        id: 1,
        question: 'Q',
        answer: 'A',
        items: [
          {
            id: 'x',
            name: 'P',
            url: '/',
            imageUrl: '/img.jpg',
            price: 1,
          },
        ],
      },
    ];

    const { container } = render(
      <ConversationHistory
        {...baseProps}
        conversationHistory={conversationHistory}
        currentItems={null}
      />,
    );

    expect(container.querySelector('[data-carousel]')).not.toBeInTheDocument();
  });

  it('falls back to entry.items on last entry when currentItems is not provided', () => {
    const entryItems = [
      {
        id: 'item-1',
        name: 'Saved Product',
        url: 'https://example.com/saved',
        imageUrl: 'https://example.com/saved.jpg',
        price: 15,
      },
    ];
    const conversationHistory = [
      { id: 1, question: 'Last question', answer: 'Last answer', items: entryItems },
    ];

    const { container } = render(
      <ConversationHistory {...baseProps} conversationHistory={conversationHistory} />,
    );

    const carousels = container.querySelectorAll('[data-carousel]');
    expect(carousels).toHaveLength(1);
  });

  it('renders currentItems instead of entry.items on last entry when both are provided', () => {
    const entryItems = [
      {
        id: 'item-old',
        name: 'Old Product',
        url: 'https://example.com/old',
        imageUrl: 'https://example.com/old.jpg',
        price: 5,
      },
    ];
    const currentItems = [
      {
        id: 'item-new',
        name: 'New Product',
        url: 'https://example.com/new',
        imageUrl: 'https://example.com/new.jpg',
        price: 20,
      },
    ];
    const conversationHistory = [
      { id: 1, question: 'Last question', answer: 'Last answer', items: entryItems },
    ];

    render(
      <ConversationHistory
        {...baseProps}
        conversationHistory={conversationHistory}
        currentItems={currentItems}
      />,
    );

    expect(screen.getByText('New Product')).toBeInTheDocument();
    expect(screen.queryByText('Old Product')).not.toBeInTheDocument();
  });

  describe('disclaimerPosition', () => {
    const conversationHistory = [{ id: 1, question: 'First question', answer: 'First answer' }];

    it('renders disclaimer after conversation entries by default', () => {
      const { container } = render(
        <ConversationHistory {...baseProps} conversationHistory={conversationHistory} />,
      );

      const history = container.querySelector('.cio-pia-conversation-history')!;
      const children = Array.from(history.children);
      const disclaimerIndex = children.findIndex((el) => el.matches('.cio-pia-disclaimer'));
      const entriesIndex = children.findIndex((el) => el.matches('.cio-pia-conversation-entries'));
      expect(disclaimerIndex).toBeGreaterThan(entriesIndex);
    });

    it('renders disclaimer before conversation entries when disclaimerPosition is top', () => {
      const { container } = render(
        <ConversationHistory
          {...baseProps}
          conversationHistory={conversationHistory}
          disclaimerPosition='top'
        />,
      );

      const history = container.querySelector('.cio-pia-conversation-history')!;
      const children = Array.from(history.children);
      const disclaimerIndex = children.findIndex((el) => el.matches('.cio-pia-disclaimer'));
      const entriesIndex = children.findIndex((el) => el.matches('.cio-pia-conversation-entries'));
      expect(disclaimerIndex).toBeLessThan(entriesIndex);
    });

    it('renders disclaimer after conversation entries when disclaimerPosition is bottom', () => {
      const { container } = render(
        <ConversationHistory
          {...baseProps}
          conversationHistory={conversationHistory}
          disclaimerPosition='bottom'
        />,
      );

      const history = container.querySelector('.cio-pia-conversation-history')!;
      const children = Array.from(history.children);
      const disclaimerIndex = children.findIndex((el) => el.matches('.cio-pia-disclaimer'));
      const entriesIndex = children.findIndex((el) => el.matches('.cio-pia-conversation-entries'));
      expect(disclaimerIndex).toBeGreaterThan(entriesIndex);
    });
  });

  it('does not show feedback on last entry when showFeedback is false or not provided', () => {
    const conversationHistory = [{ id: 1, question: 'Last question', answer: 'Last answer' }];

    render(<ConversationHistory {...baseProps} conversationHistory={conversationHistory} />);

    const feedbackElements = document.querySelectorAll('.cio-pia-feedback-container');
    expect(feedbackElements).toHaveLength(0);
  });
});

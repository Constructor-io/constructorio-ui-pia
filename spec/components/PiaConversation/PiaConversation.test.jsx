import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import PiaConversation from '../../../src/components/PiaConversation/PiaConversation';

describe('PiaConversation Component', () => {
  const mockSuggestedQuestions = [
    { value: 'What material is this made of?' },
    { value: 'Is this available in other colors?' },
    { value: 'What are the dimensions?' },
  ];

  const mockHandleSubmitQuestion = jest.fn();

  const baseProps = {
    conversationHistory: [],
    isLoading: false,
    error: null,
    displayedQuestions: mockSuggestedQuestions,
    handleSubmitQuestion: mockHandleSubmitQuestion,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Title rendering', () => {
    it('renders title when there is no conversation history', () => {
      render(<PiaConversation {...baseProps} conversationHistory={[]} />);

      expect(screen.getByTestId('cio-pia-title')).toBeInTheDocument();
    });

    it('hides title when there is conversation history', () => {
      const conversationHistory = [
        { id: 1, question: 'What is this?', answer: 'It is a product.' },
      ];

      render(<PiaConversation {...baseProps} conversationHistory={conversationHistory} />);

      expect(screen.queryByTestId('cio-pia-title')).not.toBeInTheDocument();
    });
  });

  describe('Suggested questions rendering', () => {
    it('renders suggested questions in the footer', () => {
      render(<PiaConversation {...baseProps} />);

      mockSuggestedQuestions.forEach((question) => {
        expect(screen.getByText(question.value)).toBeInTheDocument();
      });
    });

    it('hides suggested questions when loading', () => {
      render(<PiaConversation {...baseProps} isLoading />);

      mockSuggestedQuestions.forEach((question) => {
        expect(screen.queryByText(question.value)).not.toBeInTheDocument();
      });
    });

    it('hides suggested questions when there is an error', () => {
      render(<PiaConversation {...baseProps} error={new Error('Failed to fetch questions')} />);

      mockSuggestedQuestions.forEach((question) => {
        expect(screen.queryByText(question.value)).not.toBeInTheDocument();
      });
    });
  });

  describe('Input rendering', () => {
    it('renders the Input in the footer', () => {
      render(<PiaConversation {...baseProps} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders the Input disabled when loading', () => {
      render(<PiaConversation {...baseProps} isLoading />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renders the Input enabled when not loading', () => {
      render(<PiaConversation {...baseProps} isLoading={false} />);

      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });
  });

  describe('Input submission', () => {
    it('calls handleSubmitQuestion when input is submitted via Enter key', () => {
      render(<PiaConversation {...baseProps} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'What is the warranty?' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockHandleSubmitQuestion).toHaveBeenCalledWith('What is the warranty?');
    });

    it('calls handleSubmitQuestion when input is submitted via the send button', () => {
      render(<PiaConversation {...baseProps} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'How do I clean this?' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      expect(mockHandleSubmitQuestion).toHaveBeenCalledWith('How do I clean this?');
    });
  });
});

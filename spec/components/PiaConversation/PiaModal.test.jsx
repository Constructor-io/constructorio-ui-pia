import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen, within } from '@testing-library/react';
import PiaModal from '../../../src/components/PiaConversation/PiaModal';

const BASE_INPUT = '.cio-pia-container > .cio-pia-input-container input';
const BASE_QUESTIONS = '.cio-pia-container > .cio-pia-suggested-questions-container';

describe('PiaModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.classList.remove('cio-pia-modal-open');
  });

  const mockSuggestedQuestions = [
    { value: 'Suggested question 1?' },
    { value: 'Suggested question 2?' },
    { value: 'Suggested question 3?' },
  ];

  const mockHandleSubmitQuestion = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    initialQuestions: mockSuggestedQuestions,
    handleSubmitQuestion: mockHandleSubmitQuestion,
    isLoading: false,
    onClose: mockOnClose,
    children: <div data-testid='dialog-content'>Dialog Content</div>,
  };

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

    it('does not render suggested questions when initialQuestions is empty', () => {
      const { container } = render(<PiaModal {...defaultProps} initialQuestions={[]} />);

      expect(container.querySelector(BASE_QUESTIONS)).not.toBeInTheDocument();
    });

    it('input is disabled when isLoading is true', () => {
      const { container } = render(<PiaModal {...defaultProps} isLoading />);

      expect(container.querySelector(BASE_INPUT)).toBeDisabled();
    });

    it('input is disabled when modal is open', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      const baseInput = container.querySelector(BASE_INPUT);
      fireEvent.change(baseInput, { target: { value: 'What is this product?' } });
      fireEvent.keyDown(baseInput, { key: 'Enter', code: 'Enter' });

      expect(container.querySelector(BASE_INPUT)).toBeDisabled();
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

      const baseInput = container.querySelector(BASE_INPUT);
      fireEvent.change(baseInput, { target: { value: 'What is this product?' } });
      fireEvent.keyDown(baseInput, { key: 'Enter', code: 'Enter' });

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

      const dialog = container.querySelector('dialog');
      const closeButton = within(dialog).getByRole('button', { name: 'Close', hidden: true });
      fireEvent.click(closeButton);

      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it('calls onClose when modal is closed', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      const baseInput = container.querySelector(BASE_INPUT);
      fireEvent.change(baseInput, { target: { value: 'What is this product?' } });
      fireEvent.keyDown(baseInput, { key: 'Enter', code: 'Enter' });

      const dialog = container.querySelector('dialog');
      const closeButton = within(dialog).getByRole('button', { name: 'Close', hidden: true });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
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
    it('renders children inside the dialog', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      const dialog = container.querySelector('dialog');
      expect(within(dialog).getByTestId('dialog-content')).toBeInTheDocument();
      expect(within(dialog).getByText('Dialog Content')).toBeInTheDocument();
    });

    it('dialog has aria-labelledby pointing to the modal title', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      const dialog = container.querySelector('dialog');
      const labelledBy = dialog.getAttribute('aria-labelledby');
      expect(labelledBy).toMatch('cio-pia-modal-title');

      const title = container.querySelector(`#${labelledBy}`);
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Ask about this product');
    });
  });

  describe('Suggested questions visibility', () => {
    it('shows suggested questions in base view when initialQuestions has items', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      expect(container.querySelector(BASE_QUESTIONS)).toBeInTheDocument();
    });

    it('keeps suggested questions visible after modal opens', () => {
      const { container } = render(<PiaModal {...defaultProps} />);

      // Open modal
      const baseInput = container.querySelector(BASE_INPUT);
      fireEvent.change(baseInput, { target: { value: 'Follow up?' } });
      fireEvent.keyDown(baseInput, { key: 'Enter', code: 'Enter' });

      expect(container.querySelector(BASE_QUESTIONS)).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Feedback from '../../../src/components/Feedback/Feedback';

describe('Feedback Component', () => {
  const onFeedback = jest.fn();

  it('renders the feedback component', () => {
    render(<Feedback />);

    expect(screen.getByText('Is this answer useful?')).toBeInTheDocument();
    expect(screen.getByLabelText('thumbs up')).toBeInTheDocument();
    expect(screen.getByLabelText('thumbs down')).toBeInTheDocument();
  });

  it('calls onFeedback with "up" when thumbs up is clicked', () => {
    render(<Feedback onFeedback={onFeedback} />);

    fireEvent.click(screen.getByLabelText('thumbs up'));
    expect(onFeedback).toHaveBeenCalledWith('up');
  });

  it('calls onFeedback with "down" when thumbs down is clicked', () => {
    render(<Feedback onFeedback={onFeedback} />);

    fireEvent.click(screen.getByLabelText('thumbs down'));
    expect(onFeedback).toHaveBeenCalledWith('down');
  });

  describe('componentOverride', () => {
    it('renders custom content when componentOverride.reactNode is a render props function', () => {
      const translations = { 'Is this answer useful?': 'Helpful?' };

      render(
        <Feedback
          translations={translations}
          componentOverride={{
            reactNode: ({ translations: t }) => (
              <div data-testid='custom-feedback'>
                <span data-testid='custom-feedback-translation'>
                  {t?.['Is this answer useful?']}
                </span>
              </div>
            ),
          }}
        />,
      );

      expect(screen.getByTestId('custom-feedback')).toBeInTheDocument();
      expect(screen.getByTestId('custom-feedback-translation')).toHaveTextContent('Helpful?');
      expect(screen.queryByText('thumbs up')).not.toBeInTheDocument();
    });

    it('calls onFeedback when rendering through override', () => {
      const renderPropsOverride = ({ onFeedback: onFeedbackOverride }) => (
        <button type='button' onClick={() => onFeedbackOverride('up')}>
          Custom Upvote
        </button>
      );

      render(
        <Feedback onFeedback={onFeedback} componentOverride={{ reactNode: renderPropsOverride }} />,
      );

      fireEvent.click(screen.getByText('Custom Upvote'));
      expect(onFeedback).toHaveBeenCalledWith('up');
    });
  });
});

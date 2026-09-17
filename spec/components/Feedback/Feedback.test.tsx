import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Feedback from '../../../src/components/Feedback/Feedback';
import { FeedbackRenderProps, FeedbackType } from '../../../src/types';

describe('Feedback Component', () => {
  const onFeedback = jest.fn();

  it('renders the feedback component', () => {
    render(<Feedback />);

    expect(screen.getByText('Is this answer useful?')).toBeInTheDocument();
    expect(screen.getByLabelText('thumbs up')).toBeInTheDocument();
    expect(screen.getByLabelText('thumbs down')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    it('exposes both feedback buttons as unpressed toggles initially', () => {
      render(<Feedback />);

      expect(screen.getByRole('button', { name: 'thumbs up' })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      expect(screen.getByRole('button', { name: 'thumbs down' })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });

    it('reflects the selected feedback via aria-pressed rather than color alone', () => {
      render(<Feedback />);

      fireEvent.click(screen.getByRole('button', { name: 'thumbs up' }));

      expect(screen.getByRole('button', { name: 'thumbs up' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByRole('button', { name: 'thumbs down' })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });

    it('hides the decorative thumb icons from assistive technology', () => {
      const { container } = render(<Feedback />);

      const icons = container.querySelectorAll('.cio-pia-feedback-button svg');
      expect(icons).toHaveLength(2);
      icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'));
    });

    it('translates the feedback button labels', () => {
      render(
        <Feedback translations={{ 'thumbs up': 'Pulgar arriba', 'thumbs down': 'Pulgar abajo' }} />,
      );

      expect(screen.getByRole('button', { name: 'Pulgar arriba' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Pulgar abajo' })).toBeInTheDocument();
    });
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
      const renderPropsOverride = ({ onFeedback: onFeedbackOverride }: FeedbackRenderProps) => (
        <button type='button' onClick={() => onFeedbackOverride!(FeedbackType.UP)}>
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

  it('has no feedback selected initially', () => {
    const { getByLabelText } = render(<Feedback />);

    const thumbsUp = getByLabelText('thumbs up');
    const thumbsDown = getByLabelText('thumbs down');

    // Both should render unselected SVGs (fill #0F1324 with opacity 0.6)
    expect(thumbsUp.querySelector('path')?.getAttribute('fill')).toBe('#0F1324');
    expect(thumbsDown.querySelector('path')?.getAttribute('fill')).toBe('#0F1324');
  });

  it('selects thumbs up when clicked', () => {
    const { getByLabelText } = render(<Feedback />);

    const thumbsUp = getByLabelText('thumbs up');
    fireEvent.click(thumbsUp);

    expect(thumbsUp.querySelector('path')!.getAttribute('fill')).toBe('#4CAF50');
  });

  it('selects thumbs down when clicked', () => {
    const { getByLabelText } = render(<Feedback />);

    const thumbsDown = getByLabelText('thumbs down');
    fireEvent.click(thumbsDown);

    expect(thumbsDown.querySelector('path')!.getAttribute('fill')).toBe('#F44336');
  });

  it('switches selection when clicking the other button', () => {
    const { getByLabelText } = render(<Feedback />);

    const thumbsUp = getByLabelText('thumbs up');
    const thumbsDown = getByLabelText('thumbs down');

    fireEvent.click(thumbsUp);
    expect(thumbsUp.querySelector('path')!.getAttribute('fill')).toBe('#4CAF50');

    fireEvent.click(thumbsDown);
    expect(thumbsDown.querySelector('path')!.getAttribute('fill')).toBe('#F44336');
    expect(thumbsUp.querySelector('path')!.getAttribute('fill')).toBe('#0F1324');
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Feedback from '../../../src/components/Feedback/Feedback';

describe('Feedback Component', () => {
  it('renders the feedback component', () => {
    const { getByText, getByLabelText } = render(<Feedback />);

    expect(getByText('Is this answer useful?')).toBeInTheDocument();
    expect(getByLabelText('thumbs up')).toBeInTheDocument();
    expect(getByLabelText('thumbs down')).toBeInTheDocument();
  });
});

describe('Feedback Component - componentOverride', () => {
  it('renders custom content when componentOverride.reactNode is a render props function', () => {
    const translations = { 'Is this answer useful?': 'Helpful?' };

    const { getByTestId, queryByText } = render(
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

    expect(getByTestId('custom-feedback')).toBeInTheDocument();
    expect(getByTestId('custom-feedback-translation')).toHaveTextContent('Helpful?');
    expect(queryByText('thumbs up')).not.toBeInTheDocument();
  });

  it('renders a static ReactNode override instead of the default feedback UI', () => {
    const { getByTestId, queryByLabelText } = render(
      <Feedback
        componentOverride={{
          reactNode: <div data-testid='static-feedback-override'>Custom Feedback</div>,
        }}
      />,
    );

    expect(getByTestId('static-feedback-override')).toBeInTheDocument();
    expect(queryByLabelText('thumbs up')).not.toBeInTheDocument();
    expect(queryByLabelText('thumbs down')).not.toBeInTheDocument();
  });

  it('renders the default feedback UI when no componentOverride is provided', () => {
    const { getByText, getByLabelText } = render(<Feedback />);

    expect(getByText('Is this answer useful?')).toBeInTheDocument();
    expect(getByLabelText('thumbs up')).toBeInTheDocument();
    expect(getByLabelText('thumbs down')).toBeInTheDocument();
  });
});

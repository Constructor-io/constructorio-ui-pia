import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import ErrorBlock from '../../../src/components/Error/ErrorBlock';

const testErrorMessage = 'Test error message';

describe('ErrorBlock component', () => {
  it('renders the error message correctly', () => {
    const { getByText } = render(<ErrorBlock message={testErrorMessage} />);

    expect(getByText(testErrorMessage)).toBeInTheDocument();
  });

  it('renders the WarningIcon', () => {
    const { getByTestId } = render(<ErrorBlock message={testErrorMessage} />);

    expect(getByTestId('error-block-warning-icon')).toBeInTheDocument();
  });

  it('renders the RetryIcon', () => {
    const { getByText } = render(<ErrorBlock message={testErrorMessage} onRetry={() => {}} />);

    const retryButton = getByText('Retry');
    const svgInsideButton = retryButton.querySelector('svg');
    expect(svgInsideButton).toBeInTheDocument();
  });

  it('does not render the retry button when onRetry is not provided', () => {
    const { queryByText } = render(<ErrorBlock message={testErrorMessage} />);

    expect(queryByText('Retry')).not.toBeInTheDocument();
  });

  it('renders the retry button when onRetry is provided', () => {
    const { getByText } = render(<ErrorBlock message={testErrorMessage} onRetry={() => {}} />);

    expect(getByText('Retry')).toBeInTheDocument();
  });

  it('calls onRetry function when retry button is clicked', () => {
    const handleRetry = jest.fn();
    const { getByText } = render(<ErrorBlock message={testErrorMessage} onRetry={handleRetry} />);

    const retryButton = getByText('Retry');
    fireEvent.click(retryButton);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  describe('accessibility', () => {
    it('announces the error through a live region', () => {
      const { getByRole } = render(<ErrorBlock message={testErrorMessage} />);

      expect(getByRole('alert')).toHaveTextContent(testErrorMessage);
    });

    it('hides the decorative warning and retry icons from assistive technology', () => {
      const { container } = render(
        <ErrorBlock message={testErrorMessage} onRetry={() => {}} />,
      );

      const icons = container.querySelectorAll('svg');
      expect(icons).toHaveLength(2);
      icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'));
    });

    it('translates the retry button label', () => {
      const { getByRole } = render(
        <ErrorBlock
          message={testErrorMessage}
          onRetry={() => {}}
          translations={{ Retry: 'Повторить' }}
        />,
      );

      expect(getByRole('button', { name: 'Повторить' })).toBeInTheDocument();
    });
  });

  it('has the correct CSS classes for styling', () => {
    render(<ErrorBlock message={testErrorMessage} />);

    expect(document.querySelector('.cio-pia-error-block-container')).toBeInTheDocument();
    expect(document.querySelector('.cio-pia-error-block-text-container')).toBeInTheDocument();
    expect(document.querySelector('.cio-pia-error-block-text')).toBeInTheDocument();
  });
});

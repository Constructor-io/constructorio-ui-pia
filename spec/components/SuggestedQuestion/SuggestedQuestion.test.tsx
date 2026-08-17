import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestedQuestion from '../../../src/components/SuggestedQuestion/SuggestedQuestion';

describe('SuggestedQuestion Component', () => {
  const testSuggestedQuestion = 'Test question?';

  const defaultProps = {
    question: testSuggestedQuestion,
    onClick: jest.fn(),
  };

  it('renders the question text', () => {
    const { getByText } = render(<SuggestedQuestion {...defaultProps} />);
    expect(getByText(testSuggestedQuestion)).toBeInTheDocument();
  });

  it('renders the question icon', () => {
    const { queryByRole } = render(<SuggestedQuestion {...defaultProps} />);
    expect(queryByRole('button')).toContainElement(
      document.querySelector('.cio-pia-suggested-question-icon'),
    );
  });

  it('calls onClick when clicked', () => {
    const { queryByRole } = render(<SuggestedQuestion {...defaultProps} />);
    fireEvent.click(queryByRole('button')!);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('replaces the default icon when a custom one is given', () => {
    const { getByTestId, queryByRole } = render(
      <SuggestedQuestion {...defaultProps} icon={<span data-testid='custom-icon' />} />,
    );

    expect(getByTestId('custom-icon')).toBeInTheDocument();
    expect(queryByRole('button')).toHaveTextContent(testSuggestedQuestion);
  });
});

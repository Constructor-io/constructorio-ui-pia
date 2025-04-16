import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Answer from '../../../src/components/Answer/Answer';

describe('Answer Component', () => {
  const mockAnswer = 'This is an example answer text';

  it('renders Answer component with answer text', () => {
    const { getByTestId, getByText } = render(<Answer text={mockAnswer} />);
    expect(getByTestId('answer-text')).toBeInTheDocument();
    expect(getByText('This is an example answer text')).toBeInTheDocument();
  });

  it('renders loading state when isLoading prop is true', () => {
    const { getByTestId, queryByTestId } = render(<Answer text='' isLoading />);
    expect(getByTestId('answer-loading')).toBeInTheDocument();
    expect(queryByTestId('answer-text')).not.toBeInTheDocument();
  });
});

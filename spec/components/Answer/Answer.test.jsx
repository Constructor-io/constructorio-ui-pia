import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Answer from '../../../src/components/Answer/Answer';

describe('Answer Component', () => {

  it('renders Answer component with answer text when isLoading is false', () => {
    const { getByTestId, getByText } = render(<Answer answerText='This is an example answer text' isLoading={false} />);
    expect(getByTestId('answer-text')).toBeInTheDocument();
    expect(getByText('This is an example answer text')).toBeInTheDocument();
  });

  it('renders loading component when isLoading is true', () => {
    const { getByTestId } = render(<Answer answerText='This is an example answer text' isLoading={true} />);
    expect(getByTestId('answer-loading')).toBeInTheDocument();
  });

  it('renders loading component by default when isLoading is not provided', () => {
    const { getByTestId, queryByText } = render(<Answer answerText='This is an example answer text' />);
    expect(getByTestId('answer-loading')).toBeInTheDocument();
    expect(queryByText('This is an example answer text')).not.toBeInTheDocument();
  });

  it('does not display answer text when loading', () => {
    const { queryByText } = render(<Answer answerText='This is an example answer text' isLoading={true} />);
    expect(queryByText('This is an example answer text')).not.toBeInTheDocument();
  });
});

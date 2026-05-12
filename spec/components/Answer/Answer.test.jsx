import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Answer from '../../../src/components/Answer/Answer';

describe('Answer Component', () => {
  const mockAnswer = 'This is an example answer text';

  it('renders Answer component with answer text', () => {
    const { getByTestId } = render(<Answer text={mockAnswer} />);
    expect(getByTestId('answer-text')).toBeInTheDocument();
    expect(getByTestId('answer-text')).toHaveTextContent('This is an example answer text');
  });

  it('renders null when text prop is empty', () => {
    const { container } = render(<Answer text='' />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders markdown as HTML', () => {
    const { getByTestId } = render(<Answer text='**Bold text**' />);
    const answerEl = getByTestId('answer-text');
    expect(answerEl.querySelector('strong')).toHaveTextContent('Bold text');
  });

  it('renders inline HTML in answers', () => {
    const text = 'Visit <a href="https://example.com">our site</a> for more info';
    const { getByTestId } = render(<Answer text={text} />);
    const link = getByTestId('answer-text').querySelector('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('our site');
  });

  it('strips dangerous script tags from answers', () => {
    const text = 'Safe content<script>alert("xss")</script>';
    const { getByTestId } = render(<Answer text={text} />);
    const answerEl = getByTestId('answer-text');
    expect(answerEl.innerHTML).not.toContain('<script>');
    expect(answerEl).toHaveTextContent('Safe content');
  });

  describe('componentOverride', () => {
    it('renders a render props function override and passes the text prop to it', () => {
      const renderPropsOverride = ({ text }) => (
        <div data-testid='custom-answer-render-props'>Custom: {text}</div>
      );

      const { getByTestId, queryByTestId } = render(
        <Answer text={mockAnswer} componentOverride={{ reactNode: renderPropsOverride }} />,
      );

      expect(getByTestId('custom-answer-render-props')).toBeInTheDocument();
      expect(getByTestId('custom-answer-render-props')).toHaveTextContent(`Custom: ${mockAnswer}`);
      expect(queryByTestId('answer-text')).not.toBeInTheDocument();
    });
  });
});

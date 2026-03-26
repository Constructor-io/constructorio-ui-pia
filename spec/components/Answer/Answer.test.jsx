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

  it('renders null when text prop is empty', () => {
    const { container } = render(<Answer text='' />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('Answer Component - componentOverride', () => {
  const mockAnswer = 'This is an example answer text';

  it('renders default content when no componentOverride is provided', () => {
    const { getByTestId, getByText } = render(<Answer text={mockAnswer} />);
    expect(getByTestId('answer-text')).toBeInTheDocument();
    expect(getByText(mockAnswer)).toBeInTheDocument();
  });

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

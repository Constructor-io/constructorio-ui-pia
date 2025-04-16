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

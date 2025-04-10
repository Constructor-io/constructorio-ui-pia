import React from 'react';
import useAnswerResults, { UseAnswerResultsProps } from '../../../hooks/useAnswerResults';

export default function UseAnswerResultsExample(props: UseAnswerResultsProps) {
  const { itemId, question } = props;
  const response = useAnswerResults({ itemId, question });

  console.log('Response from useAnswerResults:', response);

  return (
    <div>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}

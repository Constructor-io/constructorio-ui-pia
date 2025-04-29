import React, { useEffect } from 'react';
import useAnswerResults, { UseAnswerResultsProps } from '../../../hooks/useAnswerResults';
import DisplayHookExample from '../DisplayHookExample';

interface UseAnswerResultsExampleProps extends UseAnswerResultsProps {
  question: string;
}

export default function UseAnswerResultsExample(props: UseAnswerResultsExampleProps) {
  const { itemId, question } = props;
  const { fetchResult, ...other } = useAnswerResults({ itemId });

  useEffect(() => {
    fetchResult(question);
  }, [question, fetchResult]);

  return <DisplayHookExample content={JSON.stringify(other, null, 2)} />;
}

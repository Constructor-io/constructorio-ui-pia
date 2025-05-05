import React, { useEffect } from 'react';
import useAnswerResults, { UseAnswerResultsProps } from '../../../hooks/useAnswerResults';
import useCioClient from '../../../hooks/useCioClient';
import DisplayHookExample from '../DisplayHookExample';
import { DEMO_API_KEY } from '../../../constants';
import MockConstructorIOClient from '../../../hooks/mocks/MockConstructorIOClient';

interface UseAnswerResultsExampleProps extends UseAnswerResultsProps {
  question: string;
}

export default function UseAnswerResultsExample(props: UseAnswerResultsExampleProps) {
  const { itemId, question } = props;
  const cioClient = useCioClient({ apiKey: DEMO_API_KEY });
  const { getAnswer, ...other } = useAnswerResults({
    itemId,
    cioClient: cioClient as MockConstructorIOClient,
  });

  useEffect(() => {
    getAnswer(question);
  }, [question, getAnswer]);

  return <DisplayHookExample content={JSON.stringify(other, null, 2)} />;
}

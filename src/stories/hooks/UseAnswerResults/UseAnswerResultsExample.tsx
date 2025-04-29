import React, { useEffect } from 'react';
import useAnswerResults, { UseAnswerResultsProps } from '../../../hooks/useAnswerResults';
import DisplayHookExample from '../DisplayHookExample';

export default function UseAnswerResultsExample(props: UseAnswerResultsProps) {
  const { itemId, question } = props;
  const { fetch, ...others } = useAnswerResults({ itemId, question });

  useEffect(() => {
    fetch();
  }, [fetch]);

  return <DisplayHookExample {...others} />;
}

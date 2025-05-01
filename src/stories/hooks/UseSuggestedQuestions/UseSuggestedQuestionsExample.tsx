import React from 'react';
import useSuggestedQuestions, {
  UseSuggestedQuestionsProps,
} from '../../../hooks/useSuggestedQuestions';
import useCioClient from '../../../hooks/useCioClient';
import DisplayHookExample from '../DisplayHookExample';
import { DEMO_API_KEY } from '../../../constants';
import MockConstructorIOClient from '../../../hooks/mocks/MockConstructorIOClient';

export default function UseSuggestedQuestionsExample(props: UseSuggestedQuestionsProps) {
  const { itemId } = props;
  const cioClient = useCioClient({ apiKey: DEMO_API_KEY });
  const response = useSuggestedQuestions({
    itemId,
    cioClient: cioClient as MockConstructorIOClient,
  });

  return <DisplayHookExample content={JSON.stringify(response, null, 2)} />;
}

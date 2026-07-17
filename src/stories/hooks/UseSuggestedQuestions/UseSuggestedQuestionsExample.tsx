import React from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import useSuggestedQuestions, {
  UseSuggestedQuestionsProps,
} from '../../../hooks/useSuggestedQuestions';
import useCioClient from '../../../hooks/useCioClient';
import DisplayHookExample from '../DisplayHookExample';
import { DEMO_API_KEY } from '../../../constants';

export default function UseSuggestedQuestionsExample(props: UseSuggestedQuestionsProps) {
  const { itemId } = props;
  const cioClient = useCioClient({ apiKey: DEMO_API_KEY });
  const response = useSuggestedQuestions({
    itemId,
    cioClient: cioClient as ConstructorIOClient,
  });

  return <DisplayHookExample content={JSON.stringify(response, null, 2)} />;
}

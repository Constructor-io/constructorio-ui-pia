import React from 'react';
import useSuggestedQuestions, {
  UseSuggestedQuestionsProps,
} from '../../../hooks/useSuggestedQuestions';
import DisplayHookExample from '../DisplayHookExample';

export default function UseSuggestedQuestionsExample(props: UseSuggestedQuestionsProps) {
  const { itemId } = props;
  const response = useSuggestedQuestions({ itemId });

  return <DisplayHookExample {...response} />;
}

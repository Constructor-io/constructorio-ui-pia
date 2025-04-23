import React from 'react';
import useSuggestedQuestions, {
  UseSuggestedQuestionsProps,
} from '../../../hooks/useSuggestedQuestions';

export default function UseSuggestedQuestionsExample(props: UseSuggestedQuestionsProps) {
  const { itemId } = props;
  const response = useSuggestedQuestions({ itemId });

  return (
    <div>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}

import React from 'react';
import useSuggestedQuestions, {
  UseSuggestedQuestionsProps,
} from '../../../hooks/useSuggestedQuestions';

export default function UseSuggestedQuestionsExample(props: UseSuggestedQuestionsProps) {
  const { itemId } = props;
  const { questions } = useSuggestedQuestions({ itemId });

  return (
    <div>
      <p>Get Suggested Questions</p>
      <pre>{JSON.stringify(questions, null, 2)}</pre>
    </div>
  );
}

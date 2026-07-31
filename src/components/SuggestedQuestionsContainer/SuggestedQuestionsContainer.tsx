import React from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import SuggestedQuestion from '../SuggestedQuestion/SuggestedQuestion';
import { Question, SuggestedQuestionsRenderProps, Translations } from '../../types';
import { translate } from '../../utils/translate';

interface SuggestedQuestionsContainerProps {
  questions: Question[];
  onQuestionClick: (question: string) => void;
  componentOverride?: ComponentOverrideProps<SuggestedQuestionsRenderProps>;
  translations?: Translations;
}

export default function SuggestedQuestionsContainer({
  questions,
  onQuestionClick,
  componentOverride,
  translations,
}: SuggestedQuestionsContainerProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <RenderPropsWrapper
      props={{ questions, onQuestionClick }}
      override={componentOverride?.reactNode}>
      <div
        className='cio-pia-suggested-questions-container'
        data-testid='suggested-questions-list'
        role='group'
        aria-label={translate('Suggested questions', translations)}>
        {questions.map((question) => (
          <SuggestedQuestion
            key={question.value}
            question={question.value}
            onClick={() => onQuestionClick(question.value)}
          />
        ))}
      </div>
    </RenderPropsWrapper>
  );
}

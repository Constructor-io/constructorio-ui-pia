import React from 'react';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import Disclaimer from '../CioPia/Disclaimer';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
import {
  Callbacks,
  CioPiaComponentOverrides,
  ConversationEntry,
  DisclaimerPosition,
  GetAnswerResultsResponse,
  PiaCallbackContext,
  QuestionSource,
  Translations,
  Item,
} from '../../types';

interface PiaInlineAnswerProps {
  currentAnswer: string;
  currentQuestion: string;
  currentResponse: GetAnswerResultsResponse | null;
  currentSource: QuestionSource;
  currentItems: Item[] | null;
  context: PiaCallbackContext;
  showFeedback?: boolean;
  learnMoreUrl?: string;
  disclaimerPosition?: DisclaimerPosition;
  translations?: Translations;
  callbacks?: Callbacks;
  componentOverrides?: CioPiaComponentOverrides;
}

export default function PiaInlineAnswer({
  currentAnswer,
  currentQuestion,
  currentResponse,
  currentSource,
  currentItems,
  context,
  showFeedback,
  learnMoreUrl,
  disclaimerPosition = 'bottom',
  translations,
  callbacks,
  componentOverrides,
}: PiaInlineAnswerProps) {
  const disclaimer = (
    <Disclaimer
      learnMoreUrl={learnMoreUrl}
      translations={translations}
      componentOverride={componentOverrides?.disclaimer}
    />
  );

  return (
    <div className='cio-pia-answer-container'>
      {disclaimerPosition === 'top' && disclaimer}
      <Answer text={currentAnswer} componentOverride={componentOverrides?.answer} />
      {currentItems && (
        <PiaCustomCarousel
          items={currentItems}
          componentOverrides={componentOverrides?.carousel}
          callbacks={callbacks}
        />
      )}
      {showFeedback && currentResponse && (
        <Feedback
          translations={translations}
          onFeedback={(type) => {
            const entry: ConversationEntry = {
              id: 0,
              question: currentQuestion,
              answer: currentAnswer,
              source: currentSource,
              items: currentItems,
              response: currentResponse,
              qnaResultId: currentResponse.qna_result_id,
            };
            callbacks?.onFeedback?.(type, entry, context);
          }}
          componentOverride={componentOverrides?.feedback}
        />
      )}
      {disclaimerPosition === 'bottom' && disclaimer}
    </div>
  );
}

import React from 'react';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import Disclaimer from '../CioPia/Disclaimer';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
import {
  Callbacks,
  CioPiaComponentOverrides,
  DisclaimerPosition,
  GetAnswerResultsResponse,
  Translations,
  Item,
} from '../../types';

interface PiaInlineAnswerProps {
  currentAnswer: string;
  currentQuestion: string;
  currentResponse: GetAnswerResultsResponse;
  currentItems: Item[] | null;
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
  currentItems,
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
      {showFeedback && (
        <Feedback
          translations={translations}
          onFeedback={(type) => callbacks?.onFeedback?.(type, currentQuestion, currentResponse)}
          componentOverride={componentOverrides?.feedback}
        />
      )}
      {disclaimerPosition === 'bottom' && disclaimer}
    </div>
  );
}

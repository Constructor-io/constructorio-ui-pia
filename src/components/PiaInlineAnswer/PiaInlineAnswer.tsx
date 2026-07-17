import React from 'react';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import Disclaimer from '../CioPia/Disclaimer';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
import {
  Callbacks,
  CioPiaComponentOverrides,
  DisclaimerPosition,
  FeedbackType,
  Translations,
  Item,
} from '../../types';

interface PiaInlineAnswerProps {
  currentAnswer: string;
  currentItems: Item[] | null;
  showFeedback?: boolean;
  learnMoreUrl?: string;
  disclaimerPosition?: DisclaimerPosition;
  translations?: Translations;
  callbacks?: Callbacks;
  componentOverrides?: CioPiaComponentOverrides;
  onFeedback?: (type: FeedbackType) => void;
  onResultClick?: (item: Item, position: number, question: string, qnaResultId?: string) => void;
  question?: string;
  qnaResultId?: string;
}

export default function PiaInlineAnswer({
  currentAnswer,
  currentItems,
  showFeedback,
  learnMoreUrl,
  disclaimerPosition = 'bottom',
  translations,
  callbacks,
  componentOverrides,
  onFeedback,
  onResultClick,
  question,
  qnaResultId,
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
          onResultClick={onResultClick}
          question={question}
          qnaResultId={qnaResultId}
        />
      )}
      {showFeedback && (
        <Feedback
          translations={translations}
          onFeedback={onFeedback || callbacks?.onFeedback}
          componentOverride={componentOverrides?.feedback}
        />
      )}
      {disclaimerPosition === 'bottom' && disclaimer}
    </div>
  );
}

import React from 'react';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import Disclaimer from '../CioPia/Disclaimer';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
import { Callbacks, CioPiaComponentOverrides, Translations, Item } from '../../types';

interface PiaInlineAnswerProps {
  currentAnswer: string;
  currentItems: Item[] | null;
  showFeedback?: boolean;
  learnMoreUrl?: string;
  translations?: Translations;
  callbacks?: Callbacks;
  componentOverrides?: CioPiaComponentOverrides;
}

export default function PiaInlineAnswer({
  currentAnswer,
  currentItems,
  showFeedback,
  learnMoreUrl,
  translations,
  callbacks,
  componentOverrides,
}: PiaInlineAnswerProps) {
  return (
    <div className='cio-pia-answer-container'>
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
          onFeedback={callbacks?.onFeedback}
          componentOverride={componentOverrides?.feedback}
        />
      )}
      <Disclaimer
        learnMoreUrl={learnMoreUrl}
        translations={translations}
        componentOverride={componentOverrides?.disclaimer}
      />
    </div>
  );
}

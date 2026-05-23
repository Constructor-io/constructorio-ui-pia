import React from 'react';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import Disclaimer from '../CioPia/Disclaimer';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
import {
  ConversationEntry,
  Translations,
  Item,
  Callbacks,
  CioPiaComponentOverrides,
  DisclaimerPosition,
} from '../../types';

export interface ConversationHistoryProps {
  conversationHistory: ConversationEntry[];
  isLoading: boolean;
  error: Error | null;
  /**
   * Items for the latest conversation entry's carousel.
   * - `undefined` (not provided): falls back to entry.items
   * - `null`: explicitly no items, hides the carousel
   * - `Item[]`: shows these items, overriding entry.items
   */
  currentItems?: Item[] | null;
  showFeedback?: boolean;
  /**
   * Show product carousels on non-last conversation entries. Defaults to true.
   * The last entry always falls back to its own items when currentItems is not provided.
   */
  showPreviousItems?: boolean;
  learnMoreUrl?: string;
  disclaimerPosition?: DisclaimerPosition;
  translations?: Translations;
  callbacks?: Callbacks;
  componentOverrides?: CioPiaComponentOverrides;
}

export default function ConversationHistory({
  conversationHistory,
  isLoading,
  error,
  currentItems,
  showFeedback,
  showPreviousItems = true,
  learnMoreUrl,
  disclaimerPosition = 'bottom',
  translations,
  callbacks,
  componentOverrides,
}: ConversationHistoryProps) {
  const disclaimer = (
    <Disclaimer
      learnMoreUrl={learnMoreUrl}
      translations={translations}
      componentOverride={componentOverrides?.disclaimer}
    />
  );

  return (
    <div className='cio-pia-conversation-history' role='log' aria-label='Conversation history'>
      {disclaimerPosition === 'top' && disclaimer}
      {conversationHistory.map((entry, index) => {
        const isLast = index === conversationHistory.length - 1;
        const previousEntryItems = showPreviousItems ? entry.items : null;
        const latestEntryItems = currentItems !== undefined ? currentItems : entry.items;
        const carouselItems = isLast ? latestEntryItems : previousEntryItems;

        return (
          <div key={entry.id} className='cio-pia-conversation-entry'>
            <div className='cio-pia-chat-question'>{entry.question}</div>

            {isLast && isLoading && (
              <div className='cio-pia-conversation-loading' aria-live='polite'>
                <LoadingSkeleton />
              </div>
            )}

            {isLast && !isLoading && error && (
              <ErrorBlock message={error.message || 'Unexpected error'} />
            )}

            {entry.answer && (
              <div className='cio-pia-answer-container'>
                <Answer text={entry.answer} componentOverride={componentOverrides?.answer} />
                {carouselItems && (
                  <PiaCustomCarousel
                    items={carouselItems}
                    componentOverrides={componentOverrides?.carousel}
                    callbacks={callbacks}
                  />
                )}
                {isLast && showFeedback && (
                  <Feedback
                    translations={translations}
                    onFeedback={callbacks?.onFeedback}
                    componentOverride={componentOverrides?.feedback}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
      {disclaimerPosition === 'bottom' && disclaimer}
    </div>
  );
}

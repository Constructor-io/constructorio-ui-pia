import React, { useEffect, useRef } from 'react';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import Disclaimer from '../CioPia/Disclaimer';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
import {
  ConversationEntry,
  FeedbackType,
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
  handleFeedback?: (type: FeedbackType) => void;
  onResultClick?: (item: Item, position: number, question: string, qnaResultId?: string) => void;
  qnaResultId?: string;
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
  handleFeedback,
  onResultClick,
  qnaResultId,
}: ConversationHistoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return undefined;

    const frameId = requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });

    return () => cancelAnimationFrame(frameId);
  }, [conversationHistory, isLoading]);

  const disclaimer = (
    <Disclaimer
      learnMoreUrl={learnMoreUrl}
      translations={translations}
      componentOverride={componentOverrides?.disclaimer}
    />
  );

  return (
    <div className='cio-pia-conversation-history'>
      {disclaimerPosition === 'top' && disclaimer}
      <div
        ref={scrollContainerRef}
        className='cio-pia-conversation-entries'
        role='log'
        aria-label='Conversation history'>
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
                      onResultClick={onResultClick}
                      question={entry.question}
                      qnaResultId={qnaResultId}
                    />
                  )}
                  {isLast && showFeedback && (
                    <Feedback
                      translations={translations}
                      onFeedback={handleFeedback}
                      componentOverride={componentOverrides?.feedback}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {disclaimerPosition === 'bottom' && disclaimer}
    </div>
  );
}

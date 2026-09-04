import React, { useEffect, useRef } from 'react';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import Disclaimer from '../CioPia/Disclaimer';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
import StatusRegion, { answerStatusMessage } from '../StatusRegion/StatusRegion';
import { translate } from '../../utils/translate';
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
  /**
   * Whether the answer request itself is in flight. `isLoading` also covers the follow-up
   * questions request, which is fine for the visible skeleton but would make the status region
   * announce "Loading answer" while only the questions are loading. Defaults to `isLoading`.
   */
  isAnswerLoading?: boolean;
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
  priceCurrency?: string;
}

export default function ConversationHistory({
  conversationHistory,
  isLoading,
  isAnswerLoading = isLoading,
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
  priceCurrency,
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

  const lastEntry = conversationHistory[conversationHistory.length - 1];
  const answerStatus = answerStatusMessage(isAnswerLoading, !!lastEntry?.answer, translations);

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
        tabIndex={0}
        aria-label={translate('Conversation history', translations)}>
        {conversationHistory.map((entry, index) => {
          const isLast = index === conversationHistory.length - 1;
          const previousEntryItems = showPreviousItems ? entry.items : null;
          const latestEntryItems = currentItems !== undefined ? currentItems : entry.items;
          const carouselItems = isLast ? latestEntryItems : previousEntryItems;

          return (
            <div key={entry.id} className='cio-pia-conversation-entry'>
              <div className='cio-pia-chat-question'>{entry.question}</div>

              {isLast && isLoading && (
                <div className='cio-pia-conversation-loading'>
                  <LoadingSkeleton componentOverride={componentOverrides?.loading} />
                </div>
              )}

              {/* The surrounding `role='log'` announces inserted text, so the block must not
                  be an alert as well. Remount when the message changes so the log sees a new
                  insertion. */}
              {isLast && !isLoading && error && (
                <ErrorBlock
                  key={error.message}
                  message={error.message}
                  translations={translations}
                  announce={false}
                />
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
                      translations={translations}
                      priceCurrency={priceCurrency}
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
      {/* Kept outside the `role='log'` so the two live regions do not nest. */}
      <StatusRegion message={answerStatus} data-testid='answer-status' />
    </div>
  );
}

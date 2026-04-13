import React, { useEffect, useRef } from 'react';
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
} from '../../types';

export interface ConversationHistoryProps {
  conversationHistory: ConversationEntry[];
  isLoading: boolean;
  error: Error | null;
  currentItems?: Item[] | null;
  showFeedback?: boolean;
  learnMoreUrl?: string;
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
  learnMoreUrl,
  translations,
  callbacks,
  componentOverrides,
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

  return (
    <div
      ref={scrollContainerRef}
      className='cio-pia-conversation-history'
      role='log'
      aria-label='Conversation history'>
      {conversationHistory.map((entry, index) => {
        const isLast = index === conversationHistory.length - 1;

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
                {(isLast ? currentItems : entry.items) && (
                  <PiaCustomCarousel
                    items={(isLast ? currentItems : entry.items)!}
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
            {isLast && entry.answer && (
              <Disclaimer
                learnMoreUrl={learnMoreUrl}
                translations={translations}
                componentOverride={componentOverrides?.disclaimer}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

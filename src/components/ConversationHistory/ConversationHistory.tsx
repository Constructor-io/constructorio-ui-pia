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
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });
  }, [conversationHistory, isLoading]);

  return (
    <div
      ref={scrollContainerRef}
      className='cio-pia-conversation-history'
      role='log'
      aria-label='Conversation history'>
      {conversationHistory.map((entry) => {
        const lastEntry = conversationHistory[conversationHistory.length - 1];
        const isLast = entry === lastEntry;

        return (
          <div key={entry.id} className='cio-pia-conversation-entry'>
            <div className='cio-pia-chat-question'>{entry.question}</div>

            {isLast && isLoading && (
              <div className='cio-pia-conversation-loading'>
                <LoadingSkeleton />
              </div>
            )}

            {isLast && !isLoading && error && (
              <ErrorBlock message={error.message || 'Unexpected error'} />
            )}

            {entry.answer && (
              <div className='cio-pia-answer-container'>
                <Answer text={entry.answer} componentOverride={componentOverrides?.answer} />
                {isLast && currentItems && (
                  <PiaCustomCarousel
                    items={currentItems}
                    componentOverrides={componentOverrides?.carousel}
                    callbacks={callbacks}
                  />
                )}
                {isLast && showFeedback && (
                  <Feedback
                    translations={translations}
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

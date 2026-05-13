import { useCallback, useEffect, useRef } from 'react';
import { Question } from '../types';
import { UseTrackingReturn, TimeSpan } from './useTracking';

const FLUSH_INTERVAL_MS = 5 * 60 * 1000;

export interface UseViewportTrackingProps {
  tracking: UseTrackingReturn;
  questions: Question[];
}

export interface UseViewportTrackingReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function useViewportTracking({
  tracking,
  questions,
}: UseViewportTrackingProps): UseViewportTrackingReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timespansRef = useRef<TimeSpan[]>([]);
  const entryTimeRef = useRef<string | null>(null);
  const questionsRef = useRef<Question[]>(questions);
  const trackingRef = useRef(tracking);

  useEffect(() => {
    const hadQuestions = questionsRef.current.length > 0;
    questionsRef.current = questions;
    if (!hadQuestions && questions.length > 0 && entryTimeRef.current) {
      trackingRef.current.trackView(questions);
    }
  }, [questions]);

  useEffect(() => {
    trackingRef.current = tracking;
  }, [tracking]);

  const flush = useCallback(() => {
    if (entryTimeRef.current) {
      timespansRef.current.push({
        start: entryTimeRef.current,
        end: new Date().toISOString(),
      });
      entryTimeRef.current = null;
    }
    if (timespansRef.current.length > 0 && questionsRef.current.length > 0) {
      trackingRef.current.trackViews(questionsRef.current, [...timespansRef.current]);
      timespansRef.current = [];
    }
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entryTimeRef.current = new Date().toISOString();
          if (questionsRef.current.length > 0) {
            trackingRef.current.trackView(questionsRef.current);
          }
        } else if (entryTimeRef.current) {
          timespansRef.current.push({
            start: entryTimeRef.current,
            end: new Date().toISOString(),
          });
          entryTimeRef.current = null;
          trackingRef.current.trackOutOfView();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    const intervalId = setInterval(flush, FLUSH_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      flush();
    };
  }, [flush]);

  return { containerRef };
}

import { useCallback, useEffect, useRef } from 'react';
import { Callbacks, PiaCallbackContext } from '../types';

export interface UseViewportCallbacksProps {
  callbacks?: Callbacks;
  context: PiaCallbackContext;
}

export interface UseViewportCallbacksReturn {
  containerRef: (node: HTMLDivElement | null) => void;
}

export default function useViewportCallbacks({
  callbacks,
  context,
}: UseViewportCallbacksProps): UseViewportCallbacksReturn {
  const callbacksRef = useRef(callbacks);
  const contextRef = useRef(context);
  const hasBeenVisibleRef = useRef(false);
  const hasFiredOutOfViewRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    hasBeenVisibleRef.current = false;
    hasFiredOutOfViewRef.current = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisibleRef.current) {
          hasBeenVisibleRef.current = true;
          callbacksRef.current?.onView?.(contextRef.current);
        } else if (
          !entry.isIntersecting &&
          hasBeenVisibleRef.current &&
          !hasFiredOutOfViewRef.current
        ) {
          hasFiredOutOfViewRef.current = true;
          callbacksRef.current?.onOutOfView?.(contextRef.current);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    observerRef.current = observer;
  }, []);

  return { containerRef };
}

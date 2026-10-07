import { useCallback, useEffect, useRef } from 'react';

export interface UseReturnFocusToInputReturn {
  inputRef: (node: HTMLElement | null) => void;
  returnFocusAfterLoading: () => void;
}

/**
 * While an answer loads, the control the shopper used to ask is disabled or swapped for a
 * skeleton, and the browser drops focus to <body>.
 */
export default function useReturnFocusToInput(isLoading: boolean): UseReturnFocusToInputReturn {
  const inputNodeRef = useRef<HTMLElement | null>(null);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (isLoading || !pendingRef.current) return;
    pendingRef.current = false;

    const active = document.activeElement;
    const focusWasDropped = !active || active === document.body;
    if (inputNodeRef.current && focusWasDropped) inputNodeRef.current.focus();
  }, [isLoading]);

  const inputRef = useCallback((node: HTMLElement | null) => {
    inputNodeRef.current = node;
  }, []);

  const returnFocusAfterLoading = useCallback(() => {
    pendingRef.current = true;
  }, []);

  return { inputRef, returnFocusAfterLoading };
}

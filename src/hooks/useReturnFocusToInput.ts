import { RefObject, useCallback, useEffect, useRef } from 'react';

export interface UseReturnFocusToInputReturn {
  inputRef: RefObject<HTMLInputElement | null>;
  returnFocusAfterLoading: () => void;
}

/**
 * While an answer loads, the control the shopper used to ask is disabled or swapped for a
 * skeleton, and the browser drops focus to <body>.
 */
export default function useReturnFocusToInput(isLoading: boolean): UseReturnFocusToInputReturn {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (isLoading || !pendingRef.current) return;
    pendingRef.current = false;

    const active = document.activeElement;
    const focusWasDropped = !active || active === document.body;
    if (inputRef.current && focusWasDropped) inputRef.current.focus();
  }, [isLoading]);

  const returnFocusAfterLoading = useCallback(() => {
    pendingRef.current = true;
  }, []);

  return { inputRef, returnFocusAfterLoading };
}

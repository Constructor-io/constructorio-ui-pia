import { useCallback, useEffect, useRef } from 'react';

// A press or Tab this recent is what moved focus; touch focuses on release, after a short press.
const INTENT_WINDOW_MS = 1000;

/**
 * Tells focus the shopper caused (a click, tap or Tab) from focus moved in code: `autofocus`, the
 * widget returning focus after an answer, or the page calling `focus()`. The browser raises the
 * same trusted focus event for both, so the shopper's press or key has to be watched separately.
 */
export default function useUserInitiatedFocus(): () => boolean {
  const pressRef = useRef<{ target: Node; time: number } | null>(null);
  const tabTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node) {
        pressRef.current = { target: event.target, time: performance.now() };
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') tabTimeRef.current = performance.now();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return useCallback(() => {
    const focused = document.activeElement;
    if (!focused) return false;
    const now = performance.now();

    const press = pressRef.current;
    if (press && now - press.time < INTENT_WINDOW_MS) {
      const label = press.target instanceof Element ? press.target.closest('label') : null;
      // A press elsewhere, such as the modal's close button, only moves focus in code.
      if (focused.contains(press.target) || label?.control === focused) return true;
    }

    return tabTimeRef.current !== null && now - tabTimeRef.current < INTENT_WINDOW_MS;
  }, []);
}

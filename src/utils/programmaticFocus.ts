let isFocusingInCode = false;

/**
 * Runs `move` while the widget moves focus for its own reasons, so the focus events it raises are
 * not tracked as the shopper's. Focus moves raise their events synchronously, so the flag covers
 * exactly those events and the shopper's own focus is still tracked.
 */
export function withoutFocusTracking(move: () => void): void {
  isFocusingInCode = true;
  try {
    move();
  } finally {
    isFocusingInCode = false;
  }
}

/** Focuses `element` without tracking it, such as returning focus to the input after an answer. */
export function focusWithoutTracking(element: HTMLElement): void {
  withoutFocusTracking(() => element.focus());
}

/** True while the widget is moving focus in `withoutFocusTracking`. */
export function isFocusWithoutTracking(): boolean {
  return isFocusingInCode;
}

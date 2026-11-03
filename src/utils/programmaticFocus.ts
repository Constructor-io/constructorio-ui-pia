let isFocusingInCode = false;

/**
 * Moves focus for the widget's own reasons, such as returning it to the input after an answer.
 * `focus()` raises the focus event synchronously, so the flag covers exactly that event and the
 * shopper's own focus is still tracked.
 */
export function focusWithoutTracking(element: HTMLElement): void {
  isFocusingInCode = true;
  try {
    element.focus();
  } finally {
    isFocusingInCode = false;
  }
}

/** True while `focusWithoutTracking` is moving focus. */
export function isFocusWithoutTracking(): boolean {
  return isFocusingInCode;
}

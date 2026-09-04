import React from 'react';
import { Translations } from '../../types';
import { translate } from '../../utils/translate';

// Inline so it stays hidden for consumers who do not load the stylesheet.
const SR_ONLY_STYLE: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

interface StatusRegionProps {
  message: string;
  'data-testid'?: string;
}

/**
 * Visually hidden `role='status'`. Keep it mounted and change only `message`:
 * a live region created together with its text is announced inconsistently.
 */
export default function StatusRegion({ message, 'data-testid': testId }: StatusRegionProps) {
  return (
    <div className='cio-pia-sr-only' style={SR_ONLY_STYLE} role='status' data-testid={testId}>
      {message}
    </div>
  );
}

export function answerStatusMessage(
  isLoading: boolean,
  hasAnswer: boolean,
  translations?: Translations,
): string {
  if (isLoading) return translate('Loading answer', translations);
  if (hasAnswer) return translate('Answer ready', translations);

  return '';
}

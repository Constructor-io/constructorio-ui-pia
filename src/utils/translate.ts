import { Translations } from '../types';
import { DISCLAIMER_TEXT } from '../constants';

const defaultTranslations: Translations = {
  'Any questions about this product?': 'Any questions about this product?',
  'Ask anything': 'Ask anything',
  Send: 'Send',
  [DISCLAIMER_TEXT]: DISCLAIMER_TEXT,
  'Is this answer useful?': 'Is this answer useful?',
  'Learn More.': 'Learn More.',
  'Ask about this product': 'Ask about this product',
  // Accessible names and live-region announcements. Defaults intentionally match
  // the strings that were previously hardcoded in the components.
  'thumbs up': 'thumbs up',
  'thumbs down': 'thumbs down',
  Close: 'Close',
  Retry: 'Retry',
  'Conversation history': 'Conversation history',
  'Suggested questions': 'Suggested questions',
  'Loading suggestions': 'Loading suggestions',
  'Loading answer': 'Loading answer',
};

/**
 * Translates a word using the provided translations object.
 * Falls back to English defaults if translation is not provided.
 *
 * @param word - The key to translate
 * @param translations - Optional user-provided translations object
 * @returns The translated string or the original word if no translation exists
 */
export const translate = (word: string, translations?: Translations): string => {
  if (translations && translations[word as keyof Translations] !== undefined) {
    return translations[word as keyof Translations] as string;
  }

  return (defaultTranslations[word as keyof Translations] as string) || word;
};

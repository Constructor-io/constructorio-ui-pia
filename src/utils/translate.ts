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
};

/**
 * Translates a word using the provided translations object.
 * Falls back to English defaults if translation is not provided.
 *
 * @param word - The key to translate
 * @param translations - Optional user-provided translations object
 * @returns The translated string or the original word if no translation exists
 */
// eslint-disable-next-line import/prefer-default-export
export const translate = (word: string, translations?: Translations): string => {
  if (translations && translations[word as keyof Translations] !== undefined) {
    return translations[word as keyof Translations] as string;
  }

  return (defaultTranslations[word as keyof Translations] as string) || word;
};

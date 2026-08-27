import { Translations } from '../types';
import {
  DISCLAIMER_TEXT,
  RECS_FALLBACK_TITLE,
  RECS_INPUT_PLACEHOLDER,
  RECS_LOADING_TITLE,
  RECS_REFINEMENT_LABEL,
  RECS_TITLE_ALTERNATIVE,
  RECS_TITLE_COMPLEMENTARY,
  RECS_UNSUPPORTED_REQUEST,
} from '../constants';

const defaultTranslations: Translations = {
  'Any questions about this product?': 'Any questions about this product?',
  'Ask anything': 'Ask anything',
  Send: 'Send',
  [DISCLAIMER_TEXT]: DISCLAIMER_TEXT,
  'Is this answer useful?': 'Is this answer useful?',
  'Learn More.': 'Learn More.',
  'Ask about this product': 'Ask about this product',
  'Add to Cart': 'Add to Cart',
  [RECS_LOADING_TITLE]: RECS_LOADING_TITLE,
  [RECS_FALLBACK_TITLE]: RECS_FALLBACK_TITLE,
  [RECS_TITLE_COMPLEMENTARY]: RECS_TITLE_COMPLEMENTARY,
  [RECS_TITLE_ALTERNATIVE]: RECS_TITLE_ALTERNATIVE,
  [RECS_UNSUPPORTED_REQUEST]: RECS_UNSUPPORTED_REQUEST,
  [RECS_REFINEMENT_LABEL]: RECS_REFINEMENT_LABEL,
  [RECS_INPUT_PLACEHOLDER]: RECS_INPUT_PLACEHOLDER,
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

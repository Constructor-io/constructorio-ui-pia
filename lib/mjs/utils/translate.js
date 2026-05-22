import { DISCLAIMER_TEXT } from '../constants';
const defaultTranslations = {
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
export const translate = (word, translations) => {
    if (translations && translations[word] !== undefined) {
        return translations[word];
    }
    return defaultTranslations[word] || word;
};

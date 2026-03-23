import { Translations } from '../types';
import { DISCLAIMER_TEXT } from '../constants';

const defaultTranslations: Required<Translations> = {
  title: 'Any questions about this product?',
  inputPlaceholder: 'Ask anything',
  sendButtonText: 'Send',
  disclaimerText: DISCLAIMER_TEXT,
  feedbackText: 'Is this answer useful?',
  learnMoreText: 'Learn More.',
};

export const translate = (key: keyof Translations, translations?: Translations): string => {
  if (translations?.[key] !== undefined) return translations[key] as string;
  return defaultTranslations[key];
};

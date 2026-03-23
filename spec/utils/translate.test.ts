import { translate } from '../../src/utils/translate';
import { DISCLAIMER_TEXT } from '../../src/constants';

describe('translate', () => {
  it('returns default values when no translations are provided', () => {
    expect(translate('title')).toBe('Any questions about this product?');
    expect(translate('inputPlaceholder')).toBe('Ask anything');
    expect(translate('sendButtonText')).toBe('Send');
    expect(translate('disclaimerText')).toBe(DISCLAIMER_TEXT);
    expect(translate('feedbackText')).toBe('Is this answer useful?');
    expect(translate('learnMoreText')).toBe('Learn More.');
  });

  it('returns default values when translations is undefined', () => {
    expect(translate('title', undefined)).toBe('Any questions about this product?');
  });

  it('returns custom translation when provided', () => {
    const translations = { title: 'Custom title' };
    expect(translate('title', translations)).toBe('Custom title');
  });

  it('returns default for keys not in partial translations object', () => {
    const translations = { title: 'Custom title' };
    expect(translate('sendButtonText', translations)).toBe('Send');
    expect(translate('feedbackText', translations)).toBe('Is this answer useful?');
  });

  it('handles all keys being overridden', () => {
    const translations = {
      title: 'Título',
      inputPlaceholder: 'Pregunta',
      sendButtonText: 'Enviar',
      disclaimerText: 'Aviso',
      feedbackText: 'Útil?',
      learnMoreText: 'Más info.',
    };
    expect(translate('title', translations)).toBe('Título');
    expect(translate('inputPlaceholder', translations)).toBe('Pregunta');
    expect(translate('sendButtonText', translations)).toBe('Enviar');
    expect(translate('disclaimerText', translations)).toBe('Aviso');
    expect(translate('feedbackText', translations)).toBe('Útil?');
    expect(translate('learnMoreText', translations)).toBe('Más info.');
  });

  it('returns empty string when translation is explicitly set to empty string', () => {
    const translations = { title: '' };
    expect(translate('title', translations)).toBe('');
  });
});

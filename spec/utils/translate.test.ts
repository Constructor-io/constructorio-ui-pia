import { translate } from '../../src/utils/translate';
import { DISCLAIMER_TEXT } from '../../src/constants';

describe('translate', () => {
  it('returns default values when no translations are provided', () => {
    expect(translate('Any questions about this product?')).toBe(
      'Any questions about this product?',
    );
    expect(translate('Ask anything')).toBe('Ask anything');
    expect(translate('Send')).toBe('Send');
    expect(translate(DISCLAIMER_TEXT)).toBe(DISCLAIMER_TEXT);
    expect(translate('Is this answer useful?')).toBe('Is this answer useful?');
    expect(translate('Learn More.')).toBe('Learn More.');
  });

  it('returns default values when translations is undefined', () => {
    expect(translate('Any questions about this product?', undefined)).toBe(
      'Any questions about this product?',
    );
  });

  it('returns custom translation when provided', () => {
    const translations = { 'Any questions about this product?': 'Custom title' };
    expect(translate('Any questions about this product?', translations)).toBe('Custom title');
  });

  it('returns default for keys not in partial translations object', () => {
    const translations = { 'Any questions about this product?': 'Custom title' };
    expect(translate('Send', translations)).toBe('Send');
    expect(translate('Is this answer useful?', translations)).toBe('Is this answer useful?');
  });

  it('handles all keys being overridden', () => {
    const translations = {
      'Any questions about this product?': 'Título',
      'Ask anything': 'Pregunta',
      Send: 'Enviar',
      [DISCLAIMER_TEXT]: 'Aviso',
      'Is this answer useful?': 'Útil?',
      'Learn More.': 'Más info.',
    };
    expect(translate('Any questions about this product?', translations)).toBe('Título');
    expect(translate('Ask anything', translations)).toBe('Pregunta');
    expect(translate('Send', translations)).toBe('Enviar');
    expect(translate(DISCLAIMER_TEXT, translations)).toBe('Aviso');
    expect(translate('Is this answer useful?', translations)).toBe('Útil?');
    expect(translate('Learn More.', translations)).toBe('Más info.');
  });

  it('returns empty string when translation is explicitly set to empty string', () => {
    const translations = { 'Any questions about this product?': '' };
    expect(translate('Any questions about this product?', translations)).toBe('');
  });

  it('returns original word if no translation exists in defaults', () => {
    expect(translate('non-existent-key')).toBe('non-existent-key');
  });

  it('handles empty translations object', () => {
    const emptyTranslations = {};
    expect(translate('Any questions about this product?', emptyTranslations)).toBe(
      'Any questions about this product?',
    );
    expect(translate('Send', emptyTranslations)).toBe('Send');
  });
});

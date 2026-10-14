import { sanitizeHtml, renderMarkdown } from '../../src/utils/contentTransformers';

describe('content transformers on the server', () => {
  it('return an empty string instead of throwing, so callers fall back to plain text', () => {
    expect(typeof window).toBe('undefined');
    expect(renderMarkdown('**Bold**')).toBe('');
    expect(sanitizeHtml('<b>Bold</b>')).toBe('');
  });
});

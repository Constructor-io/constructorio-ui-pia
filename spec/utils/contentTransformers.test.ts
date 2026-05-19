import { sanitizeHtml, renderMarkdown } from '../../src/utils/contentTransformers';

describe('sanitizeHtml', () => {
  it('preserves safe HTML tags', () => {
    const input = '<b>Bold</b> and <a href="https://example.com">link</a>';
    expect(sanitizeHtml(input)).toBe(input);
  });

  it('strips script tags', () => {
    const input = '<p>Safe</p><script>alert("xss")</script>';
    expect(sanitizeHtml(input)).toBe('<p>Safe</p>');
  });

  it('strips style tags', () => {
    const input = '<style>body{display:none}</style><p>Content</p>';
    expect(sanitizeHtml(input)).toBe('<p>Content</p>');
  });

  it('strips iframe tags', () => {
    const input = '<iframe src="https://evil.com"></iframe><p>Safe</p>';
    expect(sanitizeHtml(input)).toBe('<p>Safe</p>');
  });

  it('strips event handler attributes', () => {
    const input = '<img src="pic.jpg" onerror="alert(1)">';
    expect(sanitizeHtml(input)).toBe('<img src="pic.jpg">');
  });

  it('strips onclick attributes', () => {
    const input = '<button onclick="steal()">Click</button>';
    expect(sanitizeHtml(input)).toBe('<button>Click</button>');
  });

  it('preserves list markup', () => {
    const input = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    expect(sanitizeHtml(input)).toBe(input);
  });

  it('handles empty string', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('handles null and undefined gracefully', () => {
    expect(sanitizeHtml(null as unknown as string)).toBe('');
    expect(sanitizeHtml(undefined as unknown as string)).toBe('');
  });

  it('handles plain text without modification', () => {
    const input = 'Just plain text with no HTML';
    expect(sanitizeHtml(input)).toBe(input);
  });
});

describe('renderMarkdown', () => {
  it('converts bold markdown to HTML', () => {
    expect(renderMarkdown('**Bold**')).toBe('<p><strong>Bold</strong></p>\n');
  });

  it('converts markdown links to anchor tags', () => {
    const result = renderMarkdown('[link](https://example.com)');
    expect(result).toBe('<p><a href="https://example.com">link</a></p>\n');
  });

  it('converts markdown lists to HTML', () => {
    const input = '- Item 1\n- Item 2';
    const result = renderMarkdown(input);
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>Item 1</li>');
    expect(result).toContain('<li>Item 2</li>');
  });

  it('passes through inline HTML safely', () => {
    const input = 'Text with <a href="https://example.com">a link</a> inside';
    const result = renderMarkdown(input);
    expect(result).toContain('<a href="https://example.com">a link</a>');
  });

  it('strips script tags from markdown content', () => {
    const input = 'Hello <script>alert("xss")</script> world';
    const result = renderMarkdown(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('Hello');
    expect(result).toContain('world');
  });

  it('strips event handlers from inline HTML in markdown', () => {
    const input = 'Click <img src="x" onerror="alert(1)"> here';
    const result = renderMarkdown(input);
    expect(result).not.toContain('onerror');
  });

  it('converts single newlines to line breaks', () => {
    const input = 'Line one\nLine two';
    expect(renderMarkdown(input)).toBe('<p>Line one<br>Line two</p>\n');
  });

  it('handles content with newlines as paragraph breaks', () => {
    const input = 'First paragraph\n\nSecond paragraph';
    const result = renderMarkdown(input);
    expect(result).toContain('<p>First paragraph</p>');
    expect(result).toContain('<p>Second paragraph</p>');
  });

  it('handles empty string', () => {
    expect(renderMarkdown('')).toBe('');
  });

  it('handles null and undefined gracefully', () => {
    expect(renderMarkdown(null as unknown as string)).toBe('');
    expect(renderMarkdown(undefined as unknown as string)).toBe('');
  });
});

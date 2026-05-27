import DOMPurify from 'dompurify';
import { marked } from 'marked';

const purifyConfig: DOMPurify.Config = {
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
};

/** Options for {@link renderMarkdown}. */
export interface RenderMarkdownOptions {
  /**
   * Patterns matched against each anchor `href` value. When a pattern matches,
   * the href is kept even if DOMPurify would otherwise strip it (e.g. `javascript:` or `sms:` URIs).
   *
   * Only use narrow, anchored patterns for known application-controlled values.
   * A broad pattern like `/^javascript:/` re-enables XSS via `javascript:` URIs.
   *
   * @example
   * allowedHrefPatterns: [/^javascript:window\.openChat\(\)$/, /^sms:/]
   */
  allowedHrefPatterns?: RegExp[];
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, purifyConfig);
}

export function renderMarkdown(content: string, options?: RenderMarkdownOptions): string {
  if (!content) return '';
  const html = marked.parse(content, { async: false, breaks: true });

  if (options?.allowedHrefPatterns?.length) {
    const patterns = options.allowedHrefPatterns;
    const purifier = DOMPurify(window);
    purifier.addHook('uponSanitizeAttribute', (node, event) => {
      if (node.tagName === 'A' && event.attrName === 'href') {
        if (patterns.some((pattern) => pattern.test(event.attrValue))) {
          event.forceKeepAttr = true;
        }
      }
    });
    return purifier.sanitize(html, purifyConfig);
  }

  return DOMPurify.sanitize(html, purifyConfig);
}

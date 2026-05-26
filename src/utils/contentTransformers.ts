import DOMPurify from 'dompurify';
import { marked } from 'marked';

const purifyConfig: DOMPurify.Config = {
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
};

export interface RenderMarkdownOptions {
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
    DOMPurify.addHook('uponSanitizeAttribute', (node, event) => {
      if (node.tagName === 'A' && event.attrName === 'href') {
        if (patterns.some((pattern) => pattern.test(event.attrValue))) {
          event.forceKeepAttr = true;
        }
      }
    });
    const sanitized = DOMPurify.sanitize(html, purifyConfig);
    DOMPurify.removeHook('uponSanitizeAttribute');
    return sanitized;
  }

  return DOMPurify.sanitize(html, purifyConfig);
}

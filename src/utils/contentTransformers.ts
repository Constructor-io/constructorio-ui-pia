import DOMPurify from 'dompurify';
import { marked } from 'marked';

const purifyConfig: DOMPurify.Config = {
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
};

export interface SanitizeOptions {
  config: DOMPurify.Config;
}

/** Options for {@link renderMarkdown}. */
export interface RenderMarkdownOptions {
  /**
   * Override the default DOMPurify sanitization step.
   * Called with an isolated DOMPurify instance, the parsed HTML string,
   * and an options object containing the default config. Must return the sanitized HTML string.
   *
   * @example
   * sanitize: (purifier, html, { config }) => {
   *   purifier.addHook('uponSanitizeAttribute', (node, event) => {
   *     if (node.tagName === 'A' && event.attrName === 'href') {
   *       if (/^javascript:window\.openChat\(\)$/.test(event.attrValue)) {
   *         event.forceKeepAttr = true;
   *       }
   *     }
   *   });
   *   return purifier.sanitize(html, config);
   * }
   */
  sanitize?: (purifier: typeof DOMPurify, html: string, options: SanitizeOptions) => string;
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, purifyConfig);
}

export function renderMarkdown(content: string, options?: RenderMarkdownOptions): string {
  if (!content) return '';
  const html = marked.parse(content, { async: false, breaks: true });

  if (options?.sanitize) {
    const purifier = DOMPurify(window);
    return options.sanitize(purifier, html, { config: purifyConfig });
  }

  return DOMPurify.sanitize(html, purifyConfig);
}

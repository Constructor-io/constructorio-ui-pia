import DOMPurify, { type Config } from 'dompurify';
import { marked } from 'marked';

// For catalog HTML (product descriptions).
const purifyConfig: Config = {
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
};

// For the answer, which an LLM writes from text a shopper can steer, so only the tags `marked`
// outputs are kept. Images, media and SVG would load a URL with no click and could leak data;
// form controls and `style` could fake a form.
const markdownPurifyConfig: Config = {
  ALLOWED_TAGS:
    'p br strong em del a ul ol li blockquote hr code pre table thead tbody tr th td h1 h2 h3 h4 h5 h6'.split(
      ' ',
    ),
  ALLOWED_ATTR: ['href', 'align', 'start'],
};

// Text the agent reads (catalog, knowledge base, reviews) could plant a phishing link, so only
// links to this site, its subdomains, email and phone stay clickable. A link a custom `sanitize`
// deliberately keeps (e.g. `sms:`) stays too, but web links to other sites never do.
function isOnThisSite(href: string, { keepOtherSchemes = false } = {}): boolean {
  try {
    const url = new URL(href, window.location.href);
    if (url.protocol === 'mailto:' || url.protocol === 'tel:') return true;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return keepOtherSchemes;
    const site = window.location.hostname.replace(/^www\./, '');
    return url.hostname === site || url.hostname.endsWith(`.${site}`);
  } catch {
    return false;
  }
}

function unlinkOffSiteLinks(html: string, options?: { keepOtherSchemes?: boolean }): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('a[href]').forEach((link) => {
    if (!isOnThisSite(link.getAttribute('href')!, options)) {
      link.replaceWith(...Array.from(link.childNodes));
    }
  });
  return doc.body.innerHTML;
}

export interface SanitizeOptions {
  config: Config;
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

/**
 * Sanitizes catalog HTML such as a product description. Browser only: without a DOM to sanitize
 * with (server rendering) it returns `''`.
 */
export function sanitizeHtml(html: string): string {
  if (!html || !DOMPurify.isSupported) return '';
  return DOMPurify.sanitize(html, purifyConfig);
}

/**
 * Turns the answer's markdown into sanitized HTML. Only the tags markdown produces are kept, and
 * only links to this site, its subdomains, `mailto:` and `tel:` stay clickable. A custom `sanitize`
 * can keep other schemes, but web links to other sites always become plain text. Browser only:
 * without a DOM to sanitize with (server rendering) it returns `''`, so render the plain text.
 */
export function renderMarkdown(content: string, options?: RenderMarkdownOptions): string {
  if (!content || !DOMPurify.isSupported) return '';
  const html = marked.parse(content, { async: false, breaks: true });

  if (options?.sanitize) {
    const purifier = DOMPurify(window);
    const config = {
      ...markdownPurifyConfig,
      ALLOWED_TAGS: [...(markdownPurifyConfig.ALLOWED_TAGS ?? [])],
      ALLOWED_ATTR: [...(markdownPurifyConfig.ALLOWED_ATTR ?? [])],
    };
    return unlinkOffSiteLinks(options.sanitize(purifier, html, { config }), {
      keepOtherSchemes: true,
    });
  }

  return unlinkOffSiteLinks(DOMPurify.sanitize(html, markdownPurifyConfig));
}

import DOMPurify from 'dompurify';
import { marked } from 'marked';

const purifyConfig: DOMPurify.Config = {
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
};

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, purifyConfig);
}

export function renderMarkdown(content: string): string {
  if (!content) return '';
  const html = marked.parse(content, { async: false, breaks: true });
  return DOMPurify.sanitize(html, purifyConfig);
}

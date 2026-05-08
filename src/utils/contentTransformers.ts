import DOMPurify from 'dompurify';
import { marked } from 'marked';

const purifyConfig: DOMPurify.Config = {
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
};

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, purifyConfig);
}

export function renderMarkdown(content: string): string {
  const html = marked.parse(content) as string;
  return DOMPurify.sanitize(html, purifyConfig);
}

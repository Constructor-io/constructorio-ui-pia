import DOMPurify from 'dompurify';
import { marked } from 'marked';
const purifyConfig = {
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
};
export function sanitizeHtml(html) {
    if (!html)
        return '';
    return DOMPurify.sanitize(html, purifyConfig);
}
export function renderMarkdown(content) {
    if (!content)
        return '';
    const html = marked.parse(content, { async: false, breaks: true });
    return DOMPurify.sanitize(html, purifyConfig);
}

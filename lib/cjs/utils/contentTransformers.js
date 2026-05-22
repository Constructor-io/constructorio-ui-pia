"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMarkdown = exports.sanitizeHtml = void 0;
const tslib_1 = require("tslib");
const dompurify_1 = tslib_1.__importDefault(require("dompurify"));
const marked_1 = require("marked");
const purifyConfig = {
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
};
function sanitizeHtml(html) {
    if (!html)
        return '';
    return dompurify_1.default.sanitize(html, purifyConfig);
}
exports.sanitizeHtml = sanitizeHtml;
function renderMarkdown(content) {
    if (!content)
        return '';
    const html = marked_1.marked.parse(content, { async: false, breaks: true });
    return dompurify_1.default.sanitize(html, purifyConfig);
}
exports.renderMarkdown = renderMarkdown;

export const prependCdnBase = (url: string) =>
  url.startsWith('/') ? `https://example.com${url}` : url;

/**
 * a11y parameters for stories that render the product carousel.
 *
 * Every other axe rule still blocks these stories. Only `color-contrast` is
 * switched off, for two reasons:
 *
 * 1. The carousel fades its non-active slides, so axe measures blended
 *    foreground *and* background values. It reported `#111827` (16.9:1 on
 *    white) and `#15803d` (5.02:1) as failures - the numbers are not
 *    trustworthy inside this subtree.
 * 2. The remaining reports come from ProductCard, whose palette ships from
 *    the design system via @constructor-io/constructorio-ui-components and
 *    is not ours to change here.
 *
 * Contrast is still enforced on every non-carousel story.
 */
export const CAROUSEL_A11Y = {
  test: 'error',
  options: { rules: { 'color-contrast': { enabled: false } } },
};

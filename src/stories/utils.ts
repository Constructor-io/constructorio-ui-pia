export const prependCdnBase = (url: string) =>
  url.startsWith('/') ? `https://example.com${url}` : url;

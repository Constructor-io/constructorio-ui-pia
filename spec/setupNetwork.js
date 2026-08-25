// Shared by the `client` and `server` Jest projects.
//
// Prevents real network requests.
//
// This must be assigned before the client is constructed because it reads
// `global.fetch` during initialization. It resolves an empty response to avoid
// failures when the tracker flushes its queue asynchronously.
global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

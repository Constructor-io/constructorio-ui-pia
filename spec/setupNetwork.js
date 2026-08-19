// Shared by the `client` and `server` Jest projects.
//
// No test may reach the network: real requests make the suite slow and flaky, and
// couple it to demo-index data that changes outside this repo. This is a backstop,
// not the mocking mechanism — tests that need a specific payload mock the client
// instead, via createMockCioClient in spec/helpers/mockCioClient.ts.
//
// Assigned here rather than in a beforeEach because the Constructor client resolves
// options.fetch from the global binding at construction time (see request-queue.js),
// so the tracker's request queue is only intercepted if the stub is already in place.
//
// It resolves an empty object rather than throwing, deliberately. Throwing would name the
// offending URL when someone forgets to mock, but the tracker flushes its queue on a 250ms
// deferred timer, and in the `client` project that queue can actually drain because jsdom
// provides sessionStorage. A throwing guard could then fire after a test has finished,
// trading silent `{}` payloads for post-teardown noise — the flakiness this file exists to
// remove. Matches constructorio-ui-asa's spec/setupTests.ts.
global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

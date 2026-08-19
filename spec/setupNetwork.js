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
global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

import MockConstructorIOClient from '../../src/hooks/mocks/MockConstructorIOClient';

describe('MockAgent: URL parameters', () => {
  let requestedUrl: string;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    requestedUrl = '';
    globalThis.fetch = jest.fn(async (url: RequestInfo | URL) => {
      requestedUrl = url.toString();
      return { ok: true, json: async () => ({ questions: [], qna_result_id: 'mock', value: '' }) } as Response;
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('appends i, s, ui, c params from client options to getSuggestedQuestions URL', async () => {
    const client = new MockConstructorIOClient({
      apiKey: 'test-key',
      clientId: 'test-client-id',
      sessionId: 5,
      userId: 'test-user-id',
      sendTrackingEvents: false,
    });

    await client.agent.getSuggestedQuestions({ itemId: 'item-123' });

    const url = new URL(requestedUrl);
    expect(url.searchParams.get('i')).toBe('test-client-id');
    expect(url.searchParams.get('s')).toBe('5');
    expect(url.searchParams.get('ui')).toBe('test-user-id');
    expect(url.searchParams.get('c')).toContain('cio-ui-pia-');
  });

  it('appends us (segments) params from client options', async () => {
    const client = new MockConstructorIOClient({
      apiKey: 'test-key',
      clientId: 'test-client-id',
      sessionId: 1,
      segments: ['vip', 'returning-customer'],
      sendTrackingEvents: false,
    });

    await client.agent.getSuggestedQuestions({ itemId: 'item-123' });

    const url = new URL(requestedUrl);
    expect(url.searchParams.getAll('us')).toEqual(['vip', 'returning-customer']);
  });

  it('appends i, s, ui, c params to getAnswerResults URL', async () => {
    const client = new MockConstructorIOClient({
      apiKey: 'test-key',
      clientId: 'browser-abc',
      sessionId: 3,
      userId: 'user-xyz',
      sendTrackingEvents: false,
    });

    await client.agent.getAnswerResults({ itemId: 'item-123', question: 'Is this good?' });

    const url = new URL(requestedUrl);
    expect(url.searchParams.get('i')).toBe('browser-abc');
    expect(url.searchParams.get('s')).toBe('3');
    expect(url.searchParams.get('ui')).toBe('user-xyz');
    expect(url.searchParams.get('c')).toContain('cio-ui-pia-');
  });

  it('appends us (segments) params to getAnswerResults URL', async () => {
    const client = new MockConstructorIOClient({
      apiKey: 'test-key',
      clientId: 'test-client-id',
      sessionId: 1,
      segments: ['vip', 'returning-customer'],
      sendTrackingEvents: false,
    });

    await client.agent.getAnswerResults({ itemId: 'item-123', question: 'Is this good?' });

    const url = new URL(requestedUrl);
    expect(url.searchParams.getAll('us')).toEqual(['vip', 'returning-customer']);
  });

  it('appends us (segments) params to getAnswerResultsStream URL', async () => {
    const originalEventSource = (globalThis as Record<string, unknown>).EventSource;
    const mockEventSource = jest.fn().mockImplementation(() => ({
      addEventListener: jest.fn(),
      close: jest.fn(),
      onerror: null,
    }));
    (globalThis as Record<string, unknown>).EventSource = mockEventSource;

    try {
      const client = new MockConstructorIOClient({
        apiKey: 'test-key',
        clientId: 'test-client-id',
        sessionId: 1,
        segments: ['vip', 'returning-customer'],
        sendTrackingEvents: false,
      });

      await client.agent.getAnswerResultsStream({
        itemId: 'item-123',
        question: 'Tell me more',
        onStart: jest.fn(),
        onMessage: jest.fn(),
        onEnd: jest.fn(),
      });

      const url = new URL(mockEventSource.mock.calls[0][0]);
      expect(url.searchParams.getAll('us')).toEqual(['vip', 'returning-customer']);
    } finally {
      (globalThis as Record<string, unknown>).EventSource = originalEventSource;
    }
  });

  it('forwards explicit version as c param', async () => {
    const client = new MockConstructorIOClient({
      apiKey: 'test-key',
      clientId: 'test-client-id',
      sessionId: 1,
      version: 'my-app@1.2.3',
      sendTrackingEvents: false,
    });

    await client.agent.getSuggestedQuestions({ itemId: 'item-123' });

    const url = new URL(requestedUrl);
    expect(url.searchParams.get('c')).toBe('my-app@1.2.3');
  });

  it('does not append ui/us when userId/segments are not provided', async () => {
    const client = new MockConstructorIOClient({
      apiKey: 'test-key',
      clientId: 'test-client-id',
      sessionId: 1,
      sendTrackingEvents: false,
    });

    await client.agent.getSuggestedQuestions({ itemId: 'item-123' });

    const url = new URL(requestedUrl);
    expect(url.searchParams.get('i')).toBe('test-client-id');
    expect(url.searchParams.get('s')).toBe('1');
    expect(url.searchParams.has('ui')).toBe(false);
    expect(url.searchParams.has('us')).toBe(false);
  });

  it('sends browser-resolved i and s params when clientId and sessionId are not provided', async () => {
    const client = new MockConstructorIOClient({
      apiKey: 'test-key',
      sendTrackingEvents: false,
    });

    await client.agent.getSuggestedQuestions({ itemId: 'item-123' });

    const cookieClientId = document.cookie.match(/ConstructorioID_client_id=([^;]+)/)?.[1];
    const url = new URL(requestedUrl);
    expect(url.searchParams.get('i')).toBe(cookieClientId);
    expect(Number(url.searchParams.get('s'))).toBeGreaterThan(0);
  });

  it('uses the same identity for agent requests and tracking events', async () => {
    const client = new MockConstructorIOClient({
      apiKey: 'test-key',
      sendTrackingEvents: false,
    });

    await client.agent.getSuggestedQuestions({ itemId: 'item-123' });

    const url = new URL(requestedUrl);
    expect(url.searchParams.get('i')).toBe(client.options.clientId);
    expect(url.searchParams.get('s')).toBe(String(client.options.sessionId));
    expect(client.options.clientId).not.toBe('this-is-a-random-client-id');
  });

  it('appends identity params (i, s, ui, c) to getAnswerResultsStream URL', async () => {
    const originalEventSource = (globalThis as Record<string, unknown>).EventSource;
    const mockEventSource = jest.fn().mockImplementation(() => ({
      addEventListener: jest.fn(),
      close: jest.fn(),
      onerror: null,
    }));
    (globalThis as Record<string, unknown>).EventSource = mockEventSource;

    try {
      const client = new MockConstructorIOClient({
        apiKey: 'test-key',
        clientId: 'stream-client',
        sessionId: 7,
        userId: 'stream-user',
        sendTrackingEvents: false,
      });

      await client.agent.getAnswerResultsStream({
        itemId: 'item-123',
        question: 'Tell me more',
        onStart: jest.fn(),
        onMessage: jest.fn(),
        onEnd: jest.fn(),
      });

      const url = new URL(mockEventSource.mock.calls[0][0]);
      expect(url.pathname).toContain('/streaming');
      expect(url.searchParams.get('i')).toBe('stream-client');
      expect(url.searchParams.get('s')).toBe('7');
      expect(url.searchParams.get('ui')).toBe('stream-user');
      expect(url.searchParams.get('c')).toContain('cio-ui-pia-');
    } finally {
      (globalThis as Record<string, unknown>).EventSource = originalEventSource;
    }
  });
});

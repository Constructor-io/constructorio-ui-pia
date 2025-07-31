import { renderHook } from '@testing-library/react';
import useCioClient from '../../../src/hooks/useCioClient';
import version from '../../../src/version';

describe('Testing Hook: useCioClient', () => {
  it('throws error if Api Key not provided', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useCioClient())).toThrow();
    spy.mockRestore();
  });

  it('returns client when custom client is provided', () => {
    const mockClient = { tracker: () => {} };
    const { result } = renderHook(({ cioClient }) => useCioClient({ cioClient }), {
      initialProps: { cioClient: mockClient },
    });

    expect(result.current).toBe(mockClient);
  });

  it('returns a ConstructorIO Client Object', () => {
    const { result } = renderHook(({ apiKey, options }) => useCioClient({ apiKey, options }), {
      initialProps: {
        apiKey: 'xx',
        options: {
          fetch: () => {},
        },
      },
    });

    const client = result.current;
    expect(client).not.toBeUndefined();
    expect(client.options).not.toBeUndefined();
    expect(client.options.apiKey).toBe('xx');
    expect(client.options.version).toBe(`cio-ui-pia-${version}`);
    expect(client.search).not.toBeUndefined();
    expect(client.agent).not.toBeUndefined();
  });

  it('returns a client with options set', () => {
    const key = 'xx';
    const clientOptions = {
      version: 'cio-ui-pia-1.0.0',
      serviceUrl: 'https://test.service.cnstrc.com',
      quizzesServiceUrl: 'https://test.quizzes.cnstrc.com',
      agentServiceUrl: 'https://test.agent.cnstrc.com',
      sessionId: 1,
      clientId: 'id-1',
      fetch: 'mock-fetch-fn',
      sendTrackingEvents: true,
      beaconMode: true,
      networkParameters: { timeout: 1000 },
    };

    const { result } = renderHook(({ apiKey, options }) => useCioClient({ apiKey, options }), {
      initialProps: { apiKey: key, options: clientOptions },
    });

    const client = result.current;
    expect(client.options).toEqual({
      apiKey: key,
      ...clientOptions,
    });
  });
});

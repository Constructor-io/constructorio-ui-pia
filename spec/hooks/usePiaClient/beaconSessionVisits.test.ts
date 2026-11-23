/**
 * @jest-environment-options {"url": "https://www.example.com/"}
 */
import { renderHook } from '@testing-library/react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
// The id library the JS client depends on; the site beacon builds the same thing.
import ConstructorioID from '@constructor-io/constructorio-id';
import usePiaClient from '../../../src/hooks/usePiaClient';

const EXPIRED = 'expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';

// Product pages load the widget; the other pages only load the beacon.
const VISITS = ['pdp', 'home', 'pdp', 'search', 'home', 'pdp', 'pdp', 'cart', 'pdp'] as const;

// The shopper is away 31 minutes between visits, so every visit starts a new session.
const AWAY = 31 * 60 * 1000;

describe.each([
  ['with a cookie domain', '.example.com'],
  ['without a cookie domain', undefined],
])('the widget and the site beacon across visits, %s', (_label, cookieDomain) => {
  const originalFetch = globalThis.fetch;
  const beacon = () =>
    new ConstructorioID({ session_id_storage_location: 'cookie', cookie_domain: cookieDomain });

  let now: number;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
    now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
    document.cookie.split('; ').forEach((c) => {
      const name = c.split('=')[0];
      document.cookie = `${name}=; ${EXPIRED}`;
      document.cookie = `${name}=; ${EXPIRED}; domain=.example.com`;
    });
    localStorage.clear();
  });

  it('carries the same session number as the beacon on every visit', () => {
    const pairs: [number, number][] = [];

    VISITS.forEach((page, i) => {
      if (i > 0) now += AWAY;
      // Alternate which loads first: the widget can mount before or after the beacon runs.
      const widgetFirst = i % 2 === 1;
      let widgetSession: number | undefined;
      const mountWidget = () => {
        const { result } = renderHook(() => usePiaClient({ apiKey: 'key' }));
        widgetSession = result.current.cioClient.options.sessionId;
      };

      if (page === 'pdp' && widgetFirst) mountWidget();
      const beaconSession = beacon().session_id;
      if (page === 'pdp' && !widgetFirst) mountWidget();

      if (widgetSession !== undefined) pairs.push([beaconSession, widgetSession]);
    });

    expect(pairs.length).toBe(5);
    pairs.forEach(([beaconSession, widgetSession]) => expect(widgetSession).toBe(beaconSession));
    expect(pairs[pairs.length - 1][0]).toBe(VISITS.length);
  });

  it('drifted apart before this fix, with a default client', () => {
    const pairs: [number, number][] = [];

    VISITS.forEach((page, i) => {
      if (i > 0) now += AWAY;
      const beaconSession = beacon().session_id;
      if (page !== 'pdp') return;
      const client = new ConstructorIOClient({ apiKey: 'key', sendTrackingEvents: true });
      pairs.push([beaconSession, client.options.sessionId!]);
    });

    expect(pairs.some(([beaconSession, oldSession]) => beaconSession !== oldSession)).toBe(true);
  });
});

import ConstructorioClient, {
  ConstructorClientOptions,
} from '@constructor-io/constructorio-client-javascript';
import {
  Recommendations,
  Browse,
  Search,
  Tracker,
  Quizzes,
} from '@constructor-io/constructorio-client-javascript/lib/types/constructorio';
import MockAgent from './agent';
import version from '../../version';

class MockConstructorIOClient {
  public options: ConstructorClientOptions;

  public search: Search;

  public browse: Browse;

  public recommendations: Recommendations;

  public tracker: Tracker;

  public quizzes: Quizzes;

  public agent: MockAgent;

  constructor(options: ConstructorClientOptions) {
    const isServer = typeof window === 'undefined' || typeof document === 'undefined';

    this.options = {
      version: options.version || `cio-ui-pia-${version}`,
      serviceUrl: options.serviceUrl || 'https://ac.cnstrc.com',
      quizzesServiceUrl: options.quizzesServiceUrl || 'https://quizzes.cnstrc.com',
      agentServiceUrl: options.agentServiceUrl || 'https://agent.cnstrc.com',
      // In the browser the client resolves the id from browser storage; on the
      // server (SSR) it requires an explicit one, so fall back to a placeholder
      ...(isServer && {
        clientId: options.clientId || 'this-is-a-random-client-id',
      }),
      sendTrackingEvents:
        options.sendTrackingEvents !== undefined ? options.sendTrackingEvents : true,
      beaconMode: options.beaconMode !== undefined ? options.beaconMode : true,
      networkParameters: options.networkParameters || {},
      ...options,
    };

    const cioClient = new ConstructorioClient(this.options);

    const { clientId, sessionId } = cioClient.agent.options;
    this.options.clientId = clientId;
    this.options.sessionId = sessionId;

    this.search = cioClient.search;
    this.browse = cioClient.browse;
    this.recommendations = cioClient.recommendations;
    this.tracker = cioClient.tracker;
    this.quizzes = cioClient.quizzes;

    this.agent = new MockAgent(this.options);
  }
}

export default MockConstructorIOClient;

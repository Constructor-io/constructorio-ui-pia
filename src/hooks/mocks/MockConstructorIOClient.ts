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
import MockAssistant from './assistant';
import version from '../../version';

class MockConstructorIOClient {
  private options: ConstructorClientOptions;

  public search: Search;

  public browse: Browse;

  public recommendations: Recommendations;

  public tracker: Tracker;

  public quizzes: Quizzes;

  public assistant: MockAssistant;

  constructor(options: ConstructorClientOptions) {
    this.options = {
      version: options.version || `cio-ui-asa-pdp-${version}`,
      serviceUrl: options.serviceUrl || 'https://ac.cnstrc.com',
      quizzesServiceUrl: options.quizzesServiceUrl || 'https://quizzes.cnstrc.com',
      assistantServiceUrl: options.assistantServiceUrl || 'https://assistant.cnstrc.com',
      sessionId: options.sessionId || 0,
      clientId: options.clientId || 'this-is-a-random-client-id',
      sendTrackingEvents:
        options.sendTrackingEvents !== undefined ? options.sendTrackingEvents : true,
      beaconMode: options.beaconMode !== undefined ? options.beaconMode : true,
      networkParameters: options.networkParameters || {},
      ...options,
    };

    const cioClient = new ConstructorioClient(this.options);

    this.search = cioClient.search;
    this.browse = cioClient.browse;
    this.recommendations = cioClient.recommendations;
    this.tracker = cioClient.tracker;
    this.quizzes = cioClient.quizzes;

    // Use the mock assistant instead of the one from the client
    this.assistant = new MockAssistant(this.options);
  }
}

export default MockConstructorIOClient;

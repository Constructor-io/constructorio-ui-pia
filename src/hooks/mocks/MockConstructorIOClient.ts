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

class MockConstructorIOClient {
  private cioClient: ConstructorioClient;

  public options: ConstructorClientOptions;

  public search: Search;

  public browse: Browse;

  public recommendations: Recommendations;

  public tracker: Tracker;

  public quizzes: Quizzes;

  public assistant: MockAssistant;

  constructor(options: ConstructorClientOptions) {
    this.cioClient = new ConstructorioClient(options);

    this.options = {
      version: options.version || 'cio-ui-asa-pdp-0.0.0',
      serviceUrl: options.serviceUrl || 'https://ac.cnstrc.com',
      quizzesServiceUrl: options.quizzesServiceUrl || 'https://quizzes.cnstrc.com',
      assistantServiceUrl: options.assistantServiceUrl || 'https://assistant.cnstrc.com',
      sessionId: options.sessionId || 1,
      clientId: options.clientId || 'this-is-a-random-client-id',
      sendTrackingEvents:
        options.sendTrackingEvents !== undefined ? options.sendTrackingEvents : true,
      beaconMode: options.beaconMode !== undefined ? options.beaconMode : true,
      networkParameters: options.networkParameters || {},
      ...options,
    };

    this.search = this.cioClient.search;
    this.browse = this.cioClient.browse;
    this.recommendations = this.cioClient.recommendations;
    this.tracker = this.cioClient.tracker;
    this.quizzes = this.cioClient.quizzes;

    // Use the mock assistant instead of the one from the client
    this.assistant = new MockAssistant(this.cioClient.assistant.options);
  }
}

export default MockConstructorIOClient;


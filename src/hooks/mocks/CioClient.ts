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
import PiaAgent from './agent';
import version from '../../version';

class CioClient {
  public options: ConstructorClientOptions;

  public search: Search;

  public browse: Browse;

  public recommendations: Recommendations;

  public tracker: Tracker;

  public quizzes: Quizzes;

  public agent: PiaAgent;

  constructor(options: ConstructorClientOptions) {
    this.options = {
      version: options.version || `cio-ui-pia-${version}`,
      serviceUrl: options.serviceUrl || 'https://ac.cnstrc.com',
      quizzesServiceUrl: options.quizzesServiceUrl || 'https://quizzes.cnstrc.com',
      agentServiceUrl: options.agentServiceUrl || 'https://agent.cnstrc.com',
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

    this.agent = new PiaAgent({
      ...this.options,
      clientId: options.clientId,
      sessionId: options.sessionId,
    });
  }
}

export default CioClient;

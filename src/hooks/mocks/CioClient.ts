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

/**
 * Lightweight wrapper around constructorio-client-javascript used for Storybook demos and testing.
 *
 * The upstream ConstructorioClient requires `clientId` (string) and `sessionId` (number) in
 * non-DOM (Node/SSR) environments — it throws without them. The placeholder defaults below
 * satisfy that requirement so search/browse/tracker modules initialize without error.
 *
 * PiaAgent receives the *raw* user-supplied values (which may be undefined) so that identity
 * params (`i`, `s`) are only sent to the PIA API when explicitly provided by the consumer.
 */
class CioClient {
  public options: ConstructorClientOptions;

  public search: Search;

  public browse: Browse;

  public recommendations: Recommendations;

  public tracker: Tracker;

  public quizzes: Quizzes;

  public agent: PiaAgent;

  constructor(options: ConstructorClientOptions) {
    // Defaults satisfy upstream ConstructorioClient validation in non-DOM environments.
    // These placeholder values are used only by search/browse/tracker modules — they do NOT
    // propagate to PIA API requests (see PiaAgent instantiation below).
    this.options = {
      version: options.version || `cio-ui-pia-${version}`,
      serviceUrl: options.serviceUrl || 'https://ac.cnstrc.com',
      quizzesServiceUrl: options.quizzesServiceUrl || 'https://quizzes.cnstrc.com',
      agentServiceUrl: options.agentServiceUrl || 'https://agent.cnstrc.com',
      sessionId: options.sessionId || 0,
      clientId: options.clientId || 'cio-ui-pia-default-client',
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

    // Pass raw user-supplied identity values so PiaAgent only appends i/s/ui/us/c params
    // when the consumer explicitly provided them — not the placeholder defaults above.
    this.agent = new PiaAgent({
      ...this.options,
      clientId: options.clientId,
      sessionId: options.sessionId,
    });
  }
}

export default CioClient;

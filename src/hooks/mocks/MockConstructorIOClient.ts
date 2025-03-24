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

  public search: Search;

  public browse: Browse;

  public recommendations: Recommendations;

  public tracker: Tracker;

  public quizzes: Quizzes;

  public assistant: MockAssistant;

  constructor(options: ConstructorClientOptions) {
    this.cioClient = new ConstructorioClient(options);

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


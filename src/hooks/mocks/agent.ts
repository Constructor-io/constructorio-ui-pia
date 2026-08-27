import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript';
import {
  AgentUrlProps,
  QuestionResponse,
  StreamEndEvent,
  StreamMessageEvent,
  StreamStartEvent,
  SuggestedQuestionsParameters,
  GetSuggestedQuestionsProps,
  GetAnswerResultsStreamProps,
  GetAnswerResultsProps,
  GetAnswerResultsResponse,
} from './types';
import { GetRecsProps, RecsResult } from '../../types';
import { AgentRequestError } from '../../errors';
import {
  EMPTY_RECS_RESULT,
  adaptAnswerToRecsResult,
  buildRecsQuestion,
} from './recsFromItemQuestions';

// Create URL for PIA API
function createAgentUrl({
  itemId,
  threadId,
  variationId,
  question,
  isStreaming = false,
  options,
  parameters = {},
}: AgentUrlProps): string {
  const { apiKey, agentServiceUrl, clientId, sessionId, userId, segments, version } = options;
  if (!agentServiceUrl) throw new Error('Agent service URL is required');

  let baseUrl = `${agentServiceUrl}/v1/item_questions`;
  if (question) {
    baseUrl += `/${encodeURIComponent(question)}/answer`;
  }
  if (isStreaming) {
    baseUrl += '/streaming';
  }

  const url = new URL(baseUrl);
  url.searchParams.append('item_id', itemId);
  url.searchParams.append('key', apiKey);

  if (threadId) {
    url.searchParams.append('thread_id', threadId);
  }
  if (variationId) {
    url.searchParams.append('variation_id', variationId);
  }
  if (clientId) {
    url.searchParams.append('i', clientId);
  }
  if (sessionId != null) {
    url.searchParams.append('s', String(sessionId));
  }
  if (userId) {
    url.searchParams.append('ui', userId);
  }
  if (version) {
    url.searchParams.append('c', version);
  }
  if (segments?.length) {
    segments.forEach((segment) => url.searchParams.append('us', segment));
  }

  // Any additional parameters
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

// Map camelCase SuggestedQuestionsParameters to snake_case query params expected by the API
function mapSuggestedQuestionsParams(
  params: SuggestedQuestionsParameters,
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  if (params.numResults !== undefined) result.num_results = params.numResults;
  return result;
}

class MockAgent {
  options: ConstructorClientOptions;

  constructor(options: ConstructorClientOptions) {
    this.options = options;
  }

  async getSuggestedQuestions({
    itemId,
    variationId,
    threadId,
    parameters = {},
    requestParameters = {},
  }: GetSuggestedQuestionsProps): Promise<QuestionResponse> {
    if (!itemId) throw new Error('Item ID is required');
    if (!this.options.apiKey) throw new Error('API key is required');

    const url = createAgentUrl({
      itemId,
      variationId,
      threadId,
      options: this.options,
      parameters: { ...requestParameters, ...mapSuggestedQuestionsParams(parameters) },
    });

    try {
      const response = await fetch(url);

      if (!response.ok) throw new AgentRequestError(response.status);

      const data = await response.json();

      return data;
    } catch (error) {
      // Rethrow untouched so the status code and the original stack survive.
      if (error instanceof Error) throw error;

      throw new Error(String(error));
    }
  }

  async getAnswerResults({
    itemId,
    variationId,
    threadId,
    question,
    parameters = {},
  }: GetAnswerResultsProps): Promise<GetAnswerResultsResponse> {
    if (!itemId) throw new Error('Item ID is required');
    if (!question) throw new Error('Question is required');
    if (!this.options.apiKey) throw new Error('API key is required');

    const url = createAgentUrl({
      itemId,
      threadId,
      variationId,
      question,
      options: this.options,
      parameters,
    });

    try {
      const response = await fetch(url);

      if (!response.ok) throw new AgentRequestError(response.status);

      const data = await response.json();

      return data;
    } catch (error) {
      // Rethrow untouched so the status code and the original stack survive.
      if (error instanceof Error) throw error;

      throw new Error(String(error));
    }
  }

  /**
   * Fetches one set of recommendations, in the shape the pod renders.
   *
   * Asks the Q&A endpoint, phrased as a request for recommendations - see
   * `recsFromItemQuestions.ts` for why the wording matters and what the response gives up. This is
   * an interim backing: `/v1/agent_insights` with `mode: 'recommendations'` is the endpoint the pod
   * is designed for, and swapping to it means replacing the body of this method.
   *
   * `threadId` is passed straight through, and refinement depends on it. The endpoint narrows the
   * products from the previous turn rather than searching the catalog again, so a refinement sent
   * outside the thread that produced those products has nothing to narrow.
   */
  async getRecs({
    itemId,
    variationId,
    threadId,
    strategy = 'complementary_items',
    shopperInput,
    formatImageUrl,
  }: GetRecsProps): Promise<RecsResult> {
    const question = buildRecsQuestion(strategy, shopperInput);

    // Only some strategies have a question that asks for them. Rather than send a question that
    // would answer the wrong thing, settle empty and say why - the pod then renders nothing, and
    // whatever the retailer already had in that slot shows through.
    if (!question) {
      console.warn(
        `Constructor PIA: the '${strategy}' recommendations strategy is not available yet. ` +
          "Use 'complementary_items' or 'alternative_items', or supply a cioClient with your own " +
          'agent.getRecs.',
      );

      return EMPTY_RECS_RESULT;
    }

    const response = await this.getAnswerResults({ itemId, variationId, threadId, question });

    return adaptAnswerToRecsResult(response, formatImageUrl);
  }

  async getAnswerResultsStream({
    itemId,
    threadId,
    variationId,
    question,
    parameters,
    onStart,
    onMessage,
    onEnd,
  }: GetAnswerResultsStreamProps): Promise<void> {
    if (!itemId) throw new Error('Item ID is required');
    if (!question) throw new Error('Question is required');
    if (!this.options.apiKey) throw new Error('API key is required');

    const url = createAgentUrl({
      itemId,
      threadId,
      variationId,
      question,
      isStreaming: true,
      options: this.options,
      parameters,
    });

    try {
      const eventSource = new EventSource(url);

      eventSource.addEventListener('open', (event: MessageEvent) => {
        const data = JSON.parse(event.data) as StreamStartEvent;
        if (onStart) onStart(data);
      });

      eventSource.addEventListener('message', (event: MessageEvent) => {
        const data = JSON.parse(event.data) as StreamMessageEvent;
        if (onMessage) onMessage(data);
      });

      eventSource.addEventListener('end', (event: MessageEvent) => {
        const data = JSON.parse(event.data) as StreamEndEvent;
        if (onEnd) onEnd(data);
        eventSource.close();
      });

      eventSource.onerror = () => {
        eventSource.close();
        throw new Error('Unexpected error occurred. Please try again.');
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  }
}

export default MockAgent;

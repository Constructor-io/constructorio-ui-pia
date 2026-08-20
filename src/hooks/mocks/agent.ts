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

/** Kept to one warning per page load, so a re-rendering pod cannot flood the console. */
let warnedNoRecsEndpoint = false;

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
   * Recommendations are not available yet: there is no endpoint to ask, so nothing is requested and
   * an empty result is returned. The pod renders nothing in that state, which leaves whatever the
   * retailer already had in that slot showing through. Supply a `cioClient` with your own
   * `agent.getRecs` to drive the pod from your own data in the meantime.
   *
   * `props` is still declared, because it is the contract a caller's own `getRecs` implements and
   * `useRecsPod` passes it - there is simply nothing here to send it to yet.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getRecs(props: GetRecsProps): Promise<RecsResult> {
    if (!warnedNoRecsEndpoint) {
      warnedNoRecsEndpoint = true;
      console.warn(
        "[cio-pia] mode: 'recommendations' is not available yet. Please use other modes instead.",
      );
    }

    return { title: '', items: null, refinement: null, status: 'complete' };
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

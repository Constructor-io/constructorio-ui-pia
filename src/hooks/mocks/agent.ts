import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript';
import {
  AnswerResponse,
  AgentUrlProps,
  QuestionResponse,
  StreamEndEvent,
  StreamMessageEvent,
  StreamStartEvent,
  GetAnswerResultsStreamProps,
  GetAnswerResultsProps,
} from './types';

// Create URL for PIA API
function createAgentUrl({
  itemId,
  question,
  isStreaming = false,
  options,
  parameters = {},
}: AgentUrlProps): string {
  const { apiKey, agentServiceUrl } = options;
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

  // Any additional parameters
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

class MockAgent {
  options: ConstructorClientOptions;

  constructor(options: ConstructorClientOptions) {
    this.options = options;
  }

  async getSuggestedQuestions(
    itemId: string,
    parameters: Record<string, any> = {},
  ): Promise<QuestionResponse> {
    if (!itemId) throw new Error('Item ID is required');
    if (!this.options.apiKey) throw new Error('API key is required');

    const url = createAgentUrl({
      itemId,
      options: this.options,
      parameters,
    });

    try {
      const response = await fetch(url);
      const data = await response.json();

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  }

  async getAnswerResults({
    itemId,
    question,
    parameters = {},
  }: GetAnswerResultsProps): Promise<AnswerResponse> {
    if (!itemId) throw new Error('Item ID is required');
    if (!question) throw new Error('Question is required');
    if (!this.options.apiKey) throw new Error('API key is required');

    const url = createAgentUrl({
      itemId,
      question,
      options: this.options,
      parameters,
    });

    try {
      const response = await fetch(url);
      const data = await response.json();

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  }

  async getAnswerResultsStream({
    itemId,
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

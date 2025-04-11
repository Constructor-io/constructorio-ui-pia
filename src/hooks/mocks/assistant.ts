import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript';
import { AssistantUrlProps, QuestionResponse } from './types';

// Create URL for ASA API
function createAssistantUrl({
  itemId,
  question,
  isStreaming = false,
  options,
  parameters = {},
}: AssistantUrlProps): string {
  if (!options.assistantServiceUrl) throw new Error('Assistant service URL is required');

  const { apiKey, assistantServiceUrl } = options;
  const baseUrl = `${assistantServiceUrl}/v1/item_questions${
    question ? `/${encodeURIComponent(question)}/answer` : ''
  }${isStreaming ? '/streaming' : ''}`;

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

class MockAssistant {
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

    const url = createAssistantUrl({
      itemId,
      options: this.options,
      parameters,
    });

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Get Suggested Questions failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Get Suggested Questions failed: ${errorMessage}`);
    }
  }
}

export default MockAssistant;

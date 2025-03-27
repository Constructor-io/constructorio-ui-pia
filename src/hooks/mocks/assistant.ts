import { ConstructorClientOptions, SearchResponse } from '@constructor-io/constructorio-client-javascript';

// Create URL from supplied intent (term) and parameters
function createAssistantUrl(
  itemId: string,
  endpoint: string,
  options: ConstructorClientOptions,
  parameters: Record<string, string> = {},
) {
  const { apiKey, assistantServiceUrl } = options;
  const baseUrl = `${assistantServiceUrl}/v1/${endpoint}`;

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

  async getSuggestedQuestions(itemId: string, parameters: Record<string, any> = {}): Promise<SearchResponse> {
    if (!this.options.apiKey) {
      throw new Error('API key is required');
    }

    const url = createAssistantUrl(itemId, 'item_questions', this.options, parameters);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      return {
        request: { itemId, parameters },
        response: data,
        result_id: 'mock-result-id',
      };
    } catch (error) {
      // Fallback
      return {
        request: { itemId, parameters },
        response: { questions: [] },
        result_id: 'mock-result-id',
      };
    }
  }
}

export default MockAssistant;

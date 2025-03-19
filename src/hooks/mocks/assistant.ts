import { MockConstructorClientOptions } from './types';

// Create URL from supplied intent (term) and parameters
function createAssistantUrl(
  itemId: string,
  endpoint: string,
  options: MockConstructorClientOptions,
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

class Assistant {
  options: MockConstructorClientOptions;

  constructor(options: MockConstructorClientOptions) {
    this.options = options;
  }

  async getSuggestedQuestions(itemId: string, parameters: Record<string, any> = {}) {
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
      };
    } catch (error) {
      // Fallback
      return {
        request: { itemId, parameters },
        response: { questions: [] },
      };
    }
  }
}

export default Assistant;

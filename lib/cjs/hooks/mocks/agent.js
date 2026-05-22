"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Create URL for PIA API
function createAgentUrl({ itemId, threadId, variationId, question, isStreaming = false, options, parameters = {}, }) {
    const { apiKey, agentServiceUrl } = options;
    if (!agentServiceUrl)
        throw new Error('Agent service URL is required');
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
    // Any additional parameters
    Object.entries(parameters).forEach(([key, value]) => {
        if (value !== undefined) {
            url.searchParams.append(key, String(value));
        }
    });
    return url.toString();
}
// Map camelCase SuggestedQuestionsParameters to snake_case query params expected by the API
function mapSuggestedQuestionsParams(params) {
    const result = {};
    if (params.numResults !== undefined)
        result.num_results = params.numResults;
    return result;
}
class MockAgent {
    constructor(options) {
        this.options = options;
    }
    getSuggestedQuestions({ itemId, variationId, threadId, parameters = {}, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!itemId)
                throw new Error('Item ID is required');
            if (!this.options.apiKey)
                throw new Error('API key is required');
            const url = createAgentUrl({
                itemId,
                variationId,
                threadId,
                options: this.options,
                parameters: mapSuggestedQuestionsParams(parameters),
            });
            try {
                const response = yield fetch(url);
                if (!response.ok)
                    throw new Error(`Request failed with status ${response.status}`);
                const data = yield response.json();
                return data;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                throw new Error(errorMessage);
            }
        });
    }
    getAnswerResults({ itemId, variationId, threadId, question, parameters = {}, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!itemId)
                throw new Error('Item ID is required');
            if (!question)
                throw new Error('Question is required');
            if (!this.options.apiKey)
                throw new Error('API key is required');
            const url = createAgentUrl({
                itemId,
                threadId,
                variationId,
                question,
                options: this.options,
                parameters,
            });
            try {
                const response = yield fetch(url);
                if (!response.ok)
                    throw new Error(`Request failed with status ${response.status}`);
                const data = yield response.json();
                return data;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                throw new Error(errorMessage);
            }
        });
    }
    getAnswerResultsStream({ itemId, threadId, variationId, question, parameters, onStart, onMessage, onEnd, }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!itemId)
                throw new Error('Item ID is required');
            if (!question)
                throw new Error('Question is required');
            if (!this.options.apiKey)
                throw new Error('API key is required');
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
                eventSource.addEventListener('open', (event) => {
                    const data = JSON.parse(event.data);
                    if (onStart)
                        onStart(data);
                });
                eventSource.addEventListener('message', (event) => {
                    const data = JSON.parse(event.data);
                    if (onMessage)
                        onMessage(data);
                });
                eventSource.addEventListener('end', (event) => {
                    const data = JSON.parse(event.data);
                    if (onEnd)
                        onEnd(data);
                    eventSource.close();
                });
                eventSource.onerror = () => {
                    eventSource.close();
                    throw new Error('Unexpected error occurred. Please try again.');
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                throw new Error(errorMessage);
            }
        });
    }
}
exports.default = MockAgent;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const useAnswerResults_1 = tslib_1.__importDefault(require("./useAnswerResults"));
const useCioClient_1 = tslib_1.__importDefault(require("./useCioClient"));
const useSuggestedQuestions_1 = tslib_1.__importDefault(require("./useSuggestedQuestions"));
function useCioPia(props) {
    const { apiKey, itemId, variationId, threadId: providedThreadId, cioClient: providedClient, suggestedQuestionsParameters, formatImageUrl, } = props;
    const [generatedThreadId] = (0, react_1.useState)(() => crypto.randomUUID());
    const threadId = providedThreadId || generatedThreadId;
    const defaultClient = (0, useCioClient_1.default)({ apiKey });
    const client = providedClient || defaultClient;
    const suggestedQuestions = (0, useSuggestedQuestions_1.default)({
        itemId,
        variationId,
        threadId,
        cioClient: client,
        parameters: suggestedQuestionsParameters,
    });
    const answers = (0, useAnswerResults_1.default)({
        itemId,
        variationId,
        threadId,
        cioClient: client,
        formatImageUrl,
    });
    return {
        threadId,
        suggestedQuestions,
        answers,
    };
}
exports.default = useCioPia;

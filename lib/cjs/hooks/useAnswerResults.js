"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const transformers_1 = require("../utils/transformers");
const extractAndTransformItems = (data, formatImageUrl) => {
    var _a, _b;
    if (!((_b = (_a = data === null || data === void 0 ? void 0 : data.item_results) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.results)) {
        return null;
    }
    const { results } = data.item_results.response;
    if (!Array.isArray(results) || results.length === 0) {
        return null;
    }
    const transformedItems = results
        .map((item) => (0, transformers_1.transformResultItem)(item, formatImageUrl))
        .filter((item) => item !== null);
    return transformedItems.length > 0 ? transformedItems : null;
};
const fetchAnswerResults = ({ client, itemId, question, variationId, threadId, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const response = yield client.agent.getAnswerResults({
        itemId,
        variationId,
        threadId,
        question,
    });
    return response;
});
function useAnswerResults({ itemId, variationId, threadId, cioClient, formatImageUrl, }) {
    const [answerResults, setAnswerResults] = (0, react_1.useState)(null);
    const [items, setItems] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchResult = (0, react_1.useCallback)((question) => {
        if (!cioClient)
            return;
        setIsLoading(true);
        setError(null);
        fetchAnswerResults({ client: cioClient, itemId, question, variationId, threadId })
            .then((fetchedAnswerResults) => {
            setAnswerResults(fetchedAnswerResults);
            setItems(extractAndTransformItems(fetchedAnswerResults, formatImageUrl));
            setError(null);
        })
            .catch((err) => {
            setError(err instanceof Error ? err : new Error('Error fetching answer'));
            setAnswerResults(null);
            setItems(null);
        })
            .finally(() => {
            setIsLoading(false);
        });
    }, [cioClient, itemId, variationId, threadId, formatImageUrl]);
    return {
        data: answerResults,
        items,
        isLoading,
        error,
        getAnswer: fetchResult,
    };
}
exports.default = useAnswerResults;

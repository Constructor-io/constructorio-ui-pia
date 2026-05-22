"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const fetchSuggestedQuestions = ({ client, itemId, variationId, threadId, parameters, }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const response = yield client.agent.getSuggestedQuestions({
        itemId,
        variationId,
        threadId,
        parameters,
    });
    return response.questions;
});
function useSuggestedQuestions({ itemId, variationId, threadId, cioClient, parameters, }) {
    const [questions, setQuestions] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchResult = (0, react_1.useCallback)(() => {
        if (!cioClient)
            return;
        setIsLoading(true);
        setError(null);
        fetchSuggestedQuestions({
            client: cioClient,
            itemId,
            variationId,
            threadId,
            parameters,
        })
            .then((fetchedQuestions) => {
            setQuestions(fetchedQuestions);
            setError(null);
        })
            .catch((err) => {
            setError(err instanceof Error ? err : new Error('Error fetching questions'));
        })
            .finally(() => {
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- primitive dep prevents refetch on object reference change
    }, [cioClient, itemId, variationId, threadId, parameters === null || parameters === void 0 ? void 0 : parameters.numResults]);
    (0, react_1.useEffect)(() => {
        fetchResult();
    }, [fetchResult]);
    return {
        data: questions,
        isLoading,
        error,
        getSuggestedQuestions: fetchResult,
    };
}
exports.default = useSuggestedQuestions;

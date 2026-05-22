import { useCallback, useEffect, useState } from 'react';
const fetchSuggestedQuestions = async ({ client, itemId, variationId, threadId, parameters, }) => {
    const response = await client.agent.getSuggestedQuestions({
        itemId,
        variationId,
        threadId,
        parameters,
    });
    return response.questions;
};
export default function useSuggestedQuestions({ itemId, variationId, threadId, cioClient, parameters, }) {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchResult = useCallback(() => {
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
    }, [cioClient, itemId, variationId, threadId, parameters?.numResults]);
    useEffect(() => {
        fetchResult();
    }, [fetchResult]);
    return {
        data: questions,
        isLoading,
        error,
        getSuggestedQuestions: fetchResult,
    };
}

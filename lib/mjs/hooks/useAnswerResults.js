import { useCallback, useState } from 'react';
import { transformResultItem } from '../utils/transformers';
const extractAndTransformItems = (data, formatImageUrl) => {
    if (!data?.item_results?.response?.results) {
        return null;
    }
    const { results } = data.item_results.response;
    if (!Array.isArray(results) || results.length === 0) {
        return null;
    }
    const transformedItems = results
        .map((item) => transformResultItem(item, formatImageUrl))
        .filter((item) => item !== null);
    return transformedItems.length > 0 ? transformedItems : null;
};
const fetchAnswerResults = async ({ client, itemId, question, variationId, threadId, }) => {
    const response = await client.agent.getAnswerResults({
        itemId,
        variationId,
        threadId,
        question,
    });
    return response;
};
export default function useAnswerResults({ itemId, variationId, threadId, cioClient, formatImageUrl, }) {
    const [answerResults, setAnswerResults] = useState(null);
    const [items, setItems] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchResult = useCallback((question) => {
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

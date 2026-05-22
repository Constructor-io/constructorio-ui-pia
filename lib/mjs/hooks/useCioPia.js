import { useState } from 'react';
import useAnswerResults from './useAnswerResults';
import useCioClient from './useCioClient';
import useSuggestedQuestions from './useSuggestedQuestions';
export default function useCioPia(props) {
    const { apiKey, itemId, variationId, threadId: providedThreadId, cioClient: providedClient, suggestedQuestionsParameters, formatImageUrl, } = props;
    const [generatedThreadId] = useState(() => crypto.randomUUID());
    const threadId = providedThreadId || generatedThreadId;
    const defaultClient = useCioClient({ apiKey });
    const client = providedClient || defaultClient;
    const suggestedQuestions = useSuggestedQuestions({
        itemId,
        variationId,
        threadId,
        cioClient: client,
        parameters: suggestedQuestionsParameters,
    });
    const answers = useAnswerResults({
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

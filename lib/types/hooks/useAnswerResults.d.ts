import { Nullable } from '@constructor-io/constructorio-client-javascript';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import { Formatters, Item, GetAnswerResultsResponse } from '../types';
export interface UseAnswerResultsProps {
    itemId: string;
    variationId?: string;
    threadId?: string;
    cioClient: MockConstructorIOClient;
    parameters?: Record<string, any>;
    formatImageUrl?: Formatters['formatImageUrl'];
}
export interface UseAnswerResultsReturn {
    data: Nullable<GetAnswerResultsResponse>;
    items: Array<Item> | null;
    isLoading: boolean;
    error: Error | null;
    getAnswer: (question: string) => void;
}
export default function useAnswerResults({ itemId, variationId, threadId, cioClient, formatImageUrl, }: UseAnswerResultsProps): UseAnswerResultsReturn;

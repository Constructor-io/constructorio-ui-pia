import { Question, SuggestedQuestionsParameters } from '../types';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
export interface UseSuggestedQuestionsProps {
    itemId: string;
    variationId?: string;
    threadId?: string;
    cioClient?: MockConstructorIOClient;
    parameters?: SuggestedQuestionsParameters;
}
export interface UseSuggestedQuestionsReturn {
    data: Array<Question>;
    isLoading: boolean;
    error: Error | null;
    getSuggestedQuestions: () => void;
}
export default function useSuggestedQuestions({ itemId, variationId, threadId, cioClient, parameters, }: UseSuggestedQuestionsProps): UseSuggestedQuestionsReturn;

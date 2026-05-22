import { Formatters, SuggestedQuestionsParameters } from '../types';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import { UseAnswerResultsReturn } from './useAnswerResults';
import { UseSuggestedQuestionsReturn } from './useSuggestedQuestions';
export interface UseCioPiaProps {
    apiKey: string;
    itemId: string;
    variationId?: string;
    threadId?: string;
    cioClient?: MockConstructorIOClient;
    suggestedQuestionsParameters?: SuggestedQuestionsParameters;
    /** Define outside the component or wrap with useCallback to avoid unnecessary re-renders. */
    formatImageUrl?: Formatters['formatImageUrl'];
}
export interface UseCioPiaReturn {
    threadId: string;
    suggestedQuestions: UseSuggestedQuestionsReturn;
    answers: UseAnswerResultsReturn;
}
export default function useCioPia(props: UseCioPiaProps): UseCioPiaReturn;

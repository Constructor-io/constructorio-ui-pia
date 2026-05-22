import { Callbacks, ConversationEntry, PiaCallbackContext, Question, Item } from '../types';
import { UseCioPiaReturn } from './useCioPia';
export interface UseConversationProps {
    pia: UseCioPiaReturn;
    itemId: string;
    isConversation: boolean;
    callbacks?: Callbacks;
}
export interface UseConversationReturn {
    currentQuestion: string;
    displayedQuestions: Question[];
    conversationHistory: ConversationEntry[];
    currentAnswer: string;
    currentItems: Item[] | null;
    isLoading: boolean;
    error: Error | null;
    context: PiaCallbackContext;
    handleSubmitQuestion: (question: string) => void;
    handleQuestionClick: (question: string) => void;
    handleInputFocus: () => void;
    resetState: () => void;
}
export default function useConversation({ pia, itemId, isConversation, callbacks, }: UseConversationProps): UseConversationReturn;

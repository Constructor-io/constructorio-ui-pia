import React from 'react';
import { Question } from '../../types';
import { ConversationHistoryProps } from '../ConversationHistory/ConversationHistory';
export interface PiaConversationProps extends ConversationHistoryProps {
    displayedQuestions: Question[];
    handleSubmitQuestion: (question: string) => void;
    handleQuestionClick: (question: string) => void;
    containerRef?: (node: HTMLDivElement | null) => void;
    onInputFocus?: () => void;
}
export default function PiaConversation({ conversationHistory, isLoading, error, currentItems, showFeedback, showPreviousItems, learnMoreUrl, disclaimerPosition, translations, callbacks, componentOverrides, displayedQuestions, handleSubmitQuestion, handleQuestionClick, containerRef, onInputFocus, }: PiaConversationProps): React.JSX.Element;

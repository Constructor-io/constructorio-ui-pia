import React from 'react';
import { ComponentOverrideProps } from '@constructor-io/constructorio-ui-components';
import { Question, SuggestedQuestionsRenderProps } from '../../types';
interface SuggestedQuestionsContainerProps {
    questions: Question[];
    onQuestionClick: (question: string) => void;
    componentOverride?: ComponentOverrideProps<SuggestedQuestionsRenderProps>;
}
export default function SuggestedQuestionsContainer({ questions, onQuestionClick, componentOverride, }: SuggestedQuestionsContainerProps): React.JSX.Element | null;
export {};

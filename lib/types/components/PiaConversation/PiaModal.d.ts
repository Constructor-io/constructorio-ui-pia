import React, { PropsWithChildren } from 'react';
import { Translations, Question, CioPiaComponentOverrides } from '../../types';
interface PiaModalProps {
    initialQuestions: Question[];
    handleSubmitQuestion: (question: string) => void;
    handleQuestionClick: (question: string) => void;
    containerRef?: (node: HTMLDivElement | null) => void;
    isLoading: boolean;
    componentOverrides?: CioPiaComponentOverrides;
    translations?: Translations;
    onInputFocus?: () => void;
    onClose?: () => void;
}
export default function PiaModal({ initialQuestions, handleSubmitQuestion, handleQuestionClick, containerRef, isLoading, componentOverrides, translations, onInputFocus, onClose, children, }: PropsWithChildren<PiaModalProps>): React.JSX.Element;
export {};

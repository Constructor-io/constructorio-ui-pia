import React from 'react';
interface SuggestedQuestionProps {
    question: string;
    onClick?: () => void;
}
declare function SuggestedQuestion({ question, onClick }: SuggestedQuestionProps): React.JSX.Element;
export default SuggestedQuestion;

import React from 'react';
import { RenderPropsWrapper, } from '@constructor-io/constructorio-ui-components';
import SuggestedQuestion from '../SuggestedQuestion/SuggestedQuestion';
export default function SuggestedQuestionsContainer({ questions, onQuestionClick, componentOverride, }) {
    if (!questions || questions.length === 0) {
        return null;
    }
    return (React.createElement(RenderPropsWrapper, { props: { questions, onQuestionClick }, override: componentOverride?.reactNode },
        React.createElement("div", { className: 'cio-pia-suggested-questions-container', "data-testid": 'suggested-questions-list' }, questions.map((question) => (React.createElement(SuggestedQuestion, { key: question.value, question: question.value, onClick: () => onQuestionClick(question.value) }))))));
}

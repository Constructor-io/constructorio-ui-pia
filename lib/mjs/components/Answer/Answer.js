import React from 'react';
import { RenderPropsWrapper, } from '@constructor-io/constructorio-ui-components';
import { renderMarkdown } from '../../utils/contentTransformers';
function Answer({ text, componentOverride }) {
    if (!text) {
        return null;
    }
    return (React.createElement(RenderPropsWrapper, { props: { text }, override: componentOverride?.reactNode },
        React.createElement("div", { className: 'cio-pia-answer', "data-testid": 'answer-text', dangerouslySetInnerHTML: { __html: renderMarkdown(text) } })));
}
export default Answer;

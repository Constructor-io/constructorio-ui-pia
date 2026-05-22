"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const constructorio_ui_components_1 = require("@constructor-io/constructorio-ui-components");
const SuggestedQuestion_1 = tslib_1.__importDefault(require("../SuggestedQuestion/SuggestedQuestion"));
function SuggestedQuestionsContainer({ questions, onQuestionClick, componentOverride, }) {
    if (!questions || questions.length === 0) {
        return null;
    }
    return (react_1.default.createElement(constructorio_ui_components_1.RenderPropsWrapper, { props: { questions, onQuestionClick }, override: componentOverride === null || componentOverride === void 0 ? void 0 : componentOverride.reactNode },
        react_1.default.createElement("div", { className: 'cio-pia-suggested-questions-container', "data-testid": 'suggested-questions-list' }, questions.map((question) => (react_1.default.createElement(SuggestedQuestion_1.default, { key: question.value, question: question.value, onClick: () => onQuestionClick(question.value) }))))));
}
exports.default = SuggestedQuestionsContainer;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const constructorio_ui_components_1 = require("@constructor-io/constructorio-ui-components");
const contentTransformers_1 = require("../../utils/contentTransformers");
function Answer({ text, componentOverride }) {
    if (!text) {
        return null;
    }
    return (react_1.default.createElement(constructorio_ui_components_1.RenderPropsWrapper, { props: { text }, override: componentOverride === null || componentOverride === void 0 ? void 0 : componentOverride.reactNode },
        react_1.default.createElement("div", { className: 'cio-pia-answer', "data-testid": 'answer-text', dangerouslySetInnerHTML: { __html: (0, contentTransformers_1.renderMarkdown)(text) } })));
}
exports.default = Answer;

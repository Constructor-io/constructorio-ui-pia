"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
function SuggestedQuestionsSkeleton() {
    return (react_1.default.createElement("div", { className: 'cio-pia-suggested-questions-container', "data-testid": 'suggested-questions-skeleton', "aria-busy": 'true', "aria-label": 'Loading suggestions' },
        react_1.default.createElement("div", { className: 'cio-pia-suggested-question-skeleton' }),
        react_1.default.createElement("div", { className: 'cio-pia-suggested-question-skeleton' }),
        react_1.default.createElement("div", { className: 'cio-pia-suggested-question-skeleton' })));
}
exports.default = SuggestedQuestionsSkeleton;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const Answer_1 = tslib_1.__importDefault(require("../Answer/Answer"));
const Feedback_1 = tslib_1.__importDefault(require("../Feedback/Feedback"));
const Disclaimer_1 = tslib_1.__importDefault(require("../CioPia/Disclaimer"));
const PiaCustomCarousel_1 = tslib_1.__importDefault(require("../CioPia/PiaCustomCarousel"));
function PiaInlineAnswer({ currentAnswer, currentItems, showFeedback, learnMoreUrl, disclaimerPosition = 'bottom', translations, callbacks, componentOverrides, }) {
    const disclaimer = (react_1.default.createElement(Disclaimer_1.default, { learnMoreUrl: learnMoreUrl, translations: translations, componentOverride: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.disclaimer }));
    return (react_1.default.createElement("div", { className: 'cio-pia-answer-container' },
        disclaimerPosition === 'top' && disclaimer,
        react_1.default.createElement(Answer_1.default, { text: currentAnswer, componentOverride: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.answer }),
        currentItems && (react_1.default.createElement(PiaCustomCarousel_1.default, { items: currentItems, componentOverrides: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.carousel, callbacks: callbacks })),
        showFeedback && (react_1.default.createElement(Feedback_1.default, { translations: translations, onFeedback: callbacks === null || callbacks === void 0 ? void 0 : callbacks.onFeedback, componentOverride: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.feedback })),
        disclaimerPosition === 'bottom' && disclaimer));
}
exports.default = PiaInlineAnswer;

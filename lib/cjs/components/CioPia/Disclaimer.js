"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const constructorio_ui_components_1 = require("@constructor-io/constructorio-ui-components");
const translate_1 = require("../../utils/translate");
const constants_1 = require("../../constants");
function Disclaimer({ learnMoreUrl, translations, componentOverride, }) {
    return (react_1.default.createElement(constructorio_ui_components_1.RenderPropsWrapper, { props: { learnMoreUrl, translations }, override: componentOverride === null || componentOverride === void 0 ? void 0 : componentOverride.reactNode },
        react_1.default.createElement("span", { className: 'cio-pia-disclaimer' },
            (0, translate_1.translate)(constants_1.DISCLAIMER_TEXT, translations),
            ' ',
            learnMoreUrl && (react_1.default.createElement("a", { href: learnMoreUrl, target: '_blank', rel: 'noopener noreferrer', className: 'cio-pia-learn-more' },
                react_1.default.createElement("u", null, (0, translate_1.translate)('Learn More.', translations)))))));
}
exports.default = Disclaimer;

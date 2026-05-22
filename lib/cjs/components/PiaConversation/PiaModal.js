"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const Input_1 = tslib_1.__importDefault(require("../Input/Input"));
const translate_1 = require("../../utils/translate");
const SuggestedQuestionsContainer_1 = tslib_1.__importDefault(require("../SuggestedQuestionsContainer/SuggestedQuestionsContainer"));
const OVERFLOW_HIDDEN_CLASS = 'cio-pia-modal-open';
function CloseIcon() {
    return (react_1.default.createElement("svg", { width: '20', height: '20', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
        react_1.default.createElement("path", { d: 'M15.8334 5.34166L14.6584 4.16666L10.0001 8.82499L5.34175 4.16666L4.16675 5.34166L8.82508 9.99999L4.16675 14.6583L5.34175 15.8333L10.0001 11.175L14.6584 15.8333L15.8334 14.6583L11.1751 9.99999L15.8334 5.34166Z', fill: 'currentColor' })));
}
function PiaModal({ initialQuestions, handleSubmitQuestion, handleQuestionClick, containerRef, isLoading, componentOverrides, translations, onInputFocus, onClose, children, }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const dialogRef = (0, react_1.useRef)(null);
    const openModal = (0, react_1.useCallback)(() => {
        setIsOpen(true);
    }, []);
    const closeModal = (0, react_1.useCallback)(() => {
        setIsOpen(false);
        onClose === null || onClose === void 0 ? void 0 : onClose();
    }, [onClose]);
    (0, react_1.useEffect)(() => {
        const dialog = dialogRef.current;
        if (!dialog)
            return undefined;
        if (isOpen) {
            dialog.showModal();
            document.body.classList.add(OVERFLOW_HIDDEN_CLASS);
        }
        else if (dialog.open) {
            dialog.close();
            document.body.classList.remove(OVERFLOW_HIDDEN_CLASS);
        }
        return () => {
            document.body.classList.remove(OVERFLOW_HIDDEN_CLASS);
        };
    }, [isOpen]);
    (0, react_1.useEffect)(() => {
        const dialog = dialogRef.current;
        if (!dialog)
            return undefined;
        const handleCancel = (e) => {
            e.preventDefault();
            closeModal();
        };
        const handleClick = (e) => {
            if (e.target === dialog)
                closeModal();
        };
        dialog.addEventListener('cancel', handleCancel);
        dialog.addEventListener('click', handleClick);
        return () => {
            dialog.removeEventListener('cancel', handleCancel);
            dialog.removeEventListener('click', handleClick);
        };
    }, [closeModal]);
    const handleQuestion = (0, react_1.useCallback)((question) => {
        handleSubmitQuestion(question);
        openModal();
    }, [handleSubmitQuestion, openModal]);
    const handleQuestionClicked = (0, react_1.useCallback)((question) => {
        handleQuestionClick(question);
        openModal();
    }, [handleQuestionClick, openModal]);
    return (react_1.default.createElement("div", { ref: containerRef, className: 'cio-pia-container', "data-testid": 'cio-pia-container' },
        react_1.default.createElement("p", { className: 'cio-pia-title', "data-testid": 'cio-pia-title' }, (0, translate_1.translate)('Any questions about this product?', translations)),
        react_1.default.createElement("div", { className: 'cio-pia-conversation-footer' },
            initialQuestions.length > 0 && (react_1.default.createElement(SuggestedQuestionsContainer_1.default, { questions: initialQuestions, onQuestionClick: handleQuestionClicked, componentOverride: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.suggestedQuestions })),
            react_1.default.createElement(Input_1.default, { onSubmit: handleQuestion, onFocus: onInputFocus, disabled: isLoading || isOpen, translations: translations })),
        react_1.default.createElement("dialog", { ref: dialogRef, className: 'cio-pia-modal', "aria-labelledby": 'cio-pia-modal-title' },
            react_1.default.createElement("div", { className: 'cio-pia-modal-content' },
                react_1.default.createElement("div", { className: 'cio-pia-modal-header' },
                    react_1.default.createElement("p", { className: 'cio-pia-title', id: 'cio-pia-modal-title' }, (0, translate_1.translate)('Ask about this product', translations)),
                    react_1.default.createElement("button", { type: 'button', className: 'cio-pia-modal-close-button', "aria-label": 'Close', onClick: closeModal },
                        react_1.default.createElement(CloseIcon, null))),
                react_1.default.createElement("div", { className: 'cio-pia-modal-body' }, children)))));
}
exports.default = PiaModal;

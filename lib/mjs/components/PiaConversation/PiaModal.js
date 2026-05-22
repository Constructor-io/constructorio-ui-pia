import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from '../Input/Input';
import { translate } from '../../utils/translate';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
const OVERFLOW_HIDDEN_CLASS = 'cio-pia-modal-open';
function CloseIcon() {
    return (React.createElement("svg", { width: '20', height: '20', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' },
        React.createElement("path", { d: 'M15.8334 5.34166L14.6584 4.16666L10.0001 8.82499L5.34175 4.16666L4.16675 5.34166L8.82508 9.99999L4.16675 14.6583L5.34175 15.8333L10.0001 11.175L14.6584 15.8333L15.8334 14.6583L11.1751 9.99999L15.8334 5.34166Z', fill: 'currentColor' })));
}
export default function PiaModal({ initialQuestions, handleSubmitQuestion, handleQuestionClick, containerRef, isLoading, componentOverrides, translations, onInputFocus, onClose, children, }) {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef(null);
    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);
    const closeModal = useCallback(() => {
        setIsOpen(false);
        onClose?.();
    }, [onClose]);
    useEffect(() => {
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
    useEffect(() => {
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
    const handleQuestion = useCallback((question) => {
        handleSubmitQuestion(question);
        openModal();
    }, [handleSubmitQuestion, openModal]);
    const handleQuestionClicked = useCallback((question) => {
        handleQuestionClick(question);
        openModal();
    }, [handleQuestionClick, openModal]);
    return (React.createElement("div", { ref: containerRef, className: 'cio-pia-container', "data-testid": 'cio-pia-container' },
        React.createElement("p", { className: 'cio-pia-title', "data-testid": 'cio-pia-title' }, translate('Any questions about this product?', translations)),
        React.createElement("div", { className: 'cio-pia-conversation-footer' },
            initialQuestions.length > 0 && (React.createElement(SuggestedQuestionsContainer, { questions: initialQuestions, onQuestionClick: handleQuestionClicked, componentOverride: componentOverrides?.suggestedQuestions })),
            React.createElement(Input, { onSubmit: handleQuestion, onFocus: onInputFocus, disabled: isLoading || isOpen, translations: translations })),
        React.createElement("dialog", { ref: dialogRef, className: 'cio-pia-modal', "aria-labelledby": 'cio-pia-modal-title' },
            React.createElement("div", { className: 'cio-pia-modal-content' },
                React.createElement("div", { className: 'cio-pia-modal-header' },
                    React.createElement("p", { className: 'cio-pia-title', id: 'cio-pia-modal-title' }, translate('Ask about this product', translations)),
                    React.createElement("button", { type: 'button', className: 'cio-pia-modal-close-button', "aria-label": 'Close', onClick: closeModal },
                        React.createElement(CloseIcon, null))),
                React.createElement("div", { className: 'cio-pia-modal-body' }, children)))));
}

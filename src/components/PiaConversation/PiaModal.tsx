import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import Input from '../Input/Input';
import { translate } from '../../utils/translate';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import { Translations, Question, CioPiaComponentOverrides } from '../../types';

const OVERFLOW_HIDDEN_CLASS = 'cio-pia-modal-open';

function CloseIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      focusable='false'>
      <path
        d='M15.8334 5.34166L14.6584 4.16666L10.0001 8.82499L5.34175 4.16666L4.16675 5.34166L8.82508 9.99999L4.16675 14.6583L5.34175 15.8333L10.0001 11.175L14.6584 15.8333L15.8334 14.6583L11.1751 9.99999L15.8334 5.34166Z'
        fill='currentColor'
      />
    </svg>
  );
}

interface PiaModalProps {
  initialQuestions: Question[];
  handleSubmitQuestion: (question: string) => void;
  handleQuestionClick: (question: string) => void;
  containerRef?: (node: HTMLDivElement | null) => void;
  isLoading: boolean;
  componentOverrides?: CioPiaComponentOverrides;
  translations?: Translations;
  onInputFocus?: () => void;
  onClose?: () => void;
}

export default function PiaModal({
  initialQuestions,
  handleSubmitQuestion,
  handleQuestionClick,
  containerRef,
  isLoading,
  componentOverrides,
  translations,
  onInputFocus,
  onClose,
  children,
}: PropsWithChildren<PiaModalProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback(() => {
    const active = document.activeElement as HTMLElement | null;
    const isRealTrigger =
      !!active && active !== document.body && active !== document.documentElement;

    triggerRef.current = isRealTrigger ? active : null;
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (isOpen) {
      dialog.showModal();
      document.body.classList.add(OVERFLOW_HIDDEN_CLASS);
    } else {
      if (dialog.open) dialog.close();
      document.body.classList.remove(OVERFLOW_HIDDEN_CLASS);
    }

    return () => {
      document.body.classList.remove(OVERFLOW_HIDDEN_CLASS);
    };
  }, [isOpen]);

  // Restore focus to the trigger. Re-runs on `isLoading`: the input trigger is
  // disabled while a request is in flight and `focus()` would no-op.
  useEffect(() => {
    if (isOpen) return;

    const trigger = triggerRef.current;
    if (!trigger || !trigger.isConnected) return;
    if ((trigger as HTMLInputElement).disabled) return;

    trigger.focus();
    triggerRef.current = null;
  }, [isOpen, isLoading]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      closeModal();
    };

    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) closeModal();
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClick);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClick);
    };
  }, [closeModal]);

  const handleQuestion = useCallback(
    (question: string) => {
      handleSubmitQuestion(question);
      openModal();
    },
    [handleSubmitQuestion, openModal],
  );

  const handleQuestionClicked = useCallback(
    (question: string) => {
      handleQuestionClick(question);
      openModal();
    },
    [handleQuestionClick, openModal],
  );

  return (
    <div ref={containerRef} className='cio-pia-container' data-testid='cio-pia-container'>
      <p className='cio-pia-title' data-testid='cio-pia-title'>
        {translate('Any questions about this product?', translations)}
      </p>
      <div className='cio-pia-conversation-footer'>
        {initialQuestions.length > 0 && (
          <SuggestedQuestionsContainer
            questions={initialQuestions}
            onQuestionClick={handleQuestionClicked}
            componentOverride={componentOverrides?.suggestedQuestions}
          />
        )}

        <Input
          onSubmit={handleQuestion}
          onFocus={onInputFocus}
          disabled={isLoading || isOpen}
          translations={translations}
          componentOverride={componentOverrides?.input}
        />
      </div>

      <dialog ref={dialogRef} className='cio-pia-modal' aria-labelledby='cio-pia-modal-title'>
        <div className='cio-pia-modal-content'>
          <div className='cio-pia-modal-header'>
            <p className='cio-pia-title' id='cio-pia-modal-title'>
              {translate('Ask about this product', translations)}
            </p>
            <button
              type='button'
              className='cio-pia-modal-close-button'
              aria-label={translate('Close', translations)}
              onClick={closeModal}>
              <CloseIcon />
            </button>
          </div>
          <div className='cio-pia-modal-body'>{children}</div>
        </div>
      </dialog>
    </div>
  );
}

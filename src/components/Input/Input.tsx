import React, { useCallback, useEffect, useState } from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { InputRenderProps, Translations } from '../../types';
import { translate } from '../../utils/translate';
import { SendIcon } from '../icons';
import { RECS_INPUT_PLACEHOLDER } from '../../constants';

/** Translation keys this input can use for its placeholder. */
export type InputPlaceholderKey = 'Ask anything' | typeof RECS_INPUT_PLACEHOLDER;

interface InputProps {
  value?: string;
  disabled?: boolean;
  /** @deprecated Use the `translations` prop instead. */
  placeholder?: string;
  onSubmit: (value: string) => void;
  onFocus?: () => void;
  translations?: Translations;
  componentOverride?: ComponentOverrideProps<InputRenderProps>;
  /**
   * Validation message for the value that was just submitted. When set, the box gets a red
   * border and the message renders below it. The value the shopper typed is left alone.
   */
  error?: string;
  /**
   * Which translation key to use for the placeholder. Needed because two inputs in the same
   * library ask for different things and must stay independently translatable.
   *
   * @default 'Ask anything'
   */
  placeholderKey?: InputPlaceholderKey;
}

function Input({
  value: providedValue,
  placeholder,
  disabled = false,
  onSubmit,
  onFocus,
  translations,
  componentOverride,
  error,
  placeholderKey = 'Ask anything',
}: InputProps) {
  const [value, setValue] = useState(providedValue || '');

  // Links the error message to the box for screen readers. `useId` would need React 18 and this
  // library supports React 16.12, so the id is minted once per instance the way `usePiaClient`
  // mints a thread id. It cannot be a constant: two inputs can be on the same page.
  const [errorId] = useState(() => `cio-pia-input-error-${crypto.randomUUID()}`);

  useEffect(() => {
    if (providedValue) {
      setValue(providedValue);
    }
  }, [providedValue]);

  const handleSubmit = useCallback(
    (submittedValue: string) => {
      if (submittedValue.trim()) {
        onSubmit(submittedValue.trim());
        if (submittedValue.trim() !== providedValue) {
          setValue('');
        }
      }
    },
    [onSubmit, providedValue],
  );

  const handleSubmitOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(value);
    }
  };

  // Priority: translations > placeholder prop > default
  const resolvedPlaceholder =
    translations?.[placeholderKey] !== undefined
      ? translate(placeholderKey, translations)
      : (placeholder ?? translate(placeholderKey));

  return (
    <RenderPropsWrapper
      props={{
        disabled,
        placeholder: resolvedPlaceholder,
        onSubmit: handleSubmit,
        onFocus,
        translations,
        error,
      }}
      override={componentOverride?.reactNode}>
      {/* The message sits beside the box, not inside it: the box is a fixed-height flex row. */}
      <>
        <div className='cio-pia-input-container'>
          <input
            type='text'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleSubmitOnEnter}
            onFocus={onFocus}
            placeholder={resolvedPlaceholder}
            disabled={disabled}
            className={error ? 'cio-pia-input cio-pia-input--error' : 'cio-pia-input'}
            aria-invalid={error ? true : undefined}
            // `aria-describedby` rather than `aria-errormessage`: less precise semantically, but
            // universally supported. `role='alert'` announces the message when it appears; this is
            // what reads it out again to somebody who tabs back to the box.
            aria-describedby={error ? errorId : undefined}
          />
          <button
            type='button'
            onClick={() => handleSubmit(value)}
            className='cio-pia-send-button'
            disabled={disabled}>
            {translate('Send', translations)}
            <SendIcon />
          </button>
        </div>
        {error && (
          <span id={errorId} className='cio-pia-input-error' role='alert'>
            {error}
          </span>
        )}
      </>
    </RenderPropsWrapper>
  );
}

export default Input;

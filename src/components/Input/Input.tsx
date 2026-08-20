import React, { useCallback, useEffect, useState } from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { InputRenderProps, Translations } from '../../types';
import { cx } from '../../utils/classNames';
import { translate } from '../../utils/translate';
import { SendIcon } from '../icons';

/**
 * Counts instances so each error message can be given an id of its own, which `aria-describedby`
 * needs to point at it. `useId` would do this, but it is React 18+ and this package supports React
 * >= 16.12. Read once per instance through a lazy initializer, so it holds across renders.
 */
let inputInstanceCount = 0;

interface InputProps {
  value?: string;
  disabled?: boolean;
  /** @deprecated Use the `translations` prop instead. */
  placeholder?: string;
  onSubmit: (value: string) => void;
  onFocus?: () => void;
  translations?: Translations;
  componentOverride?: ComponentOverrideProps<InputRenderProps>;
  error?: string;
  placeholderKey?: string;
  /**
   * Render the Send button after the field.
   *
   * @default true
   */
  showSendButton?: boolean;
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
  showSendButton = true,
}: InputProps) {
  const [value, setValue] = useState(providedValue || '');
  const [errorId] = useState(() => {
    inputInstanceCount += 1;
    return `cio-pia-input-${inputInstanceCount}-error`;
  });

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

  // The field reserves room on its right for the Send button, so it has to give that room back
  // when there is no button to reserve it for.
  const inputClassName = cx(
    'cio-pia-input',
    error && 'cio-pia-input--error',
    !showSendButton && 'cio-pia-input--no-send',
  );

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
            className={inputClassName}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          {showSendButton && (
            <button
              type='button'
              onClick={() => handleSubmit(value)}
              className='cio-pia-send-button'
              disabled={disabled}>
              {translate('Send', translations)}
              <SendIcon />
            </button>
          )}
        </div>
        {error && (
          <span className='cio-pia-input-error' id={errorId} role='alert'>
            {error}
          </span>
        )}
      </>
    </RenderPropsWrapper>
  );
}

export default Input;

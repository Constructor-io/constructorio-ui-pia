import React, { useCallback, useEffect, useState } from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { InputRenderProps, Translations } from '../../types';
import { translate } from '../../utils/translate';
import { SendIcon } from '../icons';

interface InputProps {
  value?: string;
  disabled?: boolean;
  /** @deprecated Use the `translations` prop instead. */
  placeholder?: string;
  onSubmit: (value: string) => void;
  onFocus?: () => void;
  translations?: Translations;
  componentOverride?: ComponentOverrideProps<InputRenderProps>;
}

function Input({
  value: providedValue,
  placeholder,
  disabled = false,
  onSubmit,
  onFocus,
  translations,
  componentOverride,
}: InputProps) {
  const [value, setValue] = useState(providedValue || '');

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
    translations?.['Ask anything'] !== undefined
      ? translate('Ask anything', translations)
      : (placeholder ?? translate('Ask anything'));

  return (
    <RenderPropsWrapper
      props={{
        disabled,
        placeholder: resolvedPlaceholder,
        onSubmit: handleSubmit,
        onFocus,
        translations,
      }}
      override={componentOverride?.reactNode}>
      <div className='cio-pia-input-container'>
        <input
          type='text'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleSubmitOnEnter}
          onFocus={onFocus}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          className='cio-pia-input'
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
    </RenderPropsWrapper>
  );
}

export default Input;

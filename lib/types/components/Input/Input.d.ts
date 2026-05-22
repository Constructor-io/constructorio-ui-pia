import React from 'react';
import { Translations } from '../../types';
interface InputProps {
    value?: string;
    disabled?: boolean;
    /** @deprecated Use the `translations` prop instead. */
    placeholder?: string;
    onSubmit: (value: string) => void;
    onFocus?: () => void;
    translations?: Translations;
}
declare function Input({ value: providedValue, placeholder, disabled, onSubmit, onFocus, translations, }: InputProps): React.JSX.Element;
export default Input;

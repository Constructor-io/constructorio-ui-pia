import React from 'react';
import { ComponentOverrideProps } from '@constructor-io/constructorio-ui-components';
import { Translations, FeedbackRenderProps, FeedbackType } from '../../types';
interface FeedbackProps {
    translations?: Translations;
    onFeedback?: (type: FeedbackType) => void;
    componentOverride?: ComponentOverrideProps<FeedbackRenderProps>;
}
export default function Feedback({ translations, onFeedback, componentOverride }: FeedbackProps): React.JSX.Element;
export {};

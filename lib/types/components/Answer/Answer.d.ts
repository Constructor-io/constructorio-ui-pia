import React from 'react';
import { ComponentOverrideProps } from '@constructor-io/constructorio-ui-components';
import { AnswerRenderProps } from '../../types';
interface AnswerProps {
    text: string;
    componentOverride?: ComponentOverrideProps<AnswerRenderProps>;
}
declare function Answer({ text, componentOverride }: AnswerProps): React.JSX.Element | null;
export default Answer;

import React from 'react';
import { ComponentOverrideProps } from '@constructor-io/constructorio-ui-components';
import { Translations, DisclaimerRenderProps } from '../../types';
export default function Disclaimer({ learnMoreUrl, translations, componentOverride, }: {
    learnMoreUrl?: string;
    translations?: Translations;
    componentOverride?: ComponentOverrideProps<DisclaimerRenderProps>;
}): React.JSX.Element;

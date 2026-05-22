import React from 'react';
import { RenderPropsWrapper, } from '@constructor-io/constructorio-ui-components';
import { translate } from '../../utils/translate';
import { DISCLAIMER_TEXT } from '../../constants';
export default function Disclaimer({ learnMoreUrl, translations, componentOverride, }) {
    return (React.createElement(RenderPropsWrapper, { props: { learnMoreUrl, translations }, override: componentOverride?.reactNode },
        React.createElement("span", { className: 'cio-pia-disclaimer' },
            translate(DISCLAIMER_TEXT, translations),
            ' ',
            learnMoreUrl && (React.createElement("a", { href: learnMoreUrl, target: '_blank', rel: 'noopener noreferrer', className: 'cio-pia-learn-more' },
                React.createElement("u", null, translate('Learn More.', translations)))))));
}

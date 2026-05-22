import React from 'react';
import { Callbacks, CioPiaComponentOverrides, DisclaimerPosition, Translations, Item } from '../../types';
interface PiaInlineAnswerProps {
    currentAnswer: string;
    currentItems: Item[] | null;
    showFeedback?: boolean;
    learnMoreUrl?: string;
    disclaimerPosition?: DisclaimerPosition;
    translations?: Translations;
    callbacks?: Callbacks;
    componentOverrides?: CioPiaComponentOverrides;
}
export default function PiaInlineAnswer({ currentAnswer, currentItems, showFeedback, learnMoreUrl, disclaimerPosition, translations, callbacks, componentOverrides, }: PiaInlineAnswerProps): React.JSX.Element;
export {};

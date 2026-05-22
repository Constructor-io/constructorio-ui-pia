import React from 'react';
import { ConversationEntry, Translations, Item, Callbacks, CioPiaComponentOverrides, DisclaimerPosition } from '../../types';
export interface ConversationHistoryProps {
    conversationHistory: ConversationEntry[];
    isLoading: boolean;
    error: Error | null;
    /**
     * Items for the latest conversation entry's carousel.
     * - `undefined` (not provided): falls back to entry.items
     * - `null`: explicitly no items, hides the carousel
     * - `Item[]`: shows these items, overriding entry.items
     */
    currentItems?: Item[] | null;
    showFeedback?: boolean;
    /**
     * Show product carousels on non-last conversation entries. Defaults to true.
     * The last entry always falls back to its own items when currentItems is not provided.
     */
    showPreviousItems?: boolean;
    learnMoreUrl?: string;
    disclaimerPosition?: DisclaimerPosition;
    translations?: Translations;
    callbacks?: Callbacks;
    componentOverrides?: CioPiaComponentOverrides;
}
export default function ConversationHistory({ conversationHistory, isLoading, error, currentItems, showFeedback, showPreviousItems, learnMoreUrl, disclaimerPosition, translations, callbacks, componentOverrides, }: ConversationHistoryProps): React.JSX.Element;

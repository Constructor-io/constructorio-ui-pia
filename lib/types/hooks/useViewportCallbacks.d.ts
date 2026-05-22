import { Callbacks, PiaCallbackContext } from '../types';
export interface UseViewportCallbacksProps {
    callbacks?: Callbacks;
    context: PiaCallbackContext;
}
export interface UseViewportCallbacksReturn {
    containerRef: (node: HTMLDivElement | null) => void;
}
export default function useViewportCallbacks({ callbacks, context, }: UseViewportCallbacksProps): UseViewportCallbacksReturn;

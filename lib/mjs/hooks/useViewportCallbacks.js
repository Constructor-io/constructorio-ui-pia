import { useCallback, useEffect, useRef } from 'react';
export default function useViewportCallbacks({ callbacks, context, }) {
    const callbacksRef = useRef(callbacks);
    const contextRef = useRef(context);
    const hasBeenVisibleRef = useRef(false);
    const hasFiredOutOfViewRef = useRef(false);
    const observerRef = useRef(null);
    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);
    useEffect(() => {
        contextRef.current = context;
    }, [context]);
    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
        };
    }, []);
    const containerRef = useCallback((node) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
        if (!node)
            return;
        hasBeenVisibleRef.current = false;
        hasFiredOutOfViewRef.current = false;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasBeenVisibleRef.current) {
                hasBeenVisibleRef.current = true;
                callbacksRef.current?.onView?.(contextRef.current);
            }
            else if (!entry.isIntersecting &&
                hasBeenVisibleRef.current &&
                !hasFiredOutOfViewRef.current) {
                hasFiredOutOfViewRef.current = true;
                callbacksRef.current?.onOutOfView?.(contextRef.current);
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(node);
        observerRef.current = observer;
    }, []);
    return { containerRef };
}

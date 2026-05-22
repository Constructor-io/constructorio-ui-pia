"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useViewportCallbacks({ callbacks, context, }) {
    const callbacksRef = (0, react_1.useRef)(callbacks);
    const contextRef = (0, react_1.useRef)(context);
    const hasBeenVisibleRef = (0, react_1.useRef)(false);
    const hasFiredOutOfViewRef = (0, react_1.useRef)(false);
    const observerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);
    (0, react_1.useEffect)(() => {
        contextRef.current = context;
    }, [context]);
    (0, react_1.useEffect)(() => {
        return () => {
            var _a;
            (_a = observerRef.current) === null || _a === void 0 ? void 0 : _a.disconnect();
        };
    }, []);
    const containerRef = (0, react_1.useCallback)((node) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }
        if (!node)
            return;
        hasBeenVisibleRef.current = false;
        hasFiredOutOfViewRef.current = false;
        const observer = new IntersectionObserver(([entry]) => {
            var _a, _b, _c, _d;
            if (entry.isIntersecting && !hasBeenVisibleRef.current) {
                hasBeenVisibleRef.current = true;
                (_b = (_a = callbacksRef.current) === null || _a === void 0 ? void 0 : _a.onView) === null || _b === void 0 ? void 0 : _b.call(_a, contextRef.current);
            }
            else if (!entry.isIntersecting &&
                hasBeenVisibleRef.current &&
                !hasFiredOutOfViewRef.current) {
                hasFiredOutOfViewRef.current = true;
                (_d = (_c = callbacksRef.current) === null || _c === void 0 ? void 0 : _c.onOutOfView) === null || _d === void 0 ? void 0 : _d.call(_c, contextRef.current);
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(node);
        observerRef.current = observer;
    }, []);
    return { containerRef };
}
exports.default = useViewportCallbacks;

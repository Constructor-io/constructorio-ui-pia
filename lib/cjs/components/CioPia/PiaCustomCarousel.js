"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const constructorio_ui_components_1 = require("@constructor-io/constructorio-ui-components");
const contentTransformers_1 = require("../../utils/contentTransformers");
function HtmlDescription({ product }) {
    const { description } = product;
    if (!description)
        return null;
    return (react_1.default.createElement("p", { className: 'cio-product-card-description', dangerouslySetInnerHTML: { __html: (0, contentTransformers_1.sanitizeHtml)(description) } }));
}
function PiaCustomCarousel({ items, componentOverrides, callbacks, }) {
    const wrapperRef = (0, react_1.useRef)(null);
    // Determine to use user-defined click handler or default behavior
    const productClickHandler = (0, react_1.useCallback)((item) => {
        const { onProductCardClick } = callbacks || {};
        if (onProductCardClick) {
            onProductCardClick(item);
        }
        else if (item === null || item === void 0 ? void 0 : item.url) {
            window.open(item.url, '_blank', 'noopener,noreferrer');
        }
    }, [callbacks]);
    // Set up event listener for product card clicks
    (0, react_1.useEffect)(() => {
        const el = wrapperRef.current;
        if (!el)
            return undefined;
        const handleClick = (e) => {
            const { product } = e.detail;
            if (product) {
                productClickHandler(product);
            }
        };
        el.addEventListener(constructorio_ui_components_1.CIO_EVENTS.productCard.click, handleClick);
        return () => {
            el.removeEventListener(constructorio_ui_components_1.CIO_EVENTS.productCard.click, handleClick);
        };
    }, [productClickHandler]);
    const mergedOverrides = (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d, _e, _f;
        if ((_c = (_b = (_a = componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.item) === null || _a === void 0 ? void 0 : _a.productCard) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.description) {
            return componentOverrides;
        }
        return Object.assign(Object.assign({}, componentOverrides), { item: Object.assign(Object.assign({}, componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.item), { productCard: Object.assign(Object.assign({}, (_d = componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.item) === null || _d === void 0 ? void 0 : _d.productCard), { content: Object.assign(Object.assign({}, (_f = (_e = componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.item) === null || _e === void 0 ? void 0 : _e.productCard) === null || _f === void 0 ? void 0 : _f.content), { description: { reactNode: HtmlDescription } }) }) }) });
    }, [componentOverrides]);
    // If there are no items, do not render the carousel
    if (items.length === 0) {
        return null;
    }
    return (react_1.default.createElement("div", { ref: wrapperRef },
        react_1.default.createElement(constructorio_ui_components_1.Carousel, { items: items, componentOverrides: mergedOverrides })));
}
exports.default = PiaCustomCarousel;

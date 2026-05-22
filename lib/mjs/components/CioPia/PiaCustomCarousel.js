import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import { Carousel, CIO_EVENTS, } from '@constructor-io/constructorio-ui-components';
import { sanitizeHtml } from '../../utils/contentTransformers';
function HtmlDescription({ product }) {
    const { description } = product;
    if (!description)
        return null;
    return (React.createElement("p", { className: 'cio-product-card-description', dangerouslySetInnerHTML: { __html: sanitizeHtml(description) } }));
}
export default function PiaCustomCarousel({ items, componentOverrides, callbacks, }) {
    const wrapperRef = useRef(null);
    // Determine to use user-defined click handler or default behavior
    const productClickHandler = useCallback((item) => {
        const { onProductCardClick } = callbacks || {};
        if (onProductCardClick) {
            onProductCardClick(item);
        }
        else if (item?.url) {
            window.open(item.url, '_blank', 'noopener,noreferrer');
        }
    }, [callbacks]);
    // Set up event listener for product card clicks
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el)
            return undefined;
        const handleClick = (e) => {
            const { product } = e.detail;
            if (product) {
                productClickHandler(product);
            }
        };
        el.addEventListener(CIO_EVENTS.productCard.click, handleClick);
        return () => {
            el.removeEventListener(CIO_EVENTS.productCard.click, handleClick);
        };
    }, [productClickHandler]);
    const mergedOverrides = useMemo(() => {
        if (componentOverrides?.item?.productCard?.content?.description) {
            return componentOverrides;
        }
        return {
            ...componentOverrides,
            item: {
                ...componentOverrides?.item,
                productCard: {
                    ...componentOverrides?.item?.productCard,
                    content: {
                        ...componentOverrides?.item?.productCard?.content,
                        description: { reactNode: HtmlDescription },
                    },
                },
            },
        };
    }, [componentOverrides]);
    // If there are no items, do not render the carousel
    if (items.length === 0) {
        return null;
    }
    return (React.createElement("div", { ref: wrapperRef },
        React.createElement(Carousel, { items: items, componentOverrides: mergedOverrides })));
}

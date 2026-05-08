import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import {
  Carousel,
  CarouselOverrides,
  CIO_EVENTS,
} from '@constructor-io/constructorio-ui-components';
import { Callbacks, Item } from '../../types';
import { sanitizeHtml } from '../../utils/contentTransformers';

function HtmlDescription({ product }: { product: Item }) {
  const { description } = product;
  if (!description) return null;
  return (
    <p
      className='cio-product-card-description'
      // eslint-disable-next-line react/no-danger -- descriptions may contain HTML from catalog; sanitized via DOMPurify
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
    />
  );
}

interface PiaCustomCarouselProps {
  items: Array<Item>;
  componentOverrides?: CarouselOverrides<Item>;
  callbacks?: Callbacks;
}

export default function PiaCustomCarousel({
  items,
  componentOverrides,
  callbacks,
}: PiaCustomCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Determine to use user-defined click handler or default behavior
  const productClickHandler = useCallback(
    (item: Item) => {
      const { onProductCardClick } = callbacks || {};
      if (onProductCardClick) {
        onProductCardClick(item);
      } else if (item?.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
    },
    [callbacks],
  );

  // Set up event listener for product card clicks
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    const handleClick = (e: Event) => {
      const { product } = (e as CustomEvent).detail;
      if (product) {
        productClickHandler(product as Item);
      }
    };

    el.addEventListener(CIO_EVENTS.productCard.click, handleClick);
    return () => {
      el.removeEventListener(CIO_EVENTS.productCard.click, handleClick);
    };
  }, [productClickHandler]);

  const mergedOverrides = useMemo((): CarouselOverrides<Item> => {
    const customerDescriptionOverride = componentOverrides?.item?.productCard?.content?.description;

    if (customerDescriptionOverride) {
      return componentOverrides;
    }

    const htmlDescriptionOverride = {
      reactNode: HtmlDescription,
    };

    return {
      ...componentOverrides,
      item: {
        ...componentOverrides?.item,
        productCard: {
          ...componentOverrides?.item?.productCard,
          content: {
            ...componentOverrides?.item?.productCard?.content,
            description: htmlDescriptionOverride,
          },
        },
      },
    };
  }, [componentOverrides]);

  // If there are no items, do not render the carousel
  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={wrapperRef}>
      <Carousel items={items} componentOverrides={mergedOverrides} />
    </div>
  );
}

import React, { useCallback, useRef, useEffect } from 'react';
import {
  Carousel,
  CarouselOverrides,
  CIO_EVENTS,
} from '@constructor-io/constructorio-ui-components';
import { Callbacks, Item } from '../../types';

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

  // If there are no items, do not render the carousel
  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={wrapperRef}>
      <Carousel items={items} componentOverrides={componentOverrides} />
    </div>
  );
}

import React, { useMemo, useCallback } from 'react';
import {
  Carousel,
  CarouselItemRenderProps,
  CarouselOverrides,
  ProductCard,
} from '@constructor-io/constructorio-ui-components';
import { Callbacks, Item } from '../../types';

interface PiaCustomCarouselProps {
  items: Array<Item>;
  componentOverrides?: CarouselOverrides<Item>;
  callbacks?: Callbacks;
}

// Default item renderer with default click behavior
function DefaultItemRenderer({ item }: CarouselItemRenderProps<Item>, callbacks?: Callbacks) {
  if (!item) {
    return null;
  }

  const { onProductCardClick } = callbacks || {};

  /**
   * Using props drilling as current implementation
   * until Event Listeners approach has been released in UI Components library
   */
  const handleProductClick = () => {
    if (onProductCardClick) {
      onProductCardClick(item);
    } else if (item?.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <ProductCard product={item} className='w-full h-full' onProductClick={handleProductClick} />
  );
}

export default function PiaCustomCarousel({
  items,
  componentOverrides,
  callbacks,
}: PiaCustomCarouselProps) {
  const defaultItemRenderer = useCallback(
    (props: CarouselItemRenderProps<Item>) => DefaultItemRenderer(props, callbacks),
    [callbacks],
  );

  // Merge user-provided overrides with default item renderer
  const mergedOverrides = useMemo<CarouselOverrides<Item>>(
    () => ({
      ...componentOverrides,
      item: componentOverrides?.item ?? {
        reactNode: defaultItemRenderer,
      },
    }),
    [componentOverrides, defaultItemRenderer],
  );

  if (items.length === 0) {
    return null;
  }

  return <Carousel items={items} componentOverrides={mergedOverrides} />;
}

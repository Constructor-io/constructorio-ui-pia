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
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
    />
  );
}

function createPriceSectionOverride(priceCurrency: string) {
  return function PriceSectionOverride({ product }: { product: Item }) {
    const { price, salePrice } = product;
    if (price == null) return null;
    return (
      <div className='cio-product-card-price-section flex items-baseline gap-2'>
        <span className='text-lg font-bold'>
          {priceCurrency}&nbsp;{salePrice ?? price}
        </span>
        {salePrice != null && (
          <span className='text-sm text-gray-400 line-through'>
            {priceCurrency}&nbsp;{price}
          </span>
        )}
      </div>
    );
  };
}

interface ContentOverrides {
  description?: unknown;
  price?: unknown;
}

function getContentDefaults(
  content: ContentOverrides | undefined,
  priceSectionOverride: React.ComponentType<{ product: Item }> | undefined,
) {
  const defaults: Record<string, { reactNode: React.ComponentType<{ product: Item }> }> = {};
  if (!content?.description) {
    defaults.description = { reactNode: HtmlDescription };
  }
  if (!content?.price && priceSectionOverride) {
    defaults.price = { reactNode: priceSectionOverride };
  }
  return defaults;
}

function buildMergedOverrides(
  componentOverrides: CarouselOverrides<Item> | undefined,
  priceSectionOverride: React.ComponentType<{ product: Item }> | undefined,
): CarouselOverrides<Item> {
  const content = componentOverrides?.item?.productCard?.content;
  const defaults = getContentDefaults(content, priceSectionOverride);

  if (Object.keys(defaults).length === 0) {
    return componentOverrides || {};
  }

  return {
    ...componentOverrides,
    item: {
      ...componentOverrides?.item,
      productCard: {
        ...componentOverrides?.item?.productCard,
        content: {
          ...content,
          ...defaults,
        },
      },
    },
  };
}

interface PiaCustomCarouselProps {
  items: Array<Item>;
  componentOverrides?: CarouselOverrides<Item>;
  callbacks?: Callbacks;
  onResultClick?: (item: Item, position: number, question: string, qnaResultId?: string) => void;
  question?: string;
  qnaResultId?: string;
  priceCurrency?: string;
}

export default function PiaCustomCarousel({
  items,
  componentOverrides,
  callbacks,
  onResultClick,
  question,
  qnaResultId,
  priceCurrency,
}: PiaCustomCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Determine to use user-defined click handler or default behavior
  const productClickHandler = useCallback(
    (item: Item) => {
      const position = items.findIndex((i) => i.id === item.id);
      if (onResultClick && question) {
        onResultClick(item, position >= 0 ? position : 0, question, qnaResultId);
      }

      const { onProductCardClick } = callbacks || {};
      if (onProductCardClick) {
        onProductCardClick(item);
      } else if (item?.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
    },
    [callbacks, items, onResultClick, question, qnaResultId],
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

  const priceSectionOverride = useMemo(
    () => (priceCurrency ? createPriceSectionOverride(priceCurrency) : undefined),
    [priceCurrency],
  );

  const mergedOverrides = useMemo(
    () => buildMergedOverrides(componentOverrides, priceSectionOverride),
    [componentOverrides, priceSectionOverride],
  );

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

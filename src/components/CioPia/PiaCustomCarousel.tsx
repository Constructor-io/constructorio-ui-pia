import React, { useCallback, useMemo } from 'react';
import {
  Carousel,
  CarouselOverrides,
  ProductCard,
  ProductCardProps,
} from '@constructor-io/constructorio-ui-components';
import { Callbacks, Item, Translations } from '../../types';
import { sanitizeHtml } from '../../utils/contentTransformers';
import { translate } from '../../utils/translate';

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

// The card root is focusable and acts as a link, so Enter must do what a click does.
// Only for the card itself: Enter on the Add to Cart button inside it is that button's.
function handleCardKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
  if (event.key === 'Enter' && event.target === event.currentTarget) {
    event.currentTarget.click();
  }
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
  translations?: Translations;
  priceCurrency?: string;
}

export default function PiaCustomCarousel({
  items,
  componentOverrides,
  callbacks,
  onResultClick,
  question,
  qnaResultId,
  translations,
  priceCurrency,
}: PiaCustomCarouselProps) {
  const { onAddToCart } = callbacks || {};

  const addToCartHandler = useCallback(
    (event: React.MouseEvent, product: Item) => {
      onAddToCart?.(product, event);
    },
    [onAddToCart],
  );

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

  const priceSectionOverride = useMemo(
    () => (priceCurrency ? createPriceSectionOverride(priceCurrency) : undefined),
    [priceCurrency],
  );

  const clickHandlerProps = useMemo(
    () => ({
      onProductClick: productClickHandler,
      onAddToCart: onAddToCart ? addToCartHandler : undefined,
    }),
    [productClickHandler, onAddToCart, addToCartHandler],
  );

  const mergedOverrides = useMemo((): CarouselOverrides<Item> => {
    const baseOverrides = buildMergedOverrides(componentOverrides, priceSectionOverride);

    // Override priority: carousel.reactNode → item.reactNode → item.productCard.reactNode → default ProductCard.
    // The casts are required because the override signatures don't declare these extra props,
    // but consumers receive them as part of the render-props contract documented in CioPiaProps.
    const carouselOverride = baseOverrides.reactNode;
    if (typeof carouselOverride === 'function') {
      return {
        ...baseOverrides,
        reactNode: (props: Record<string, unknown>) =>
          carouselOverride({ ...props, ...clickHandlerProps } as typeof props),
      };
    }

    const cardOverrides = baseOverrides.item?.productCard;
    const itemOverride = baseOverrides.item?.reactNode;
    if (typeof itemOverride === 'function') {
      return {
        ...baseOverrides,
        item: {
          ...baseOverrides.item,
          reactNode: (props: Record<string, unknown>) =>
            itemOverride({ ...props, ...clickHandlerProps } as typeof props),
        },
      };
    }

    if (typeof cardOverrides?.reactNode === 'function') {
      const originalReactNode = cardOverrides.reactNode;
      return {
        ...baseOverrides,
        item: {
          ...baseOverrides.item,
          productCard: {
            ...cardOverrides,
            reactNode: (props: ProductCardProps) =>
              originalReactNode({ ...props, ...clickHandlerProps } as ProductCardProps),
          },
        },
      };
    }

    // Default: render ProductCard with handlers directly
    const addToCartText = onAddToCart ? translate('Add to Cart', translations) : undefined;
    return {
      ...baseOverrides,
      item: {
        ...baseOverrides.item,
        productCard: {
          ...cardOverrides,
          reactNode: ({ product }: ProductCardProps) => (
            <ProductCard
              product={product}
              className='w-full h-full'
              // Reachable by Tab. The name is the product name: a name computed from the
              // card's content would also swallow the Add to Cart button's text.
              role='link'
              aria-label={product.name || undefined}
              tabIndex={0}
              onKeyDown={handleCardKeyDown}
              addToCartText={addToCartText}
              onAddToCart={clickHandlerProps.onAddToCart}
              onProductClick={clickHandlerProps.onProductClick}
              componentOverrides={cardOverrides}
            />
          ),
        },
      },
    };
  }, [componentOverrides, priceSectionOverride, clickHandlerProps, onAddToCart, translations]);

  if (items.length === 0) {
    return null;
  }

  return <Carousel items={items} componentOverrides={mergedOverrides} />;
}

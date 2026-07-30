import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import {
  Carousel,
  CarouselOverrides,
  ProductCard,
  ProductCardOverrides,
  ProductCardProps,
  CIO_EVENTS,
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

interface PiaCustomCarouselProps {
  items: Array<Item>;
  componentOverrides?: CarouselOverrides<Item>;
  callbacks?: Callbacks;
  onResultClick?: (item: Item, position: number, question: string, qnaResultId?: string) => void;
  question?: string;
  qnaResultId?: string;
  translations?: Translations;
}

export default function PiaCustomCarousel({
  items,
  componentOverrides,
  callbacks,
  onResultClick,
  question,
  qnaResultId,
  translations,
}: PiaCustomCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { onAddToCart } = callbacks || {};

  const addToCartHandler = useCallback(
    (event: React.MouseEvent, product: Item) => {
      onAddToCart?.(product, event);
    },
    [onAddToCart],
  );

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

  const mergedOverrides = useMemo((): CarouselOverrides<Item> => {
    const userProductCard = componentOverrides?.item?.productCard;

    // Render descriptions as sanitized HTML unless the consumer overrides the description
    let productCard: ProductCardOverrides = userProductCard?.content?.description
      ? userProductCard
      : {
          ...userProductCard,
          content: {
            ...userProductCard?.content,
            description: { reactNode: HtmlDescription },
          },
        };

    // The carousel never hands its product cards an `onAddToCart` handler, and the card hides
    // the button without one. Re-render the card with the consumer's handler to reveal it, so the
    // button only ever appears when there is cart logic behind it. A consumer-supplied card
    // override replaces the card wholesale, so leave that case alone.
    if (onAddToCart && !userProductCard?.reactNode) {
      const cardOverrides = productCard;
      const addToCartText = translate('Add to Cart', translations);

      productCard = {
        ...cardOverrides,
        reactNode: ({ product }: ProductCardProps) => (
          <ProductCard
            product={product}
            className='w-full h-full'
            addToCartText={addToCartText}
            onAddToCart={addToCartHandler}
            componentOverrides={cardOverrides}
          />
        ),
      };
    }

    return {
      ...componentOverrides,
      item: {
        ...componentOverrides?.item,
        productCard,
      },
    };
  }, [componentOverrides, onAddToCart, translations, addToCartHandler]);

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

import React from 'react';
import {
  Carousel,
  CarouselOverrides,
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { Item, LoadingRenderProps } from '../../types';

/** The widest band the carousel lays out. Narrower ones need no count: its viewport clips them. */
const DEFAULT_COUNT = 6;

interface RecsCarouselSkeletonProps {
  /** How many cards to draw. Defaults to the widest band the carousel lays out. */
  count?: number;
  componentOverride?: ComponentOverrideProps<LoadingRenderProps>;
}

/**
 * Grey bars standing in for a card's own sections. The card around them - white background,
 * rounded corners, shadow, padding - and the row it sits in are the real ones, so nothing here has
 * to know their measurements.
 *
 * `RenderPropsWrapper` draws an override in place of a section rather than alongside it, so these
 * appear even though the placeholder carries no image, price or name of its own.
 *
 * A caller's own `productCard` overrides are deliberately not merged in, unlike the real row in
 * `PiaCustomCarousel`: the placeholders below are empty objects, so a caller's section renderer
 * would be handed a product with every field `undefined`.
 */
const CARD_SKELETON: CarouselOverrides<Item> = {
  item: {
    productCard: {
      image: {
        reactNode: () => (
          <div
            className='skeleton-bar cio-pia-recs-skeleton__image'
            data-testid='cio-pia-recs-skeleton-card'
          />
        ),
      },
      content: {
        price: { reactNode: () => <div className='skeleton-bar cio-pia-recs-skeleton__price' /> },
        title: { reactNode: () => <div className='skeleton-bar cio-pia-recs-skeleton__title' /> },
        description: {
          // Two lines, not one. The card clamps its description at three lines and stretches every
          // card in a row to the tallest of them, so a single line lands short of where real
          // products settle.
          reactNode: () => (
            <div className='cio-pia-recs-skeleton__desc'>
              <div className='skeleton-bar' />
              <div className='skeleton-bar' />
            </div>
          ),
        },
      },
    },
  },
};

/**
 * Placeholders exist only to give the carousel something to lay out. They deliberately carry no
 * `id` and no `name`: `ProductCard` spreads those into `data-cnstrc-item-*`, and React omits an
 * attribute whose value is `undefined`, so a loading pod emits no product data attributes at all.
 */
const placeholderItems = (count: number) => Array.from({ length: count }, () => ({}) as Item);

/**
 * The product row, greyed out. It uses the real carousel rather than a set of measurements copied
 * out of the package, so its padding, its gaps, how many cards it fits at the current width and its
 * arrows are all right by construction. Matching the real heights is what keeps the page from
 * jumping when the data lands.
 */
export default function RecsCarouselSkeleton({
  count,
  componentOverride,
}: RecsCarouselSkeletonProps) {
  const skeleton = (
    <div
      className='cio-pia-recs-skeleton cio-pia-recs-skeleton--carousel'
      data-testid='cio-pia-recs-skeleton-carousel'
      aria-hidden='true'>
      <Carousel
        items={placeholderItems(count ?? DEFAULT_COUNT)}
        componentOverrides={CARD_SKELETON}
      />
    </div>
  );

  return (
    <RenderPropsWrapper props={{ skeleton }} override={componentOverride?.reactNode}>
      {skeleton}
    </RenderPropsWrapper>
  );
}

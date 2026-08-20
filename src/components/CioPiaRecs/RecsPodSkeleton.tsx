import React from 'react';
import {
  Carousel,
  CarouselOverrides,
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { Item, LoadingRenderProps } from '../../types';

/** Which block of the pod is being stood in for. Each shape matches the real thing's height. */
export type RecsPodSkeletonPart = 'carousel' | 'options';

interface RecsPodSkeletonProps {
  part: RecsPodSkeletonPart;
  /** How many placeholders to draw. Defaults to what that part usually holds. */
  count?: number;
  componentOverride?: ComponentOverrideProps<LoadingRenderProps>;
}

const DEFAULT_COUNTS: Record<RecsPodSkeletonPart, number> = {
  // The widest band the carousel lays out. Narrower ones need no count: its viewport clips the
  // overflow, exactly as it does for real cards.
  carousel: 6,
  options: 3,
};

/**
 * Grey bars standing in for a card's own sections. The card around them - white background,
 * rounded corners, shadow, padding - and the row it sits in are the real ones, so nothing here has
 * to know their measurements.
 *
 * `RenderPropsWrapper` draws an override in place of a section rather than alongside it, so these
 * appear even though the placeholder carries no image, price or name of its own.
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
 * Placeholder blocks shaped like the pod's own content.
 *
 * The Q&A loading skeleton draws text bars, which is right above a paragraph answer and wrong
 * above a product row, so the pod has its own. Matching the real heights is what keeps the page
 * from jumping when the data lands.
 *
 * The product row goes further and uses the real carousel, greying out only the sections inside
 * each card. Its padding, its gaps, how many cards it fits at the current width and its arrows are
 * then right by construction rather than by a set of measurements copied out of the package.
 */
export default function RecsPodSkeleton({ part, count, componentOverride }: RecsPodSkeletonProps) {
  const total = count ?? DEFAULT_COUNTS[part];

  const skeleton =
    part === 'carousel' ? (
      <div
        className='cio-pia-recs-skeleton cio-pia-recs-skeleton--carousel'
        data-testid='cio-pia-recs-skeleton-carousel'
        aria-hidden='true'>
        <Carousel items={placeholderItems(total)} componentOverrides={CARD_SKELETON} />
      </div>
    ) : (
      <div
        className={`cio-pia-recs-skeleton cio-pia-recs-skeleton--${part}`}
        data-testid={`cio-pia-recs-skeleton-${part}`}
        aria-hidden='true'>
        {Array.from({ length: total }, (_, index) => (
          <div key={index} className='skeleton-bar cio-pia-recs-skeleton__block' />
        ))}
      </div>
    );

  return (
    <RenderPropsWrapper props={{ skeleton }} override={componentOverride?.reactNode}>
      {skeleton}
    </RenderPropsWrapper>
  );
}

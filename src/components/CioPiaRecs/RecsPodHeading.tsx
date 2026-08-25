import React from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import RecsPodRefinedBy from './RecsPodRefinedBy';
import { AnswerRenderProps, Translations } from '../../types';

interface RecsPodHeadingProps {
  title: string;
  showRefinedBy: boolean;
  /** The text the products on screen were narrowed by. Empty until the shopper has refined. */
  refinedBy: string;
  translations?: Translations;
  componentOverride?: ComponentOverrideProps<AnswerRenderProps>;
}

/**
 * The block above the products: the title, and under it the line naming what they were narrowed by.
 * The two read as one thing and arrive together, which is why one block holds both.
 *
 * The refined-by line is the heading's sibling rather than its child. It describes the products, not
 * the heading, and nesting it would fold it into the heading's accessible name.
 *
 * Renders nothing when there is nothing to put here, rather than an empty block holding a line of
 * blank space above the products.
 */
export default function RecsPodHeading({
  title,
  showRefinedBy,
  refinedBy,
  translations,
  componentOverride,
}: RecsPodHeadingProps) {
  const applied = showRefinedBy ? refinedBy : '';

  if (!title && !applied) return null;

  return (
    <div className='cio-pia-recs-pod__heading'>
      {title && (
        <RenderPropsWrapper props={{ text: title }} override={componentOverride?.reactNode}>
          <h3 className='cio-pia-recs-pod__title'>{title}</h3>
        </RenderPropsWrapper>
      )}

      <RecsPodRefinedBy value={applied} translations={translations} />
    </div>
  );
}

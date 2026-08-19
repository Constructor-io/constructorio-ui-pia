import React, { useCallback, useMemo } from 'react';
import { RenderPropsWrapper } from '@constructor-io/constructorio-ui-components';
import Answer from '../Answer/Answer';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
import RecsPodRefinement from './RecsPodRefinement';
import RecsPodSkeleton from './RecsPodSkeleton';
import usePiaClient from '../../hooks/usePiaClient';
import useRecsPod from '../../hooks/useRecsPod';
import useViewportCallbacks from '../../hooks/useViewportCallbacks';
import { CioPiaRenderProps } from '../../types';
import type { CioPiaProps } from '../CioPia/types';

/**
 * A pod of AI-curated product suggestions: a personalized title, a row of products, and short
 * options for narrowing them down. It asks no questions and makes no Q&A requests, so a retailer
 * can use it on its own.
 *
 * Renders nothing at all once a request has settled with no products, so whatever the retailer
 * already had in that slot shows through instead of an empty shell. That is the default: a caller
 * that supplied its own root — `children` or `componentOverrides.reactNode` — still gets it in that
 * state, with `error` available, and decides what belongs there.
 */
export default function CioPiaRecs(props: CioPiaProps) {
  const {
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
    componentOverrides,
    callbacks,
    formatters,
    productCardProps,
    children,
    translations,
    recsPodParameters,
  } = props;
  const { priceCurrency } = productCardProps || {};
  const { showInput = true } = recsPodParameters || {};
  const {
    answer: answerOverride,
    carousel: carouselOverride,
    loading: loadingOverride,
    reactNode: rootOverride,
  } = componentOverrides || {};

  const { cioClient: client, threadId: resolvedThreadId } = usePiaClient({
    apiKey,
    threadId,
    cioClient,
  });

  const {
    title,
    items,
    refinement,
    isLoading,
    isFirstLoad,
    error,
    inputError,
    lastShopperInput,
    refine,
  } = useRecsPod({
    itemId,
    variationId,
    threadId: resolvedThreadId,
    cioClient: client,
    parameters: recsPodParameters,
    formatImageUrl: formatters?.formatImageUrl,
    translations,
  });

  const context = useMemo(
    () => ({ itemId, threadId: resolvedThreadId }),
    [itemId, resolvedThreadId],
  );
  const { containerRef } = useViewportCallbacks({ callbacks, context });

  const handleInputFocus = useCallback(() => callbacks?.onFocus?.(context), [callbacks, context]);

  const renderProps: CioPiaRenderProps = {
    items,
    isLoading,
    error,
    currentAnswer: title,
    currentQuestion: lastShopperInput,
    displayedQuestions: (refinement?.options || []).map((value) => ({ value })),
    handleSubmitQuestion: refine,
    conversationHistory: [],
  };

  // Nothing of ours to show. Rendering no markup at all is the default, so whatever the retailer
  // already had in that slot shows through instead of an empty shell. TODO: an interim, not a
  // settled decision — the empty-state design and the shape of a hard failure are both still open.
  // A caller who supplied its own root still gets it, with `error` in hand, so a consumer can put
  // its own message here.
  if (!isLoading && !items && !children && !rootOverride) return null;

  const className = isLoading
    ? 'cio-pia-container cio-pia-recs-pod cio-pia-recs-pod--loading'
    : 'cio-pia-container cio-pia-recs-pod';

  return (
    <div ref={containerRef} className={className} data-testid='cio-pia-recs-pod'>
      <RenderPropsWrapper props={renderProps} override={children || rootOverride}>
        {/*
          `key` is the title itself, so React remounts this node whenever the copy changes and
          replays the fade rather than swapping the text in place.
        */}
        <div key={title} className='cio-pia-recs-pod__title'>
          <Answer text={title} componentOverride={answerOverride} />
        </div>

        <div className='cio-pia-recs-pod__products' data-testid='cio-pia-recs-pod-products'>
          {isLoading || !items ? (
            <RecsPodSkeleton
              part='carousel'
              count={items?.length}
              componentOverride={loadingOverride}
            />
          ) : (
            <PiaCustomCarousel
              items={items}
              componentOverrides={carouselOverride}
              callbacks={callbacks}
              translations={translations}
              priceCurrency={priceCurrency}
            />
          )}
        </div>

        <RecsPodRefinement
          refinement={refinement}
          isLoading={isLoading}
          isFirstLoad={isFirstLoad}
          inputError={inputError}
          showInput={showInput}
          translations={translations}
          componentOverrides={componentOverrides}
          onRefine={refine}
          onSubmit={refine}
          onInputFocus={handleInputFocus}
        />
      </RenderPropsWrapper>
    </div>
  );
}

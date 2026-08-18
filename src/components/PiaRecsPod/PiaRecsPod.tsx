import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RenderPropsWrapper } from '@constructor-io/constructorio-ui-components';
import Answer from '../Answer/Answer';
import Disclaimer from '../CioPia/Disclaimer';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
import RecsPodRefinement from './RecsPodRefinement';
import RecsPodSkeleton from './RecsPodSkeleton';
import usePiaClient from '../../hooks/usePiaClient';
import useRecsPod from '../../hooks/useRecsPod';
import useTracking from '../../hooks/useTracking';
import useViewportCallbacks from '../../hooks/useViewportCallbacks';
import { CioPiaRenderProps } from '../../types';
import type { CioPiaProps } from '../CioPia/types';

/**
 * A pod of AI-curated product suggestions: a personalized title, a row of products, and short
 * options for narrowing them down. It asks no questions and makes no Q&A requests, so a retailer
 * can use it on its own.
 *
 * Renders nothing at all once a request has settled with no products, so whatever the retailer
 * already had in that slot shows through instead of an empty shell.
 */
export default function PiaRecsPod(props: CioPiaProps) {
  const {
    apiKey,
    itemId,
    itemName,
    threadId,
    variationId,
    cioClient,
    displayConfigs,
    componentOverrides,
    callbacks,
    formatters,
    productCardProps,
    children,
    translations,
    recsPodParameters,
  } = props;
  const { learnMoreUrl } = displayConfigs || {};
  const { priceCurrency } = productCardProps || {};
  const { showInput = true } = recsPodParameters || {};
  const {
    answer: answerOverride,
    carousel: carouselOverride,
    disclaimer: disclaimerOverride,
    loading: loadingOverride,
    reactNode: rootOverride,
  } = componentOverrides || {};

  const { cioClient: client, threadId: resolvedThreadId } = usePiaClient({
    apiKey,
    threadId,
    cioClient,
  });

  const tracking = useTracking({
    cioClient: client,
    itemId,
    itemName,
    variationId,
    threadId: resolvedThreadId,
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
    resultId,
    refine,
  } = useRecsPod({
    itemId,
    variationId,
    threadId: resolvedThreadId,
    cioClient: client,
    parameters: recsPodParameters,
    formatImageUrl: formatters?.formatImageUrl,
    translations,
    tracking,
  });

  const context = useMemo(
    () => ({ itemId, threadId: resolvedThreadId }),
    [itemId, resolvedThreadId],
  );
  const { containerRef } = useViewportCallbacks({ callbacks, context });

  // How tall the carousel is depends on the product images and on how far the names wrap, so the
  // placeholders cannot know it in advance. Measure the real thing while it is on screen and hold
  // that height through the next request, which is what stops the refinement row below from
  // moving under the shopper's cursor. There is nothing to measure on a first load, so the
  // placeholders fall back to their own height in CSS.
  const productsRef = useRef<HTMLDivElement>(null);
  const [heldProductsHeight, setHeldProductsHeight] = useState<number>();

  useEffect(() => {
    const element = productsRef.current;
    if (isLoading || !element) return undefined;

    const measure = () => {
      const { height } = element.getBoundingClientRect();
      // Returning the previous value when there is nothing to record is what keeps this from
      // re-rendering on every settled response.
      setHeldProductsHeight((previous) => height || previous);
    };
    measure();

    // The product images load after this effect first runs and the cards grow taller when they
    // do, so a single measurement here would hold a height ~40px short of the real one. Keep it
    // in step instead. `ResizeObserver` is missing in jsdom, where there is no layout to observe.
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [isLoading, items]);

  const handleSubmit = useCallback((value: string) => refine(value), [refine]);
  const handleInputFocus = useCallback(() => callbacks?.onFocus?.(context), [callbacks, context]);

  const renderProps: CioPiaRenderProps = {
    items,
    isLoading,
    error,
    currentAnswer: title,
    currentQuestion: lastShopperInput,
    displayedQuestions: (refinement?.options || []).map((value) => ({ value })),
    handleSubmitQuestion: handleSubmit,
    conversationHistory: [],
  };

  if (!isLoading && !items) return null;

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

        <div
          ref={productsRef}
          className='cio-pia-recs-pod__products'
          data-testid='cio-pia-recs-pod-products'
          style={isLoading ? { minHeight: heldProductsHeight } : undefined}>
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
              onResultClick={tracking.trackResultClick}
              // The click event is shared with Q&A, where this field holds the question that
              // produced the results. A pod has no question until something is refined.
              question={lastShopperInput || title}
              qnaResultId={resultId}
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
          onSubmit={handleSubmit}
          onInputFocus={handleInputFocus}
        />

        <Disclaimer
          learnMoreUrl={learnMoreUrl}
          translations={translations}
          componentOverride={disclaimerOverride}
        />
      </RenderPropsWrapper>
    </div>
  );
}

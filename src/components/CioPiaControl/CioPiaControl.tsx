import React from 'react';
import usePiaClient from '../../hooks/usePiaClient';
import useTracking from '../../hooks/useTracking';
import useViewportTracking from '../../hooks/useViewportTracking';
import type { CioPiaProps } from '../CioPia/types';

const NO_QUESTIONS: [] = [];

/**
 * What a control-group shopper gets instead of the widget: nothing to look at, but a node the
 * view event can be tied to, so both arms of an A/B test are measured the same way.
 *
 * None of the question or answer hooks mount here, so the control arm cannot issue a request.
 */
export default function CioPiaControl(props: CioPiaProps) {
  const { apiKey, itemId, itemName, threadId, variationId, cioClient, abTest, trackingConfigs } =
    props;

  const { cioClient: client, threadId: resolvedThreadId } = usePiaClient({
    apiKey,
    threadId,
    cioClient,
    testCells: abTest?.testCells,
  });

  const tracking = useTracking({
    cioClient: client,
    itemId,
    itemName,
    variationId,
    threadId: resolvedThreadId,
  });

  const { containerRef } = useViewportTracking({
    tracking,
    questions: NO_QUESTIONS,
    viewThreshold: trackingConfigs?.viewThreshold,
    awaitQuestions: false,
  });

  return (
    <div
      ref={containerRef}
      className='cio-pia-control-placeholder'
      data-testid='cio-pia-control-placeholder'
      style={{ width: 1, height: 1, padding: 0, border: 0, margin: 0, overflow: 'hidden' }}
      aria-hidden='true'
    />
  );
}

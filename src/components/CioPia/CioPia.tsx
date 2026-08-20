import React from 'react';
import CioPiaQna from './CioPiaQna';
import CioPiaRecs from '../CioPiaRecs/CioPiaRecs';
import type { CioPiaProps } from './types';

/**
 * Entry point for the component.
 *
 * Deliberately calls no hooks of its own: `CioPiaQna` calls `useCioPia` unconditionally and
 * `CioPiaRecs` calls `useRecsPod`, so anything that does not share a state machine has to be chosen
 * here, before the first hook runs. `props` is forwarded untouched so the defaults stay where they
 * are read.
 *
 * `mode` and `type` are independent axes, so `{ mode: 'recommendations', type: 'modal' }` is a
 * reachable combination and both have to be read. A modal is a conversation - `CioPiaQna` derives
 * `isConversation` from it, which switches on the conversation state machine - and the pod has no
 * modal variant, so the type keeps winning over the mode, exactly as before.
 */
export default function CioPia(props: CioPiaProps) {
  const mode = props.displayConfigs?.mode ?? 'default';

  if (mode === 'recommendations') {
    return <CioPiaRecs {...props} />;
  }

  return <CioPiaQna {...props} />;
}

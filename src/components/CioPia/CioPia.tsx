import React from 'react';
import CioPiaQna from './CioPiaQna';
import type { CioPiaProps } from './types';

export type { CioPiaProps };

/**
 * Entry point for the component.
 *
 * Deliberately calls no hooks of its own: `CioPiaQna` calls `useCioPia` unconditionally, so
 * anything that does not share that state machine has to be chosen here, before the first hook
 * runs. `props` is forwarded untouched so the defaults stay where they are read.
 */
export default function CioPia(props: CioPiaProps) {
  return <CioPiaQna {...props} />;
}

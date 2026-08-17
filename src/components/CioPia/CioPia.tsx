import React from 'react';
import CioPiaQna from './CioPiaQna';
import PiaRecsPod from '../PiaRecsPod/PiaRecsPod';
import type { CioPiaProps } from './types';

export type { CioPiaProps };

export default function CioPia(props: CioPiaProps) {
  const mode = props.displayConfigs?.mode ?? 'default';
  const type = props.displayConfigs?.type ?? 'inline';

  // A modal is a conversation, so it keeps winning over the mode, exactly as before.
  if (mode === 'recommendations' && type !== 'modal') return <PiaRecsPod {...props} />;

  return <CioPiaQna {...props} />;
}

import React from 'react';
import CioPiaQna from './CioPiaQna';
import CioPiaRecs from '../CioPiaRecs/CioPiaRecs';
import type { CioPiaProps } from './types';

export default function CioPia(props: CioPiaProps) {
  const mode = props.displayConfigs?.mode ?? 'default';
  const type = props.displayConfigs?.type ?? 'inline';

  // A modal is a conversation, so it keeps winning over the mode, exactly as before.
  if (mode === 'recommendations' && type !== 'modal') {
    return <CioPiaRecs {...props} />;
  } else {
    return <CioPiaQna {...props} />;
  }
}

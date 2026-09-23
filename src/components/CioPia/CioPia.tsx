import React from 'react';
import CioPiaQna from './CioPiaQna';
import CioPiaRecs from '../CioPiaRecs/CioPiaRecs';
import CioPiaControl from '../CioPiaControl/CioPiaControl';
import type { CioPiaProps } from './types';

export default function CioPia(props: CioPiaProps) {
  const mode = props.displayConfigs?.mode ?? 'default';

  // Before the mode dispatch: a control shopper gets no widget in any mode.
  if (props.abTest?.isControl) {
    return <CioPiaControl {...props} />;
  }

  if (mode === 'recommendations') {
    return <CioPiaRecs {...props} />;
  }

  return <CioPiaQna {...props} />;
}

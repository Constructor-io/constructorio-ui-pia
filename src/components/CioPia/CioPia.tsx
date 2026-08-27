import React from 'react';
import CioPiaQna from './CioPiaQna';
import CioPiaRecs from '../CioPiaRecs/CioPiaRecs';
import type { CioPiaProps } from './types';

export default function CioPia(props: CioPiaProps) {
  const mode = props.displayConfigs?.mode ?? 'default';

  if (mode === 'recommendations') {
    return <CioPiaRecs {...props} />;
  }

  return <CioPiaQna {...props} />;
}

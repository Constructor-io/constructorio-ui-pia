import React from 'react';
import CioPiaQna from './CioPiaQna';
import type { CioPiaProps } from './types';

export type { CioPiaProps };

export default function CioPia(props: CioPiaProps) {
  return <CioPiaQna {...props} />;
}

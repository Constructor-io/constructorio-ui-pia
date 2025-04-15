import React from 'react';
import { AsaPdpContextValue, CioAsaPdpProviderProps, IncludeRenderProps } from '../../types';
import { AsaPdpContext } from '../../hooks/useCioAsaPdpContext';
import useCioAsaPdpProvider from '../../hooks/useCioAsaPdpProvider';

export default function CioAsaPdpProvider(
  props: IncludeRenderProps<CioAsaPdpProviderProps, AsaPdpContextValue>,
) {
  const { children, ...rest } = props;
  const contextValue = useCioAsaPdpProvider(rest);

  return (
    <AsaPdpContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </AsaPdpContext.Provider>
  );
}

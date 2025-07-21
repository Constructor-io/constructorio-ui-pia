import React from 'react';
import { PiaContextValue, CioPiaProviderProps, IncludeRenderProps } from '../../types';
import { PiaContext } from '../../hooks/useCioPiaContext';
import useCioPiaProvider from '../../hooks/useCioPiaProvider';

export default function CioPiaProvider(
  props: IncludeRenderProps<CioPiaProviderProps, PiaContextValue>,
) {
  const { children, ...rest } = props;
  const contextValue = useCioPiaProvider(rest);

  return (
    <PiaContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </PiaContext.Provider>
  );
}

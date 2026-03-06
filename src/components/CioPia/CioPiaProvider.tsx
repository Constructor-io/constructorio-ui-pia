import React from 'react';
import { IncludeRenderProps } from '@constructor-io/constructorio-ui-components';
import { PiaContextValue, CioPiaProviderProps } from '../../types';
import { PiaContext } from '../../hooks/useCioPiaContext';
import useCioPiaProvider from '../../hooks/useCioPiaProvider';

export default function CioPiaProvider(
  props: CioPiaProviderProps & IncludeRenderProps<PiaContextValue>,
) {
  const { children, ...rest } = props;
  const contextValue = useCioPiaProvider(rest);

  return (
    <PiaContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </PiaContext.Provider>
  );
}

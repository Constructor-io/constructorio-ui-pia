import React, { createContext, useContext } from 'react';
import { PiaContextValue } from '../types';

export const PiaContext = createContext<PiaContextValue | null>(null);
PiaContext.displayName = 'PiaContext'; // For identification of the context in React DevTools

/**
 * This hook provides access to the PiaContext.
 * Should only be used within a component that is a descendant of the PiaProvider.
 * @returns The PiaContext value.
 */
export function useCioPiaContext() {
  return useContext(PiaContext as React.Context<PiaContextValue>);
}

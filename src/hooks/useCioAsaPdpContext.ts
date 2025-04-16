import React, { createContext, useContext } from 'react';
import { AsaPdpContextValue } from '../types';

export const AsaPdpContext = createContext<AsaPdpContextValue | null>(null);
AsaPdpContext.displayName = 'AsaPdpContext'; // For identification of the context in React DevTools

/**
 * This hook provides access to the AsaPdpContext.
 * Should only be used within a component that is a descendant of the AsaPdpProvider.
 * @returns The AsaPdpContext value.
 */
export function useCioAsaPdpContext() {
  return useContext(AsaPdpContext as React.Context<AsaPdpContextValue>);
}

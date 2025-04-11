"use client";

import { createContext, useContext } from 'react';
import { TurboAptosContextType } from './types';

/**
 * React context for the TurboAptos guided tour system
 */
export const TurboAptosContext = createContext<TurboAptosContextType | undefined>(undefined);

/**
 * Hook to access the TurboAptos context
 * @returns The TurboAptos context
 * @throws Error if used outside of a TurboAptosProvider
 */
export function useTurboAptos(): TurboAptosContextType {
  const context = useContext(TurboAptosContext);
  
  if (context === undefined) {
    throw new Error('useTurboAptos must be used within a TurboAptosProvider');
  }
  
  return context;
}
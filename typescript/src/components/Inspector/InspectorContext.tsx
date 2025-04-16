"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { InspectorOverlay } from './InspectorOverlay';

interface InspectorContextType {
  isActive: boolean;
  activateInspector: () => void;
  deactivateInspector: () => void;
  activeElementId: string | null;
  setActiveElementId: (id: string | null) => void;
  elementDescriptions: Record<string, string>;
  registerDescription: (id: string, description: string) => void;
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined);

export interface InspectorProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the Inspector functionality
 * Manages state for inspector mode and provides context to child components
 */
export function InspectorProvider({ children }: InspectorProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [elementDescriptions, setElementDescriptions] = useState<Record<string, string>>({});
  
  const activateInspector = () => setIsActive(true);
  const deactivateInspector = () => {
    setIsActive(false);
    setActiveElementId(null);
  };
  
  // Register a description when a component mounts
  const registerDescription = useCallback((id: string, description: string) => {
    setElementDescriptions(prev => ({
      ...prev,
      [id]: description
    }));
  }, []);
  
  // Handle escape key to exit inspector mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        deactivateInspector();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
  
  return (
    <InspectorContext.Provider
      value={{
        isActive,
        activateInspector,
        deactivateInspector,
        activeElementId,
        setActiveElementId,
        elementDescriptions,
        registerDescription
      }}
    >
      {children}
      {isActive && <InspectorOverlay />}
    </InspectorContext.Provider>
  );
}

/**
 * Hook to access the Inspector context
 * @returns The Inspector context
 */
export function useInspector() {
  const context = useContext(InspectorContext);
  if (context === undefined) {
    throw new Error('useInspector must be used within an InspectorProvider');
  }
  return context;
}
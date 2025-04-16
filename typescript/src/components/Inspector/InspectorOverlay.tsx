"use client";

import React from 'react';
import { useInspector } from './InspectorContext';
import { InspectorInfoPanel } from './InspectorInfoPanel';

/**
 * Overlay component that darkens the screen in Inspector mode
 * and includes the fixed info panel
 */
export function InspectorOverlay() {
  const { deactivateInspector } = useInspector();
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 z-40 overflow-hidden"
        onClick={deactivateInspector}
        aria-label="Exit inspector mode"
        role="button"
        tabIndex={0}
      >
        <div className="fixed top-4 right-4 bg-white rounded-md px-3 py-2 text-sm">
          Press ESC to exit inspector mode
        </div>
      </div>
      <InspectorInfoPanel />
    </>
  );
}
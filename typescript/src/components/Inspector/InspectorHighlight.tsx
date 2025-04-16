"use client";

import React, { useRef, useEffect } from 'react';
import { useInspector } from './InspectorContext';

export interface InspectorHighlightProps {
  elementId: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Wrapper component that highlights elements in Inspector mode
 * without causing layout shifts
 */
export function InspectorHighlight({ 
  elementId, 
  description, 
  children 
}: InspectorHighlightProps) {
  const { isActive, activeElementId, setActiveElementId, registerDescription } = useInspector();
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Register this element's description when mounted
  useEffect(() => {
    registerDescription(elementId, description);
  }, [elementId, description, registerDescription]);
  
  // Skip wrapping when inspector is not active
  if (!isActive) {
    return <>{children}</>;
  }
  
  const isElementActive = activeElementId === elementId;
  
  return (
    <div 
      ref={elementRef}
      className={`relative ${isElementActive ? 'inspector-active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setActiveElementId(elementId);
      }}
      onMouseEnter={() => setActiveElementId(elementId)}
      onMouseLeave={() => setActiveElementId(null)}
      data-inspector-highlight="true"
    >
      {children}
      <div className="absolute inset-0 bg-purple-500/20 rounded-md pointer-events-none" />
    </div>
  );
}
"use client";

import React, { useEffect, useState } from 'react';
import { useTurboAptos } from './TurboAptosContext';

interface HighlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Component that creates a visual highlight around the target element of the current tour step
 */
export function TourHighlight() {
  const { currentStep, isTourActive } = useTurboAptos();
  const [position, setPosition] = useState<HighlightPosition | null>(null);
  
  // Update position when the current step or window size changes
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    if (!isTourActive || !currentStep?.targetSelector) {
      setPosition(null);
      return;
    }
    
    // Function to calculate and set the position of the target element
    const updatePosition = () => {
      const targetElement = document.querySelector(currentStep.targetSelector!);
      if (!targetElement) {
        setPosition(null);
        return;
      }
      
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      });
    };
    
    // Initial position calculation
    updatePosition();
    
    // Update position on window resize
    window.addEventListener('resize', updatePosition);
    
    // Update position on scroll
    window.addEventListener('scroll', updatePosition);
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, isTourActive]);
  
  // Don't render anything if no position is set
  if (!position) {
    return null;
  }
  
  return (
    <div
      className="absolute pointer-events-none z-40 transition-all duration-300 ease-in-out"
      style={{
        top: `${position.top - 5}px`,
        left: `${position.left - 5}px`,
        width: `${position.width + 10}px`,
        height: `${position.height + 10}px`,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 15px rgba(111, 75, 213, 0.7)',
        borderRadius: '4px',
        border: '2px solid rgba(111, 75, 213, 0.7)',
        animation: 'pulse-highlight 2s infinite'
      }}
    />
  );
}

// Add the animation to the global styles in layout.tsx or a separate CSS file
// @keyframes pulse-highlight {
//   0%, 100% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 15px rgba(111, 75, 213, 0.7); }
//   50% { box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 25px rgba(111, 75, 213, 0.9); }
// }
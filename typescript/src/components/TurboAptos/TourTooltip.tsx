"use client";

import React, { useEffect, useState } from 'react';
import { useTurboAptos } from './TurboAptosContext';

interface TooltipPosition {
  top: number;
  left: number;
}

/**
 * Component that displays a tooltip with the current tour step's content
 */
export function TourTooltip() {
  const { 
    currentStep, 
    currentStepIndex, 
    activeTour,
    isTourActive, 
    nextStep, 
    prevStep, 
    skipTour 
  } = useTurboAptos();
  
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  
  // Calculate tooltip position based on target element and preferred position
  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === 'undefined') return;
    if (!isTourActive || !currentStep) {
      return;
    }
    
    // If no target selector, center in viewport
    if (!currentStep.targetSelector) {
      setPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 150
      });
      return;
    }
    
    const calculatePosition = () => {
      const targetElement = document.querySelector(currentStep.targetSelector!);
      if (!targetElement) {
        // Default position if target not found
        setPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 150
        });
        return;
      }
      
      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 300;
      const tooltipHeight = 200;
      const margin = 20; // Space between target and tooltip
      
      let top = 0;
      let left = 0;
      
      // Calculate position based on specified position
      switch (currentStep.position) {
        case 'top':
          top = rect.top + window.scrollY - tooltipHeight - margin;
          left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'right':
          top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + window.scrollX + margin;
          break;
        case 'bottom':
          top = rect.bottom + window.scrollY + margin;
          left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left + window.scrollX - tooltipWidth - margin;
          break;
      }
      
      // Ensure tooltip stays within viewport
      if (left < 10) left = 10;
      if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
      }
      
      if (top < 10) top = 10;
      
      // Check if the tooltip would go off the bottom of the screen
      if (top + tooltipHeight > window.innerHeight + window.scrollY - 10) {
        // Try positioning above the target instead
        top = rect.top + window.scrollY - tooltipHeight - margin;
        
        // If that would go off the top, put it at the top with a small margin
        if (top < 10) top = 10;
      }
      
      // Special case for elements at the bottom-right corner (like Secret Button in step 8)
      if (rect.bottom > window.innerHeight - 100 && rect.right > window.innerWidth - 100) {
        console.log('Bottom-right element detected, repositioning tooltip');
        // Position tooltip above and to the left of the element
        top = rect.top + window.scrollY - tooltipHeight - margin * 2;
        left = rect.left + window.scrollX - tooltipWidth / 2;
        
        // Ensure we're still within bounds
        if (left < 10) left = 10;
        if (top < 10) top = 10;
      }
      
      // Special case for the Secret Button step in How to Use tour
      if (
        activeTour?.id === 'how-to-use' &&
        currentStepIndex === 7 && // 0-indexed, so 7 is the 8th step
        currentStep.targetSelector?.includes('secret-button')
      ) {
        console.log('Secret button step detected, applying special positioning');
        // Always position tooltip above and to the left of the secret button
        top = rect.top + window.scrollY - tooltipHeight - margin * 2;
        left = Math.max(10, rect.left + window.scrollX - tooltipWidth / 2);
      }
      
      setPosition({ top, left });
    };
    
    // Calculate initial position
    calculatePosition();
    
    // Recalculate on resize
    window.addEventListener('resize', calculatePosition);
    
    // Recalculate on scroll
    window.addEventListener('scroll', calculatePosition);
    
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [currentStep, isTourActive]);
  
  // Don't render anything if tour is not active
  if (!isTourActive || !currentStep || !activeTour) {
    return null;
  }
  
  // Calculate progress percentage
  const progress = ((currentStepIndex + 1) / activeTour.steps.length) * 100;
  
  return (
    <>
      {/* Dark overlay to highlight the focused element */}
      <div
        className="fixed inset-0 bg-black/80 z-40 transition-opacity duration-300"
        style={{
          opacity: isTourActive ? 0.5 : 0,
          pointerEvents: isTourActive ? 'auto' : 'none'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks through the overlay
      />
      
      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl p-4 w-[300px] tour-tooltip"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          maxHeight: '400px',
          overflowY: 'auto'
        }}
      >
      {/* Tour Title */}
      <div className="text-sm text-gray-500 mb-1">
        {activeTour.title} ({currentStepIndex + 1}/{activeTour.steps.length})
      </div>
      
      {/* Step Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {currentStep.title}
      </h3>
      
      {/* Step Content */}
      <div className="text-sm text-gray-600 mb-4 max-h-[150px] overflow-y-auto">
        {currentStep.content}
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-200 rounded mb-4">
        <div 
          className="h-full bg-purple-600 rounded transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <div>
          {currentStepIndex > 0 ? (
            <button
              onClick={prevStep}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain layout
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={skipTour}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Skip
          </button>
          
          <button
            onClick={nextStep}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center"
          >
            {currentStepIndex < activeTour.steps.length - 1 ? (
              <>
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : 'Finish'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
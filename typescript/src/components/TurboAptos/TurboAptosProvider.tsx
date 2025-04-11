"use client";

import React, { useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { TurboAptosContext } from './TurboAptosContext';
import { Tour } from './types';

interface TurboAptosProviderProps {
  children: ReactNode;
  tours: Tour[];
}

/**
 * Provider component for the TurboAptos guided tour system
 */
export function TurboAptosProvider({ children, tours }: TurboAptosProviderProps) {
  // Convert tours array to a record for easy access by ID
  const toursRecord = useMemo(() => {
    return tours.reduce<Record<string, Tour>>((acc, tour) => {
      acc[tour.id] = tour;
      return acc;
    }, {});
  }, [tours]);

  // State for tracking tour progress
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Derive active tour and current step from state
  const activeTour = activeTourId ? toursRecord[activeTourId] : null;
  const currentStep = activeTour && activeTour.steps.length > currentStepIndex 
    ? activeTour.steps[currentStepIndex] 
    : null;

  // Load completed tours from localStorage
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  
  useEffect(() => {
    setIsMounted(true);
    // Get completed tours from localStorage - only run on client side
    if (typeof window !== 'undefined') {
      const loadCompletedTours = () => {
        try {
          const saved = localStorage.getItem('turboAptos_completedTours');
          return saved ? JSON.parse(saved) : [];
        } catch (error) {
          console.error('Failed to load completed tours from localStorage:', error);
          return [];
        }
      };
      
      setCompletedTours(loadCompletedTours());
    }
  }, []);

  // Save completed tours to localStorage
  const saveCompletedTour = useCallback((tourId: string) => {
    if (!isMounted || typeof window === 'undefined') return;
    
    const updatedCompletedTours = [...completedTours, tourId];
    setCompletedTours(updatedCompletedTours);
    
    try {
      localStorage.setItem('turboAptos_completedTours', JSON.stringify(updatedCompletedTours));
    } catch (error) {
      console.error('Failed to save completed tour to localStorage:', error);
    }
  }, [completedTours, isMounted]);

  // Function to start a tour
  const startTour = useCallback((tourId: string) => {
    if (!toursRecord[tourId]) {
      console.error(`Tour with ID "${tourId}" not found`);
      return;
    }
    
    setActiveTourId(tourId);
    setCurrentStepIndex(0);
  }, [toursRecord]);

  // Function to end the current tour
  const endTour = useCallback(() => {
    if (activeTourId) {
      // Execute the onComplete callback if it exists
      if (activeTour?.onComplete) {
        activeTour.onComplete();
      }
      
      // Save as completed
      saveCompletedTour(activeTourId);
    }
    
    setActiveTourId(null);
    setCurrentStepIndex(0);
  }, [activeTour, activeTourId, saveCompletedTour]);

  // Function to navigate to the next step
  const nextStep = useCallback(() => {
    if (!activeTour) return;
    
    if (currentStepIndex < activeTour.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // End tour if we're at the last step
      endTour();
    }
  }, [activeTour, currentStepIndex, endTour]);

  // Function to navigate to the previous step
  const prevStep = useCallback(() => {
    if (!activeTour) return;
    
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [activeTour, currentStepIndex]);

  // Function to skip the current tour
  const skipTour = useCallback(() => {
    if (activeTourId) {
      // Mark as completed without running the onComplete callback
      saveCompletedTour(activeTourId);
    }
    
    setActiveTourId(null);
    setCurrentStepIndex(0);
  }, [activeTourId, saveCompletedTour]);

  // Effect to execute the action of the current step
  useEffect(() => {
    if (currentStep?.action) {
      try {
        currentStep.action();
      } catch (error) {
        console.error('Error executing tour step action:', error);
      }
    }
  }, [currentStep]);

  // Effect to handle target element detection
  useEffect(() => {
    if (!currentStep?.targetSelector || !currentStep.waitForElement) return;
    
    const targetElement = document.querySelector(currentStep.targetSelector);
    if (!targetElement) {
      // If element not found and waiting is required, setup an observer
      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(currentStep.targetSelector!);
        if (element) {
          obs.disconnect();
          // Element found, could trigger a re-render or other actions
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      return () => observer.disconnect();
    }
  }, [currentStep]);

  // Create context value
  const contextValue = useMemo(() => ({
    tours: toursRecord,
    activeTour,
    currentStep,
    currentStepIndex,
    startTour,
    endTour,
    nextStep,
    prevStep,
    skipTour,
    isTourActive: !!activeTour
  }), [
    toursRecord,
    activeTour,
    currentStep,
    currentStepIndex,
    startTour,
    endTour,
    nextStep,
    prevStep,
    skipTour
  ]);

  return (
    <TurboAptosContext.Provider value={contextValue}>
      {children}
    </TurboAptosContext.Provider>
  );
}
"use client";

import { ReactNode } from "react";

/**
 * Represents a single step in a guided tour
 */
export interface TourStep {
  id: string;
  title: string;
  content: ReactNode;
  targetSelector?: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  action?: () => void | Promise<void>;
  waitForElement?: boolean;
}

/**
 * Represents a complete guided tour
 */
export interface Tour {
  id: string;
  title: string;
  description: string;
  steps: TourStep[];
  onComplete?: () => void;
}

/**
 * Context for managing guided tours
 */
export interface TurboAptosContextType {
  tours: Record<string, Tour>;
  activeTour: Tour | null;
  currentStep: TourStep | null;
  currentStepIndex: number;
  startTour: (tourId: string) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  isTourActive: boolean;
}
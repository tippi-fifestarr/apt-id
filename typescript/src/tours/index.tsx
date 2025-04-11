"use client";

// Export all tours from a single file for easy import

import { howToUseTour } from './HowToUseTour';
import { componentMapTour } from './ComponentMapTour';

export { howToUseTour, componentMapTour };

// Collection of all tours for use with TurboAptosProvider
export const allTours = [
  howToUseTour,
  componentMapTour
];
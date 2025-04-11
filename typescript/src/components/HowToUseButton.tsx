"use client";

import React from 'react';
import { useTurboAptos } from './TurboAptos';

/**
 * Button that starts the "How to Use" guided tour
 * Positioned in the bottom-right corner, above the Feedback Button
 */
export function HowToUseButton() {
  const { startTour } = useTurboAptos();
  
  return (
    <button 
      onClick={() => startTour('how-to-use')}
      className="fixed bottom-24 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
      aria-label="Learn how to use Apt-ID"
    >
      <span role="img" aria-hidden="true">🧭</span>
      How to Use
    </button>
  );
}
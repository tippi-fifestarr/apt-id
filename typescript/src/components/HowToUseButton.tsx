"use client";

import React from 'react';
import { useTurboAptos } from './TurboAptos';

/**
 * Button that starts the "How to Use" guided tour
 * To be used within the ButtonStack component
 */
export function HowToUseButton() {
  const { startTour } = useTurboAptos();
  
  return (
    <button
      onClick={() => startTour('how-to-use')}
      className="how-to-use-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
      aria-label="Learn how to use Apt-ID"
    >
      <span role="img" aria-hidden="true">🧭</span>
      How to Use
    </button>
  );
}
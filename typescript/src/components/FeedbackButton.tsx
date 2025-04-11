"use client";

import React, { useState } from 'react';
import { FeedbackModal } from './FeedbackModal';

/**
 * Button that opens the feedback modal
 * Positioned in the bottom-right corner, above the Secret Button
 */
export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-4 z-40 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
        aria-label="Provide feedback"
      >
        <span role="img" aria-hidden="true">💬</span>
        Feedback
      </button>
      
      <FeedbackModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
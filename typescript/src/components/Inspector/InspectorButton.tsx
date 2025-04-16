"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { useInspector } from './InspectorContext';

export interface InspectorButtonProps {
  className?: string;
}

/**
 * Button that activates the Inspector mode
 * Styled to exactly match the Save Changes button
 */
export function InspectorButton({ className = '' }: InspectorButtonProps) {
  const { activateInspector } = useInspector();
  
  return (
    <button
      onClick={activateInspector}
      className={`w-full px-4 py-[14px] sm:py-4 text-[14px] sm:text-[16px] font-semibold
                text-center bg-white/90 hover:bg-white rounded-[14px] transition-all
                text-black shadow-md hover:scale-[1.02]
                ${className}`}
      aria-label="Activate inspector mode"
    >
      <div className="flex items-center justify-center gap-2">
        <Search size={16} />
        <span>Activate Inspector! 🔍</span>
      </div>
    </button>
  );
}
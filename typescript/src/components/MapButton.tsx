"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Map } from 'lucide-react';
import { ComponentMapDialog } from './ComponentMapDialog';

/**
 * Button that opens the interactive Aptos Component Map
 * To be used at the top of the ButtonStack
 * 3x larger for better visibility
 */
export function MapButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800
                  text-white p-8 rounded-2xl shadow-2xl hover:shadow-2xl
                  transition-all duration-300 flex items-center justify-center
                  w-20 h-20 min-w-20 min-h-20 border-2 border-indigo-400/50"
        aria-label="View Aptos Map"
        title="View Aptos Component Map"
      >
        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
          <Map size={40} strokeWidth={2.5} className="drop-shadow-xl" />
        </div>
      </Button>
      
      {/* Interactive Component Map Dialog with TurboTax-style experience */}
      <ComponentMapDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Map } from 'lucide-react';

/**
 * Button that shows a placeholder for the upcoming Aptos Map feature
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
        title="View Aptos Map"
      >
        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
          <Map size={40} strokeWidth={2.5} className="drop-shadow-xl" />
        </div>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Aptos Ecosystem Map</DialogTitle>
            <DialogDescription className="text-center text-lg">
              Coming Soon!
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-8 text-center space-y-6">
            <div className="mx-auto w-48 h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-inner flex items-center justify-center">
              <Map size={96} className="text-indigo-500 drop-shadow" />
            </div>
            <p className="text-gray-700 text-lg">
              The interactive Aptos ecosystem map will be available in the next update.
            </p>
            <p className="text-gray-500">
              Explore the connections between different components and understand how they work together. 
              The map will provide a comprehensive visual overview of the entire Aptos development ecosystem.
            </p>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-3 text-lg"
            onClick={() => setIsOpen(false)}
          >
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
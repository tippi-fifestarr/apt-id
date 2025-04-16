"use client";

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ComponentMap } from "./ComponentMap";
import { useTurboAptos } from "./TurboAptos";

interface ComponentMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog component that displays the interactive component map
 * Opens when the MapButton is clicked
 */
export function ComponentMapDialog({ open, onOpenChange }: ComponentMapDialogProps) {
  const { startTour } = useTurboAptos();
  
  // Start component map tour when dialog opens
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (open && localStorage.getItem('componentMapTourCompleted') !== 'true') {
      // Small delay to ensure everything is rendered
      const timer = setTimeout(() => {
        startTour('component-map');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [open, startTour]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-purple-600">✨</span>
            Aptos Ecosystem Component Map
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto p-4 h-[70vh]">
          <ComponentMap />
        </div>
      </DialogContent>
    </Dialog>
  );
}
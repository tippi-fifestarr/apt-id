"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ComponentMap } from "./ComponentMap";

interface ComponentMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog component that displays the interactive component map
 * Only shown when activated by the SecretButton
 */
export function ComponentMapDialog({ open, onOpenChange }: ComponentMapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-purple-600">✨</span>
            Aptos Ecosystem Component Map
            <span className="text-xs text-gray-500 ml-2">(Secret Access)</span>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto p-4 h-[70vh]">
          <ComponentMap />
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useAllowlistedName } from "@/hooks/useAllowlistedName";
import { ComponentMapDialog } from "./ComponentMapDialog";

/**
 * A secret button that appears only for users with allowlisted ANS names
 * Provides access to the interactive component map
 * To be used within the ButtonStack component
 */
export function SecretButton() {
  const { isAllowlisted, loading } = useAllowlistedName();
  const [isOpen, setIsOpen] = useState(false);

  // Only render the button if the user has an allowlisted ANS name
  if (loading || !isAllowlisted) {
    return null;
  }

  return (
    <>
      <div className="secret-button">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                     shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse group"
        >
          <span className="mr-2 group-hover:animate-spin">✨</span>
          View Component Map
        </Button>
      </div>
      
      <ComponentMapDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
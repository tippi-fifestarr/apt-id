"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useAllowlistedName } from "@/hooks/useAllowlistedName";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog";
import { HackathonLinkTree } from "./HackathonLinkTree";
import { Award } from "lucide-react";

/**
 * A secret button that appears only for users with allowlisted ANS names
 * Provides access to a LinkTree of hackathon resources discovered during the guided experience
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
          <Award className="mr-2 w-5 h-5 group-hover:animate-spin" />
          Hackathon Resources
        </Button>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-purple-600">✨</span>
              Your Hackathon Resources
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto p-4 h-[70vh]">
            <HackathonLinkTree />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
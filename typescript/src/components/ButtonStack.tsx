"use client";

import { useAllowlistedName } from "@/hooks/useAllowlistedName";
import { HowToUseButton } from "./HowToUseButton";
import { FeedbackButton } from "./FeedbackButton";
import { SecretButton } from "./SecretButton";

/**
 * Component that organizes and conditionally renders the button stack
 * in the bottom-right corner of the screen
 */
export function ButtonStack() {
  const { isAllowlisted, loading } = useAllowlistedName();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 max-h-[calc(100vh-48px)] overflow-y-auto">
      {/* Only show How to Use button if Secret Button is not visible */}
      {!isAllowlisted && !loading && (
        <div className="how-to-use-container">
          <HowToUseButton />
        </div>
      )}
      
      {/* Always show Feedback button */}
      <div className="feedback-container">
        <FeedbackButton />
      </div>
      
      {/* Only show Secret Button for allowlisted users */}
      {isAllowlisted && !loading && (
        <div className="secret-button-container">
          <SecretButton />
        </div>
      )}
    </div>
  );
}
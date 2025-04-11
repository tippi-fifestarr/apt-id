# Apt-ID Enhancement Implementation Plan

This document outlines the comprehensive implementation plan for enhancing Apt-ID with:
1. Fixed tooltip positioning to prevent off-screen issues
2. Improved button stack with conditional rendering
3. True TurboTax-style component map with active user participation

## Phase 1: Fix Tooltip Positioning

The first priority is to fix the tooltip positioning issue in the How to Use tour, particularly for step 8 (Secret Button).

### Implementation Tasks

1. **Update TourTooltip Component**
   - Enhance boundary checking in positioning calculation
   - Add special case handling for bottom-right elements
   - Make tooltips scrollable for lengthy content
   - Add automatic viewport adjustment

```typescript
// In TourTooltip.tsx
const calculatePosition = () => {
  // Existing position calculation...
  
  // Enhanced boundary checking
  if (left + tooltipWidth > window.innerWidth - 10) {
    left = window.innerWidth - tooltipWidth - 10;
  }
  
  // Special case for Secret Button (step 8)
  if (activeTour?.id === 'how-to-use' && 
      currentStepIndex === 7 && 
      currentStep?.targetSelector === '.secret-button') {
    top = rect.top + window.scrollY - tooltipHeight - 40;
    left = Math.max(10, rect.left + window.scrollX - tooltipWidth / 2);
  }
  
  return { top, left };
};
```

## Phase 2: Button Stack Optimization

Create a button stack component that properly positions and conditionally renders buttons.

### Implementation Tasks

1. **Create ButtonStack Component**

```typescript
// components/ButtonStack.tsx
"use client";

import { useAllowlistedName } from "@/hooks/useAllowlistedName";
import { HowToUseButton } from "./HowToUseButton";
import { FeedbackButton } from "./FeedbackButton";
import { SecretButton } from "./SecretButton";

export function ButtonStack() {
  const { isAllowlisted, loading } = useAllowlistedName();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 max-h-[calc(100vh-48px)] overflow-y-auto">
      {/* Only show How to Use button if Secret Button is not visible */}
      {!isAllowlisted && !loading && <HowToUseButton />}
      
      {/* Always show Feedback button */}
      <FeedbackButton />
      
      {/* Only show Secret Button for allowlisted users */}
      {isAllowlisted && !loading && <SecretButton />}
    </div>
  );
}
```

2. **Update Individual Button Components**
   - Remove fixed positioning from individual buttons
   - Focus on internal button styling only

3. **Update Root Layout**
   - Replace individual buttons with ButtonStack

## Phase 3: TurboTax-Style Component Map

Transform the Component Map into a true TurboTax-style experience with sequential steps and active user participation.

### Implementation Tasks

1. **Define Component Map Modes**

```typescript
// types/component-map.ts
export type ComponentMapMode = 'map' | 'turboApt';

export interface DecisionPoint {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  options: DecisionOption[];
  linkChallenge?: LinkChallenge;
  completion?: {
    message: string;
    nextStepId?: string;
  };
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  nextStepId?: string;
  isRecommended?: boolean;
}

export interface LinkChallenge {
  prompt: string;
  hint?: string;
  expectedDomain?: string;
}

export interface UserProgress {
  completedSteps: string[];
  selectedOptions: Record<string, string>;
  providedLinks: Record<string, string>;
  lastStepId: string;
}
```

2. **Create Decision Wizard Component**

```typescript
// components/DecisionWizard.tsx
"use client";

import { useState, useEffect } from 'react';
import { DecisionPoint, UserProgress } from '@/types/component-map';
import { LinkChallengeComponent } from './LinkChallengeComponent';
import { Button } from './ui/button';

interface DecisionWizardProps {
  decisionPoints: DecisionPoint[];
  onComplete: () => void;
}

export function DecisionWizard({ decisionPoints, onComplete }: DecisionWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedSteps: [],
    selectedOptions: {},
    providedLinks: {},
    lastStepId: decisionPoints[0]?.id || ''
  });
  const [canProceed, setCanProceed] = useState(false);
  
  // Load saved progress
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedProgress = localStorage.getItem('componentMapProgress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setUserProgress(parsed);
        
        // Find the index of the last step
        const lastStepIndex = decisionPoints.findIndex(p => p.id === parsed.lastStepId);
        if (lastStepIndex >= 0) {
          setCurrentStepIndex(lastStepIndex);
        }
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
  }, [decisionPoints]);
  
  // Check if user can proceed
  useEffect(() => {
    const currentStep = decisionPoints[currentStepIndex];
    if (!currentStep) return;
    
    // Can proceed if:
    // 1. User has selected an option OR
    // 2. If there's a link challenge, user has provided a valid link OR
    // 3. Step is already completed
    const hasSelectedOption = !!userProgress.selectedOptions[currentStep.id];
    const hasProvidedLink = currentStep.linkChallenge 
      ? !!userProgress.providedLinks[currentStep.id]
      : true;
    const isCompleted = userProgress.completedSteps.includes(currentStep.id);
    
    setCanProceed(hasSelectedOption && hasProvidedLink || isCompleted);
  }, [currentStepIndex, decisionPoints, userProgress]);
  
  // Save progress
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('componentMapProgress', JSON.stringify(userProgress));
  }, [userProgress]);
  
  const currentStep = decisionPoints[currentStepIndex];
  
  const handleOptionSelect = (optionId: string) => {
    setUserProgress(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [currentStep.id]: optionId
      }
    }));
  };
  
  const handleLinkSubmit = (link: string) => {
    setUserProgress(prev => ({
      ...prev,
      providedLinks: {
        ...prev.providedLinks,
        [currentStep.id]: link
      }
    }));
  };
  
  const goToNext = () => {
    // Mark current step as completed
    if (!userProgress.completedSteps.includes(currentStep.id)) {
      setUserProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, currentStep.id],
        lastStepId: currentStep.id
      }));
    }
    
    // Find next step based on selected option
    const selectedOption = userProgress.selectedOptions[currentStep.id];
    const option = currentStep.options.find(o => o.id === selectedOption);
    
    if (option?.nextStepId) {
      // Go to the specific next step
      const nextIndex = decisionPoints.findIndex(p => p.id === option.nextStepId);
      if (nextIndex >= 0) {
        setCurrentStepIndex(nextIndex);
        return;
      }
    }
    
    // Default: go to next step in sequence
    if (currentStepIndex < decisionPoints.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  const goToPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  if (!currentStep) return null;
  
  return (
    <div className="decision-wizard">
      <h3 className="text-xl font-bold mb-4">Step {currentStepIndex + 1}: {currentStep.title}</h3>
      
      <div className="decision-content mb-6">
        {currentStep.content}
      </div>
      
      {/* Options for this decision */}
      <div className="decision-options mb-6">
        <h4 className="text-lg font-semibold mb-2">Choose an option:</h4>
        <div className="grid gap-3">
          {currentStep.options.map(option => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all
                ${userProgress.selectedOptions[currentStep.id] === option.id 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
                }
                ${option.isRecommended ? 'border-l-4 border-l-green-500' : ''}
              `}
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
              {option.isRecommended && (
                <div className="text-xs text-green-600 mt-1">Recommended</div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Link Challenge if present */}
      {currentStep.linkChallenge && (
        <div className="link-challenge mb-6">
          <LinkChallengeComponent
            challenge={currentStep.linkChallenge}
            onComplete={handleLinkSubmit}
            completed={!!userProgress.providedLinks[currentStep.id]}
            savedLink={userProgress.providedLinks[currentStep.id]}
          />
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="navigation-controls flex justify-between">
        <Button 
          variant="outline" 
          disabled={currentStepIndex === 0}
          onClick={goToPrevious}
        >
          Previous
        </Button>
        
        <Button 
          disabled={!canProceed}
          onClick={goToNext}
        >
          {currentStepIndex < decisionPoints.length - 1 ? 'Next' : 'Complete'}
        </Button>
      </div>
    </div>
  );
}
```

3. **Create Link Challenge Component**

```typescript
// components/LinkChallengeComponent.tsx
"use client";

import { useState, useEffect } from 'react';
import { LinkChallenge } from '@/types/component-map';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LinkChallengeComponentProps {
  challenge: LinkChallenge;
  onComplete: (link: string) => void;
  completed: boolean;
  savedLink?: string;
}

export function LinkChallengeComponent({ 
  challenge, 
  onComplete, 
  completed,
  savedLink 
}: LinkChallengeComponentProps) {
  const [linkInput, setLinkInput] = useState(savedLink || '');
  const [isValid, setIsValid] = useState(completed);
  const [attemptMade, setAttemptMade] = useState(false);
  
  const validateLink = () => {
    // Basic validation
    if (!linkInput) return false;
    
    try {
      const url = new URL(linkInput);
      
      // Check for expected domain if specified
      if (challenge.expectedDomain) {
        return url.hostname.includes(challenge.expectedDomain);
      }
      
      // Otherwise just check it's a valid URL
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleVerify = () => {
    setAttemptMade(true);
    const valid = validateLink();
    setIsValid(valid);
    
    if (valid) {
      onComplete(linkInput);
    }
  };
  
  // If already completed, show success state
  if (completed && savedLink) {
    return (
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-800 mb-2">✅ Link Challenge Completed</h4>
        <p className="text-sm text-green-700">You've successfully provided this link:</p>
        <a 
          href={savedLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline block mt-1 truncate"
        >
          {savedLink}
        </a>
      </div>
    );
  }
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-2">🔍 Link Challenge</h4>
      <p className="text-sm text-blue-700 mb-3">{challenge.prompt}</p>
      
      {challenge.hint && (
        <p className="text-xs text-blue-600 italic mb-3">Hint: {challenge.hint}</p>
      )}
      
      <div className="flex gap-2">
        <Input
          type="url"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          placeholder="https://..."
          className={attemptMade ? (isValid ? 'border-green-500' : 'border-red-500') : ''}
        />
        <Button onClick={handleVerify}>Verify</Button>
      </div>
      
      {attemptMade && !isValid && (
        <p className="text-xs text-red-500 mt-1">
          That doesn't seem to be a valid link. Please check and try again.
        </p>
      )}
    </div>
  );
}
```

4. **Update ComponentMap to Support Both Modes**

```typescript
// Updated ComponentMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useTurboAptos } from "./TurboAptos";
import { Button } from "./ui/button";
import { DecisionWizard } from "./DecisionWizard";
import { decisionPoints } from "@/data/decision-points";

export function ComponentMap() {
  const [mode, setMode] = useState<'map' | 'turboApt'>('map');
  const [zoom, setZoom] = useState(1);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { startTour } = useTurboAptos();
  
  // Auto-start component map tour when in map mode and first loaded
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Only auto-start in map mode
    if (mode !== 'map') return;
    
    // Check if this is the first time viewing the map
    const hasSeenMap = localStorage.getItem('componentMapTourCompleted');
    
    if (!hasSeenMap) {
      // Small delay to ensure the map is fully rendered
      const timer = setTimeout(() => {
        startTour('component-map');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [startTour, mode]);
  
  // Handle zoom in/out and node selection (existing functionality)
  
  return (
    <div className="component-map-container">
      {/* Mode Toggle */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Button 
            onClick={() => setMode(mode === 'map' ? 'turboApt' : 'map')}
            variant="outline"
            className="mr-2"
          >
            Switch to {mode === 'map' ? 'Guided' : 'Map'} View
          </Button>
        </div>
        
        {/* Map Controls (only shown in map mode) */}
        {mode === 'map' && (
          <div className="component-map-controls flex gap-2">
            <Button onClick={handleZoomIn} variant="outline" size="sm">Zoom In</Button>
            <Button onClick={handleZoomOut} variant="outline" size="sm">Zoom Out</Button>
            <Button onClick={handleResetZoom} variant="outline" size="sm">Reset View</Button>
          </div>
        )}
      </div>
      
      {/* Map Mode View */}
      {mode === 'map' && (
        <div 
          ref={containerRef} 
          className="component-map-visualization border rounded-lg p-8 overflow-auto"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Existing map visualization with all decision points */}
        </div>
      )}
      
      {/* TurboApt Mode View */}
      {mode === 'turboApt' && (
        <div className="turbo-apt-container border rounded-lg p-8">
          <DecisionWizard 
            decisionPoints={decisionPoints}
            onComplete={() => {
              // Show completion message and switch back to map mode
              alert("Congratulations! You've completed the guided decision pathway.");
              setMode('map');
            }}
          />
        </div>
      )}
    </div>
  );
}
```

5. **Define Decision Points Data**

```typescript
// data/decision-points.ts
import React from 'react';
import { DecisionPoint } from '@/types/component-map';

export const decisionPoints: DecisionPoint[] = [
  {
    id: 'start',
    title: 'Getting Started with Aptos',
    description: 'Begin your journey building on Aptos',
    content: (
      <div className="space-y-4">
        <p>Welcome to Aptos! This guided experience will help you navigate the key decisions when building a dApp on Aptos.</p>
        <p>Each step will present you with options and may include challenges to help you learn more about the Aptos ecosystem.</p>
      </div>
    ),
    options: [
      {
        id: 'start-new',
        label: 'I want to build a new dApp from scratch',
        description: 'Learn about the full stack and make all the key decisions',
        nextStepId: 'choose-chain'
      },
      {
        id: 'start-migrate',
        label: 'I want to migrate an existing dApp to Aptos',
        description: 'Learn how to port your application from another blockchain',
        nextStepId: 'choose-chain'
      }
    ]
  },
  {
    id: 'choose-chain',
    title: 'Why Choose Aptos?',
    description: 'Understand the advantages of building on Aptos',
    content: (
      <div className="space-y-4">
        <p>Aptos offers several key advantages for developers:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Move language for safer smart contracts</li>
          <li>Fast finality with high throughput</li>
          <li>Advanced resource model with flexible storage</li>
          <li>Robust developer tooling and support</li>
        </ul>
      </div>
    ),
    options: [
      {
        id: 'choose-aptos',
        label: 'Use Aptos for my project',
        description: 'Proceed with building on Aptos',
        nextStepId: 'contract-approach',
        isRecommended: true
      },
      {
        id: 'learn-more',
        label: 'I need to learn more first',
        description: 'Explore Aptos documentation before deciding',
      }
    ],
    linkChallenge: {
      prompt: 'Find and paste a link to the Aptos developer documentation',
      hint: 'Look for the official Aptos documentation for developers',
      expectedDomain: 'aptos.dev'
    }
  },
  // Additional decision points would be defined here...
  // This would include the remaining steps:
  // - contract-approach
  // - identity-wallets
  // - data-indexing
  // - deployment-options
  // - completion
];

// TODO: Future integration with smart contract for verification
// The smart contract should:
// 1. Store authorized links for each decision point
// 2. Allow updating links by authorized parties
// 3. Provide verification methods for user submissions
// 4. Track user completion on-chain for potential rewards
```

## Implementation Timeline and Dependencies

1. **Phase 1: Tooltip Positioning (1-2 days)**
   - Fix existing issues with tooltip positioning
   - No major dependencies, can be implemented immediately

2. **Phase 2: Button Stack (1 day)**
   - Create ButtonStack component
   - Update button components to work within the stack
   - Depends on Phase 1 for proper positioning

3. **Phase 3: TurboTax Component Map (3-5 days)**
   - Create types and interfaces
   - Implement DecisionWizard and LinkChallenge components
   - Define decision points data
   - Update ComponentMap to support both modes
   - Depends on Phase 1 and 2 for UI consistency

## Testing Strategy

1. **Tooltip Positioning**
   - Test on different screen sizes and devices
   - Verify all tour steps are fully visible
   - Test scrolling behavior on long tooltips

2. **Button Stack**
   - Test conditional rendering with and without allowlisted names
   - Verify button visibility on different screen sizes
   - Test accessibility of the button stack

3. **TurboTax Component Map**
   - Test mode switching
   - Verify all decision points and options
   - Test link challenges with valid and invalid inputs
   - Test progress persistence in localStorage
   - Test completion flow

## Conclusion

This implementation plan addresses all the user feedback:
1. Fixes tooltip positioning for step 8 of the How to Use tour
2. Improves button layout and conditional rendering
3. Creates a true TurboTax-style component map with active user participation

The plan is designed to be modular, allowing for incremental implementation and testing.
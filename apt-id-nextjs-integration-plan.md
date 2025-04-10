# Apt-ID Secret Feature: Next.js Integration Plan

This document outlines the implementation plan for adding a secret feature to the Apt-ID project that checks for specific ANS names (greg.apt or wingbird.apt) and provides access to an exclusive interactive component map.

## File Structure

We'll need to create the following new files:

```
typescript/src/
├── hooks/
│   └── useAllowlistedName.ts     // Custom hook to check if ANS name is allowlisted
├── components/
│   ├── SecretButton.tsx          // Button visible only to allowlisted users
│   ├── ComponentMap.tsx          // Interactive component map visualization
│   └── ComponentMapDialog.tsx    // Dialog to display the component map
└── constants.ts                  // Add allowlist configuration
```

## Implementation Details

### 1. Update Constants

First, we'll add the allowlist configuration to the constants file:

```typescript
// Add to typescript/src/constants.ts

// Allowlist for secret feature access
export const ALLOWLISTED_NAMES = ["greg.apt", "wingbird.apt"];
```

### 2. Create Custom Hook for Allowlist Checking

```typescript
// typescript/src/hooks/useAllowlistedName.ts
"use client";

import { useAptosName } from "./useAptosName";
import { ALLOWLISTED_NAMES } from "@/constants";
import { useEffect, useState } from "react";

export function useAllowlistedName() {
  const { ansName, loading } = useAptosName();
  const [isAllowlisted, setIsAllowlisted] = useState<boolean>(false);

  useEffect(() => {
    if (!ansName || loading) {
      setIsAllowlisted(false);
      return;
    }

    // Check if user's ANS name is in the allowlist
    setIsAllowlisted(ALLOWLISTED_NAMES.includes(ansName));
  }, [ansName, loading]);

  return { isAllowlisted, loading };
}
```

### 3. Create Secret Button Component

```typescript
// typescript/src/components/SecretButton.tsx
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useAllowlistedName } from "@/hooks/useAllowlistedName";
import { ComponentMapDialog } from "./ComponentMapDialog";

export function SecretButton() {
  const { isAllowlisted, loading } = useAllowlistedName();
  const [isOpen, setIsOpen] = useState(false);

  if (loading || !isAllowlisted) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          onClick={() => setIsOpen(true)}
        >
          <span className="mr-2">✨</span>
          View Component Map
        </Button>
      </div>
      
      <ComponentMapDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
```

### 4. Create Component Map Dialog

```typescript
// typescript/src/components/ComponentMapDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ComponentMap } from "./ComponentMap";

interface ComponentMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComponentMapDialog({ open, onOpenChange }: ComponentMapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-[1200px]">
        <DialogHeader>
          <DialogTitle>Aptos Ecosystem Component Map</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto p-4">
          <ComponentMap />
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 5. Implement Component Map Visualization

```typescript
// typescript/src/components/ComponentMap.tsx
"use client";

import { useEffect, useRef } from "react";

export function ComponentMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This would typically use a visualization library like D3.js
    // For this implementation plan, we'll create a simpler version

    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = "";

    // Create component map visualization
    const visualization = document.createElement("div");
    visualization.className = "component-map";
    visualization.innerHTML = createComponentMapHTML();

    containerRef.current.appendChild(visualization);

    // Add event listeners for interactivity
    setupInteractivity();

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="component-map-container">
      <div className="component-map-controls mb-4 flex gap-2">
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Zoom In</button>
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Zoom Out</button>
        <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Reset View</button>
      </div>
      <div 
        ref={containerRef} 
        className="component-map-visualization border rounded-lg p-4 min-h-[500px]"
      >
        Loading visualization...
      </div>
    </div>
  );
}

function createComponentMapHTML() {
  // This function would create the HTML structure for the component map
  // In a real implementation, this would be generated using D3.js or a similar library
  
  return `
    <div class="flex flex-col items-center">
      <h3 class="text-xl font-bold mb-4">Hacker's Decision Pathway</h3>
      
      <div class="decision-tree">
        <div class="decision-node start-node p-4 bg-purple-100 rounded-lg mb-4 text-center">
          <div class="font-bold">Start: "I want to build a dApp"</div>
        </div>
        
        <div class="decision-paths flex flex-col gap-6">
          <div class="decision-path">
            <div class="decision-node p-4 bg-blue-100 rounded-lg mb-2">
              <div class="font-bold">1. Evaluate Aptos or Another Chain?</div>
              <div class="options mt-2 flex gap-2">
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">Yes, try Aptos</span>
                <span class="option px-2 py-1 bg-red-100 rounded text-sm">Need more info...</span>
              </div>
            </div>
          </div>
          
          <div class="decision-path">
            <div class="decision-node p-4 bg-blue-100 rounded-lg mb-2">
              <div class="font-bold">2. Move Contract Approach</div>
              <div class="options mt-2 flex gap-2 flex-wrap">
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">AI-Generated</span>
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">Use Template</span>
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">Migrate EVM/Solana</span>
              </div>
            </div>
          </div>
          
          <div class="decision-path">
            <div class="decision-node p-4 bg-blue-100 rounded-lg mb-2">
              <div class="font-bold">3. Frontend Identity & Wallets</div>
              <div class="options mt-2 flex gap-2 flex-wrap">
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">Aptos Connect</span>
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">Google Login</span>
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">Wallet Adapter</span>
              </div>
            </div>
          </div>
          
          <div class="decision-path">
            <div class="decision-node p-4 bg-blue-100 rounded-lg mb-2">
              <div class="font-bold">4. Data & Indexing</div>
              <div class="options mt-2 flex gap-2 flex-wrap">
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">Direct On-Chain Calls</span>
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">No-Code Indexer</span>
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">Custom Backend</span>
              </div>
            </div>
          </div>
          
          <div class="decision-path">
            <div class="decision-node p-4 bg-blue-100 rounded-lg mb-2">
              <div class="font-bold">5. Deployment & Testing</div>
              <div class="options mt-2 flex gap-2 flex-wrap">
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">One-Click Deploy</span>
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">Local CLI</span>
                <span class="option px-2 py-1 bg-green-100 rounded text-sm">CI/CD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8 text-center text-gray-500">
        <p>This is a simplified version. The full interactive map would include:</p>
        <ul class="list-disc text-left inline-block mt-2">
          <li>Animated connections between decision points</li>
          <li>Detailed information on hover</li>
          <li>Expandable components for each technology</li>
          <li>Interactive navigation between decision paths</li>
        </ul>
      </div>
    </div>
  `;
}

function setupInteractivity() {
  // Add event listeners for interactive elements
  const options = document.querySelectorAll('.option');
  
  options.forEach(option => {
    option.addEventListener('click', () => {
      // In a real implementation, this would update the visualization
      option.classList.toggle('bg-green-100');
      option.classList.toggle('bg-purple-200');
    });
  });
}
```

### 6. Integrate with Top Level Component

Add the SecretButton to a top-level component to make it available throughout the app. The ideal place would be in the root layout or a shared component like the TopBar.

```typescript
// Modify typescript/src/components/TopBar.tsx to include the SecretButton
import { SecretButton } from "./SecretButton";

// Add <SecretButton /> to the rendered JSX
```

## CSS Styling

For the component map styling, we'll rely on utility classes from Tailwind CSS, which is already included in the project, rather than defining custom CSS. This simplifies the implementation and ensures consistency with the existing UI.

## Full Implementation

In a real implementation, the component map would use a library like D3.js for creating sophisticated interactive visualizations. The approach outlined here uses basic HTML and CSS to demonstrate the concept, but a production implementation would include:

1. SVG-based visualization with D3.js
2. Proper zoom and pan functionality
3. Animated connections between components
4. Interactive tooltips and expandable details
5. Responsive layout for different screen sizes

## Testing

To test this implementation:

1. Connect a wallet with an ANS name in the allowlist (greg.apt or wingbird.apt)
2. Verify the secret button appears in the bottom right corner
3. Click the button to open the component map dialog
4. Interact with the component map to test functionality
5. Test with non-allowlisted names to verify the button doesn't appear

## Deployment Considerations

When deploying this feature:

1. Ensure the ALLOWLISTED_NAMES constant is properly configured
2. Consider moving the allowlist to an environment variable or server-side check for more security
3. Optimize the component map visualization for performance with large datasets
4. Add analytics to track usage of the secret feature

This implementation plan provides a solid foundation for adding the secret feature to the Apt-ID project while maintaining the existing codebase structure and design patterns.
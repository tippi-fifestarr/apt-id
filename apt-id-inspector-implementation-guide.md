# Inspector Feature Implementation Guide

This guide provides detailed instructions for implementing the Inspector feature for My Hackathon Project, ensuring it follows project best practices and UI standards.

## Overview

The Inspector feature will allow users to learn about different UI elements in the profile view by activating a special mode that:
1. Darkens the screen except for key interactive elements
2. Highlights important UI components
3. Shows informative tooltips when hovering over highlighted elements

## Implementation Best Practices

### 1. Use Existing UI Components

All implementation should use the shadcn/ui components in `typescript/src/components/ui/`:

- Use `Button` component with proper variants for all buttons
- Use `Dialog` component for any modal interfaces
- Use `Card` components for tooltip containers
- Follow accessibility patterns established in existing components

### 2. File Structure

```
typescript/src/components/Inspector/
├── index.tsx               # Exports all Inspector components
├── InspectorContext.tsx    # Context provider for Inspector state
├── InspectorButton.tsx     # Button to activate Inspector mode
├── InspectorHighlight.tsx  # Wrapper for highlighting elements
├── InspectorOverlay.tsx    # Darkened background overlay
```

### 3. TypeScript Standards

- Use TypeScript interfaces for all props
- Include proper React.ForwardRef implementations where needed
- Add JSDoc comments for public functions and components
- Use proper typing for state management

## Component Implementation Examples

### InspectorContext.tsx

```tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InspectorOverlay } from './InspectorOverlay';

interface InspectorContextType {
  isActive: boolean;
  activateInspector: () => void;
  deactivateInspector: () => void;
  activeElementId: string | null;
  setActiveElementId: (id: string | null) => void;
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined);

export interface InspectorProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the Inspector functionality
 * Manages state for inspector mode and provides context to child components
 */
export function InspectorProvider({ children }: InspectorProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  
  const activateInspector = () => setIsActive(true);
  const deactivateInspector = () => {
    setIsActive(false);
    setActiveElementId(null);
  };
  
  // Handle escape key to exit inspector mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        deactivateInspector();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
  
  return (
    <InspectorContext.Provider
      value={{
        isActive,
        activateInspector,
        deactivateInspector,
        activeElementId,
        setActiveElementId,
      }}
    >
      {children}
      {isActive && <InspectorOverlay />}
    </InspectorContext.Provider>
  );
}

/**
 * Hook to access the Inspector context
 * @returns The Inspector context
 */
export function useInspector() {
  const context = useContext(InspectorContext);
  if (context === undefined) {
    throw new Error('useInspector must be used within an InspectorProvider');
  }
  return context;
}
```

### InspectorButton.tsx

```tsx
"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { useInspector } from './InspectorContext';

export interface InspectorButtonProps {
  className?: string;
}

/**
 * Button that activates the Inspector mode
 */
export function InspectorButton({ className }: InspectorButtonProps) {
  const { activateInspector } = useInspector();
  
  return (
    <Button
      onClick={activateInspector}
      variant="outline"
      className={`flex items-center gap-2 w-full mt-2 ${className}`}
      aria-label="Activate inspector mode"
    >
      <Search size={16} />
      <span>Activate Inspector! 🔍</span>
    </Button>
  );
}
```

### InspectorHighlight.tsx

```tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useInspector } from './InspectorContext';
import { Card, CardContent } from '../ui/card';

export interface InspectorHighlightProps {
  elementId: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Wrapper component that highlights elements in Inspector mode
 */
export function InspectorHighlight({ 
  elementId, 
  description, 
  children 
}: InspectorHighlightProps) {
  const { isActive, activeElementId, setActiveElementId } = useInspector();
  const elementRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
  // Skip wrapping when inspector is not active
  if (!isActive) {
    return <>{children}</>;
  }
  
  const isElementActive = activeElementId === elementId;
  
  // Calculate position for tooltip when this element is active
  useEffect(() => {
    if (isActive && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + window.scrollY + rect.height + 8,
        left: rect.left + window.scrollX + (rect.width / 2),
      });
    }
  }, [isActive, isElementActive]);
  
  return (
    <div 
      ref={elementRef}
      className={`relative z-50 ${isElementActive ? 'inspector-active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setActiveElementId(elementId);
      }}
      onMouseEnter={() => setActiveElementId(elementId)}
      onMouseLeave={() => setActiveElementId(null)}
    >
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-purple-500/20 rounded-md pointer-events-none" />
      </div>
      
      {isElementActive && (
        <Card
          className="fixed z-50 max-w-xs"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <CardContent className="p-3">
            <p className="text-sm font-medium">{elementId}</p>
            <p className="text-xs text-gray-600">{description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### InspectorOverlay.tsx

```tsx
"use client";

import React from 'react';
import { useInspector } from './InspectorContext';

/**
 * Overlay component that darkens the screen in Inspector mode
 */
export function InspectorOverlay() {
  const { deactivateInspector } = useInspector();
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 z-40 overflow-hidden"
      onClick={deactivateInspector}
      aria-label="Exit inspector mode"
      role="button"
      tabIndex={0}
    >
      <div className="fixed top-4 right-4 bg-white rounded-md px-3 py-2 text-sm">
        Press ESC to exit inspector mode
      </div>
    </div>
  );
}
```

### index.tsx

```tsx
// Export all Inspector components
export { InspectorProvider, useInspector } from './InspectorContext';
export { InspectorButton } from './InspectorButton';
export { InspectorHighlight } from './InspectorHighlight';
export { InspectorOverlay } from './InspectorOverlay';
```

## Integration with Existing Components

### ProfileEditor.tsx Example

```tsx
"use client";

import { InspectorHighlight, InspectorButton } from '@/components/Inspector';
import { Button } from '@/components/ui/button';
// ... other imports

export function ProfileEditor({ /* props */ }) {
  // ... existing component code
  
  return (
    <div className="container mx-auto p-4">
      {/* ... existing editor content */}
      
      <div className="space-y-4">
        <InspectorHighlight 
          elementId="Wallet Connect"
          description="Connect your Aptos wallet to manage your profile"
        >
          {/* Wallet selector component */}
        </InspectorHighlight>
        
        <InspectorHighlight 
          elementId="Add Link"
          description="Add external links to your profile"
        >
          <Button className="w-full mb-2">Add Link</Button>
        </InspectorHighlight>
        
        <InspectorHighlight 
          elementId="Save Changes"
          description="Save your profile changes to the blockchain"
        >
          <Button className="w-full mb-2">Save Changes</Button>
        </InspectorHighlight>
        
        <InspectorHighlight 
          elementId="View Your Public Profile"
          description="View your public profile as others would see it"
        >
          <Button variant="outline" className="w-full mb-2">
            View Your Public Profile
          </Button>
        </InspectorHighlight>
        
        <InspectorButton />
      </div>
    </div>
  );
}
```

## Inspectable Elements

The following UI elements should be wrapped with InspectorHighlight components:

| Element Name | Element ID | Description |
|--------------|------------|-------------|
| Wallet Connector | "Wallet Connect" | "Connect your Aptos wallet to manage your profile" |
| Search Box | "Search Profiles" | "Search for other profiles by their ANS name" |
| Map Button | "Map Button" | "Access the interactive component map to learn about Aptos ecosystem" |
| Add Link | "Add Link" | "Add external links to your profile" |
| Save Changes | "Save Changes" | "Save your profile changes to the blockchain" |
| Profile Links | "Profile Links" | "Links you've added to your profile" |

## CSS Styles

Add these styles to `globals.css`:

```css
/* Inspector feature styles */
.inspector-active {
  position: relative;
  z-index: 50;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(124, 58, 237, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
  }
}
```

## Root App Provider Integration

Add the InspectorProvider to the root layout:

```tsx
// In layout.tsx
import { InspectorProvider } from '@/components/Inspector';

// Inside the RootLayout component
return (
  <html lang="en">
    <body>
      <InspectorProvider>
        {/* Other providers */}
        {children}
      </InspectorProvider>
    </body>
  </html>
);
```

## Accessibility Considerations

- All inspectable elements should have proper aria-labels
- Tooltips should have sufficient color contrast (at least 4.5:1)
- Inspector mode should be keyboard navigable
- Escape key should always dismiss the inspector mode
- Focus should be managed appropriately when inspector is active

## Testing Checklist

- Verify that the Inspector button appears on both profile editing and viewing pages
- Test that clicking the button correctly activates Inspector mode with darkened background
- Confirm that all specified elements are highlighted
- Check that tooltips are correctly positioned and don't overflow screen boundaries
- Verify that keyboard navigation works with Tab key
- Test that Escape key exits Inspector mode
- Check across different screen sizes (mobile, tablet, desktop)

By following this implementation guide, the Inspector feature will be built according to the project's best practices and UI component standards, providing a consistent user experience.
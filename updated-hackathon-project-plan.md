# "My Hackathon Project" Enhancement Plan

Based on your feedback, I've updated the implementation plan with rebranding and additional UI improvements. This document outlines the revised plan with specific tasks prioritized for immediate implementation.

## Phase 1: Rebranding and Essential Fixes

### 1. Rename and Rebrand

Rebrand from "Apt-ID" to "My Hackathon Project" throughout the application:

```typescript
// Update metadata in layout.tsx
export const metadata: Metadata = {
  title: "My Hackathon Project",
  description: "Your Gateway to Building on Aptos",
};

// Update references in UI components
<span className="font-semibold text-gray-800">My Hackathon Project</span>
```

Major components requiring rebranding:
- Page title and metadata
- Header/TopBar component
- README and documentation
- Any hardcoded references to "Apt-ID"

### 2. Fix Tooltip Positioning

Update the `TourTooltip` component to ensure tooltips remain visible:

```typescript
// In TourTooltip.tsx
const calculatePosition = () => {
  // Existing position calculation...
  
  // Enhanced boundary checking
  if (left + tooltipWidth > window.innerWidth - 10) {
    left = window.innerWidth - tooltipWidth - 10;
  }
  
  // Special case for elements at bottom-right corner (like Secret Button)
  if (rect.bottom > window.innerHeight - 100 && rect.right > window.innerWidth - 100) {
    // Position tooltip above and to the left
    top = rect.top + window.scrollY - tooltipHeight - 40;
    left = Math.max(10, rect.left + window.scrollX - tooltipWidth / 2);
  }
  
  return { top, left };
};
```

Also add overlay to darken the rest of the screen when showing tooltips:

```typescript
// Add to TourTooltip.tsx
return (
  <>
    {/* Dark overlay */}
    <div 
      className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      style={{ 
        opacity: isTourActive ? 0.5 : 0,
        pointerEvents: isTourActive ? 'auto' : 'none'
      }}
    />
    
    {/* Tooltip */}
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl p-4 w-[300px] tour-tooltip"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxHeight: '400px',
        overflowY: 'auto'
      }}
    >
      {/* Tooltip content */}
    </div>
  </>
);
```

### 3. Implement Button Stack

Create a `ButtonStack` component for better organization and conditional display:

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

## Phase 2: UI Improvements

### 1. Enhanced Homepage with Clearer Call to Action

Update the main page with larger text and clearer CTAs:

```tsx
// In app/page.tsx
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          My Hackathon Project
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-700">
          Your gateway to building on Aptos. Connect your wallet to get started.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-lg px-6 py-3"
            onClick={() => document.querySelector('.wallet-selector-button')?.click()}
          >
            Connect Wallet
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="text-lg px-6 py-3"
            onClick={() => document.querySelector('.how-to-use-button')?.click()}
          >
            How to Use
          </Button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Why use this project?</h2>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <FeatureCard 
              icon="🚀" 
              title="Quick Start" 
              description="Fork this repo to jumpstart your hackathon project"
            />
            <FeatureCard 
              icon="🔗" 
              title="Link Hub" 
              description="Access all the resources you need for Aptos development"
            />
            <FeatureCard 
              icon="🧩" 
              title="Component Library" 
              description="Use pre-built components to accelerate development"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
```

### 2. Knowledge Collection System

Create a knowledge notebook feature:

```typescript
// types/knowledge.ts
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: 'move' | 'frontend' | 'deployment' | 'general';
  discovered: boolean;
}

// hooks/useKnowledge.ts
"use client";

import { useState, useEffect } from 'react';
import { KnowledgeItem } from '@/types/knowledge';
import { knowledgeItems } from '@/data/knowledge-items';

export function useKnowledge() {
  const [discoveredItems, setDiscoveredItems] = useState<string[]>([]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load discovered items from localStorage
    try {
      const saved = localStorage.getItem('knowledgeNotebook');
      if (saved) {
        setDiscoveredItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load knowledge notebook', e);
    }
  }, []);
  
  const discoverItem = (itemId: string) => {
    if (discoveredItems.includes(itemId)) return;
    
    const newDiscoveredItems = [...discoveredItems, itemId];
    setDiscoveredItems(newDiscoveredItems);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('knowledgeNotebook', JSON.stringify(newDiscoveredItems));
    }
  };
  
  // Get all knowledge items with discovered status
  const getKnowledgeItems = () => {
    return knowledgeItems.map(item => ({
      ...item,
      discovered: discoveredItems.includes(item.id)
    }));
  };
  
  // Get only discovered items
  const getDiscoveredItems = () => {
    return knowledgeItems
      .filter(item => discoveredItems.includes(item.id))
      .map(item => ({ ...item, discovered: true }));
  };
  
  return {
    discoverItem,
    getKnowledgeItems,
    getDiscoveredItems,
    discoveredCount: discoveredItems.length,
    totalCount: knowledgeItems.length
  };
}

// components/InfoTooltip.tsx
"use client";

import { useState } from 'react';
import { Info } from 'lucide-react';
import { useKnowledge } from '@/hooks/useKnowledge';

interface InfoTooltipProps {
  knowledgeId: string;
  className?: string;
}

export function InfoTooltip({ knowledgeId, className }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { discoverItem, getKnowledgeItems } = useKnowledge();
  
  const item = getKnowledgeItems().find(item => item.id === knowledgeId);
  
  if (!item) return null;
  
  const handleClick = () => {
    setIsOpen(true);
    discoverItem(knowledgeId);
  };
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        className={`rounded-full p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition-colors
                  ${item.discovered ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
        aria-label="Learn more"
      >
        <Info size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 bg-white rounded-lg shadow-xl p-3 w-64 text-sm mt-2 right-0">
          <h4 className="font-medium mb-1">{item.title}</h4>
          <p className="text-gray-600">{item.content}</p>
          <div className="text-xs mt-2 flex justify-between">
            <span className="text-gray-500">{item.category}</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-purple-600 hover:text-purple-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// components/KnowledgeNotebook.tsx
"use client";

import { useState } from 'react';
import { useKnowledge } from '@/hooks/useKnowledge';
import { Button } from './ui/button';
import { Book, ChevronLeft, ChevronRight } from 'lucide-react';

export function KnowledgeNotebook() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { getDiscoveredItems, discoveredCount, totalCount } = useKnowledge();
  
  const discoveredItems = getDiscoveredItems();
  
  // Filter by category if one is selected
  const filteredItems = activeCategory 
    ? discoveredItems.filter(item => item.category === activeCategory)
    : discoveredItems;
  
  // Get unique categories
  const categories = Array.from(new Set(discoveredItems.map(item => item.category)));
  
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 rounded-full h-12 w-12 p-0 flex items-center justify-center"
        aria-label="Knowledge Notebook"
      >
        <Book size={20} />
        {discoveredCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {discoveredCount}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Knowledge Notebook</h2>
              <div className="text-sm text-gray-500">
                {discoveredCount} of {totalCount} items discovered
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
            
            {/* Category filters */}
            {categories.length > 0 && (
              <div className="flex gap-2 p-3 border-b overflow-x-auto">
                <Button
                  variant={activeCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(null)}
                >
                  All
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Knowledge items */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {discoveredCount === 0 
                    ? "No knowledge items discovered yet. Explore the app to find more!" 
                    : "No items in this category."}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredItems.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.content}</p>
                      <div className="text-xs text-gray-500 mt-2">{item.category}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

## Phase 3: TurboTax-Style Component Map (Future Implementation)

The TurboTax-style component map will be implemented according to the original plan with:

1. Dual mode support (map and step-by-step wizard)
2. Interactive link challenges
3. Progress tracking
4. Smart contract integration placeholders

## Implementation Priority

Based on your feedback, here's the implementation priority:

1. Rebranding to "My Hackathon Project"
2. Fix tooltip positioning with darkened background
3. Implement button stack with conditional rendering 
4. Add info tooltips and knowledge notebook system
5. Enhance homepage with bigger text and clear CTAs
6. (Future) Implement TurboTax-style component map

## Additional Features for Consideration

These features support the vision of creating a personal link hub and clonable repo:

1. **Resource Link Collection**
   - Curated links to Aptos documentation
   - Code examples and templates
   - Community resources

2. **Project Boilerplate Structure**
   - Well-organized file structure
   - Reusable components
   - Clear documentation for cloning and extension

3. **Personalization Options**
   - Ability to save favorite resources
   - Custom theme or appearance settings
   - Profile information for hackathon participants
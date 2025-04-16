"use client";

import React from 'react';
import { useInspector } from './InspectorContext';
import { Card, CardContent, CardTitle, CardDescription } from '../ui/card';

/**
 * A fixed position panel at the bottom of the screen that displays
 * information about the currently highlighted element
 */
export function InspectorInfoPanel() {
  const { isActive, activeElementId, elementDescriptions } = useInspector();
  
  if (!isActive || !activeElementId) {
    return null;
  }
  
  const description = elementDescriptions[activeElementId] || '';
  
  return (
    <Card 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-md w-full z-50 shadow-md"
      shadow="md"
    >
      <CardContent className="p-4">
        <CardTitle>{activeElementId}</CardTitle>
        <CardDescription className="mt-1">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
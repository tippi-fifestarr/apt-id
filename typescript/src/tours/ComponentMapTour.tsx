"use client";

import React from 'react';
import { Tour } from '@/components/TurboAptos';

/**
 * Tour configuration for guiding users through the interactive component map
 * This tour explains the Aptos ecosystem and developer decision pathways
 */
export const componentMapTour: Tour = {
  id: 'component-map',
  title: 'Aptos Component Map Guide',
  description: 'Learn about the Aptos ecosystem and developer decision pathways',
  steps: [
    {
      id: 'map-overview',
      title: 'Welcome to the Component Map',
      content: (
        <div className="space-y-3">
          <p>
            Welcome to the <strong>Aptos Component Map</strong>! This interactive visualization shows 
            the key components and decision points when building on Aptos.
          </p>
          <p>
            We&apos;ll guide you through each section to help you understand the Aptos ecosystem.
          </p>
        </div>
      ),
      position: 'bottom'
    },
    {
      id: 'decision-pathway',
      title: 'Developer Decision Pathway',
      content: (
        <div className="space-y-3">
          <p>
            This map is organized as a <strong>Decision Pathway</strong> that follows the journey 
            of a developer building on Aptos.
          </p>
          <p>
            Each node represents a key decision point, with options for different approaches.
          </p>
          <p className="text-sm text-gray-600">
            Click on any node to see more details about that decision point.
          </p>
        </div>
      ),
      position: 'bottom',
      targetSelector: '.decision-path-container'
    },
    {
      id: 'chain-selection',
      title: 'Step 1: Evaluate Aptos',
      content: (
        <div className="space-y-3">
          <p>
            The journey begins with evaluating whether Aptos is the right blockchain for your project.
          </p>
          <p>
            <strong>Why choose Aptos?</strong>
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li>Move language for safer smart contracts</li>
            <li>Fast finality with high throughput</li>
            <li>Advanced resource model with flexible storage</li>
            <li>Robust developer tooling and support</li>
          </ul>
        </div>
      ),
      position: 'bottom',
      targetSelector: '[data-node-id="evaluate"]'
    },
    {
      id: 'contract-approaches',
      title: 'Step 2: Move Contract Approach',
      content: (
        <div className="space-y-3">
          <p>
            Once you&apos;ve chosen Aptos, you need to decide how to create your Move smart contracts.
          </p>
          <p>
            <strong>Three main approaches:</strong>
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li><strong>AI-Generated:</strong> Use AI tools to generate code (fastest for prototyping)</li>
            <li><strong>Template-Based:</strong> Start with pre-built patterns for common use cases</li>
            <li><strong>Migration:</strong> Convert existing contracts from Solidity or other languages</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            For hackathons, AI-generation or templates are usually the fastest options.
          </p>
        </div>
      ),
      position: 'right',
      targetSelector: '[data-node-id="contract"]'
    },
    {
      id: 'identity-wallets',
      title: 'Step 3: Frontend Identity & Wallets',
      content: (
        <div className="space-y-3">
          <p>
            How will users authenticate and interact with your application?
          </p>
          <p>
            <strong>Authentication options:</strong>
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li><strong>Aptos Connect:</strong> Social login with self-custody (best user experience)</li>
            <li><strong>Google/Social Login:</strong> Familiar Web2 experience with account abstraction</li>
            <li><strong>Wallet Adapter:</strong> Traditional Web3 connection for existing wallet users</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Aptos Connect provides the best balance of security and user experience.
          </p>
        </div>
      ),
      position: 'left',
      targetSelector: '[data-node-id="identity"]'
    },
    {
      id: 'data-indexing',
      title: 'Step 4: Data & Indexing',
      content: (
        <div className="space-y-3">
          <p>
            How will your application access and process blockchain data?
          </p>
          <p>
            <strong>Data access options:</strong>
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li><strong>Direct On-Chain Calls:</strong> Simple but limited to current state</li>
            <li><strong>No-Code Indexer:</strong> Easy access to historical data without running infrastructure</li>
            <li><strong>Custom Backend:</strong> Full control for complex requirements</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            For hackathons, the No-Code Indexer provides the best balance of power and simplicity.
          </p>
        </div>
      ),
      position: 'bottom',
      targetSelector: '[data-node-id="data"]'
    },
    {
      id: 'deployment',
      title: 'Step 5: Deployment & Testing',
      content: (
        <div className="space-y-3">
          <p>
            How will you deploy and test your application?
          </p>
          <p>
            <strong>Deployment options:</strong>
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li><strong>One-Click Deploy:</strong> Fastest for hackathons using Aptos Build</li>
            <li><strong>Local CLI:</strong> More control over deployment for custom setups</li>
            <li><strong>CI/CD:</strong> Professional workflow for production applications</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            One-Click Deploy via Aptos Build is perfect for hackathons and quick prototypes.
          </p>
        </div>
      ),
      position: 'top',
      targetSelector: '[data-node-id="deployment"]'
    },
    {
      id: 'tour-complete',
      title: 'Ready to Build!',
      content: (
        <div className="space-y-3">
          <p>
            You&apos;ve completed the tour of the Aptos Component Map!
          </p>
          <p>
            You now understand the key decision points when building on Aptos.
            Feel free to explore the map on your own by clicking on different nodes.
          </p>
          <div className="bg-purple-100 p-2 rounded text-sm">
            <strong>✨ Next Steps:</strong> Choose your decision path and start building your
            project using the components that best fit your needs.
          </div>
        </div>
      ),
      position: 'bottom'
    }
  ],
  onComplete: () => {
    console.log('Component Map tour completed');
    // Store in localStorage to prevent showing it again (client-side only)
    if (typeof window !== 'undefined') {
      localStorage.setItem('componentMapTourCompleted', 'true');
    }
  }
};
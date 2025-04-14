"use client";

import { useEffect, useRef, useState } from "react";
import { useTurboAptos } from "./TurboAptos";
import { Button } from "./ui/button";
import decisionPoints from "@/data/decision-points";
import { ComponentMapMode, UserProgress } from "@/types/component-map";

/**
 * Interactive component map visualization that displays the Aptos ecosystem
 * and hacker decision pathways with TurboTax-style guided mode
 */
export function ComponentMap() {
  // View mode state (map or turboApt)
  const [mode, setMode] = useState<ComponentMapMode>('map');
  
  // Existing states for map view
  const [zoom, setZoom] = useState(1);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { startTour } = useTurboAptos();
  
  // For link challenge in TurboApt mode
  const [linkInput, setLinkInput] = useState('');
  
  // User progress tracking for TurboApt mode
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('componentMapProgress');
      return saved ? JSON.parse(saved) : {
        completedSteps: [],
        selectedOptions: {},
        providedLinks: {},
        lastStepId: 'start'
      };
    }
    return {
      completedSteps: [],
      selectedOptions: {},
      providedLinks: {},
      lastStepId: 'start'
    };
  });
  
  // Current step for TurboApt mode
  const [currentStep, setCurrentStep] = useState<string>(
    userProgress.lastStepId || 'start'
  );
  
  // Save progress whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('componentMapProgress', JSON.stringify(userProgress));
    }
  }, [userProgress]);
  
  // Auto-start the component map tour when first loaded (keep existing logic)
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Check if this is the first time viewing the map
    const hasSeenMap = localStorage.getItem('componentMapTourCompleted');
    
    if (!hasSeenMap) {
      // Small delay to ensure the map is fully rendered
      const timer = setTimeout(() => {
        startTour('component-map');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  // Handle zoom in (keep existing function)
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  // Handle zoom out (keep existing function)
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  // Reset zoom (keep existing function)
  const handleResetZoom = () => {
    setZoom(1);
    setActiveNode(null);
  };

  // Handle node click to toggle active state (keep existing function)
  const handleNodeClick = (nodeId: string) => {
    setActiveNode(prev => prev === nodeId ? null : nodeId);
  };
  
  // TurboApt mode: Go to next step
  const goToNext = () => {
    const current = decisionPoints.find(d => d.id === currentStep);
    if (!current) return;
    
    const selectedOption = userProgress.selectedOptions[currentStep];
    const option = current.options.find(o => o.id === selectedOption);
    
    if (option?.nextStepId) {
      setCurrentStep(option.nextStepId);
      setUserProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, currentStep],
        lastStepId: option.nextStepId || currentStep
      }));
    }
  };
  
  // TurboApt mode: Go to previous step
  const goToPrevious = () => {
    // Find the previous step from the decision flow
    const completedSteps = userProgress.completedSteps;
    if (completedSteps.length > 0) {
      const previousStep = completedSteps[completedSteps.length - 1];
      setCurrentStep(previousStep);
      setUserProgress(prev => ({
        ...prev,
        completedSteps: prev.completedSteps.slice(0, -1),
        lastStepId: previousStep
      }));
    }
  };
  
  // TurboApt mode: Handle option selection
  const handleOptionSelect = (decisionId: string, optionId: string) => {
    setUserProgress(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [decisionId]: optionId
      }
    }));
  };
  
  // TurboApt mode: Handle link challenge completion
  const handleLinkComplete = (decisionId: string, link: string) => {
    setUserProgress(prev => ({
      ...prev,
      providedLinks: {
        ...prev.providedLinks,
        [decisionId]: link
      }
    }));
  };
  
  // Get current decision point for TurboApt mode
  const currentDecision = decisionPoints.find(d => d.id === currentStep);
  
  // Check if user can proceed to next step
  const canProceed = userProgress.selectedOptions[currentStep] || 
    (currentDecision?.linkChallenge && userProgress.providedLinks[currentStep]);

  return (
    <div className="component-map-container">
      {/* Mode toggle */}
      <div className="mode-toggle mb-4">
        <Button 
          onClick={() => setMode(mode === 'map' ? 'turboApt' : 'map')}
          className="mb-2"
          variant="outline"
        >
          Switch to {mode === 'map' ? 'Guided' : 'Map'} View
        </Button>
      </div>
      
      {/* Show zoom controls only in map mode */}
      {mode === 'map' && (
        <div className="component-map-controls mb-4 flex gap-2">
          <Button 
            onClick={handleZoomIn} 
            variant="outline"
            size="sm"
            className="px-3 py-1"
          >
            Zoom In
          </Button>
          <Button 
            onClick={handleZoomOut} 
            variant="outline" 
            size="sm"
            className="px-3 py-1"
          >
            Zoom Out
          </Button>
          <Button 
            onClick={handleResetZoom} 
            variant="outline" 
            size="sm"
            className="px-3 py-1"
          >
            Reset View
          </Button>
        </div>
      )}
      
      {/* Conditional rendering based on mode */}
      {mode === 'map' ? (
        // Map View (keep existing visualization)
        <div 
          ref={containerRef} 
          className="component-map-visualization border rounded-lg p-8 overflow-auto"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Decision Path Visualization */}
          <div className="decision-path-container flex flex-col items-center">
            <h3 className="text-xl font-bold mb-8">Hacker&apos;s Decision Pathway</h3>
            
            {/* Start Node */}
            <div 
              className={`decision-node start-node p-4 rounded-lg mb-8 text-center cursor-pointer 
                        ${activeNode === 'start' ? 'bg-purple-200 border-2 border-purple-500' : 'bg-purple-100 border border-purple-200'}`}
              onClick={() => handleNodeClick('start')}
            >
              <div className="font-bold">Start: &quot;I want to build a dApp&quot;</div>
              {activeNode === 'start' && (
                <div className="mt-2 text-sm">
                  This is the beginning of your journey to build a decentralized application on Aptos.
                  Choose your path wisely!
                </div>
              )}
            </div>
            
            {/* Decision Pathways */}
            <div className="decision-paths grid grid-cols-1 gap-8 w-full max-w-3xl">
              {/* Path 1: Evaluate Aptos */}
              <div className="decision-path">
                <div
                  data-node-id="evaluate"
                  className={`decision-node p-4 rounded-lg cursor-pointer
                             ${activeNode === 'evaluate' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
                  onClick={() => handleNodeClick('evaluate')}
                >
                  <div className="font-bold">1. Evaluate Aptos or Another Chain?</div>
                  {activeNode === 'evaluate' && (
                    <div className="mt-2 text-sm">
                      <p className="mb-2">Consider these Aptos advantages:</p>
                      <ul className="list-disc pl-5">
                        <li>Move language for safer smart contracts</li>
                        <li>Fast finality with high throughput</li>
                        <li>Strong developer tooling and support</li>
                      </ul>
                    </div>
                  )}
                  <div className="options mt-2 flex gap-2 flex-wrap">
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Yes, try Aptos</span>
                    <span className="option px-2 py-1 bg-red-100 rounded text-sm hover:bg-red-200">Need more info...</span>
                  </div>
                </div>
              </div>
              
              {/* Path 2: Move Contract Approach */}
              <div className="decision-path">
                <div
                  data-node-id="contract"
                  className={`decision-node p-4 rounded-lg cursor-pointer
                             ${activeNode === 'contract' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
                  onClick={() => handleNodeClick('contract')}
                >
                  <div className="font-bold">2. Move Contract Approach</div>
                  {activeNode === 'contract' && (
                    <div className="mt-2 text-sm">
                      <p className="mb-2">Three ways to create Move smart contracts:</p>
                      <ul className="list-disc pl-5">
                        <li>AI generation: Fast prototyping without Move knowledge</li>
                        <li>Templates: Pre-built patterns for common use cases</li>
                        <li>Migration: Convert from Solidity or other languages</li>
                      </ul>
                    </div>
                  )}
                  <div className="options mt-2 flex gap-2 flex-wrap">
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">AI-Generated</span>
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Use Template</span>
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Migrate EVM/Solana</span>
                  </div>
                </div>
              </div>
              
              {/* Path 3: Frontend Identity & Wallets */}
              <div className="decision-path">
                <div
                  data-node-id="identity"
                  className={`decision-node p-4 rounded-lg cursor-pointer
                             ${activeNode === 'identity' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
                  onClick={() => handleNodeClick('identity')}
                >
                  <div className="font-bold">3. Frontend Identity & Wallets</div>
                  {activeNode === 'identity' && (
                    <div className="mt-2 text-sm">
                      <p className="mb-2">Choose your authentication approach:</p>
                      <ul className="list-disc pl-5">
                        <li>Aptos Connect: Social login with self-custody</li>
                        <li>Google/Social Login: Familiar Web2 experience</li>
                        <li>Wallet Adapter: Traditional Web3 connection</li>
                      </ul>
                    </div>
                  )}
                  <div className="options mt-2 flex gap-2 flex-wrap">
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Aptos Connect</span>
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Google Login</span>
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Wallet Adapter</span>
                  </div>
                </div>
              </div>
              
              {/* Path 4: Data & Indexing */}
              <div className="decision-path">
                <div
                  data-node-id="data"
                  className={`decision-node p-4 rounded-lg cursor-pointer
                             ${activeNode === 'data' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
                  onClick={() => handleNodeClick('data')}
                >
                  <div className="font-bold">4. Data & Indexing</div>
                  {activeNode === 'data' && (
                    <div className="mt-2 text-sm">
                      <p className="mb-2">Decide how to access blockchain data:</p>
                      <ul className="list-disc pl-5">
                        <li>Direct On-Chain Calls: Simple but limited to current state</li>
                        <li>No-Code Indexer: Easy historical data without backend</li>
                        <li>Custom Backend: Full control for complex requirements</li>
                      </ul>
                    </div>
                  )}
                  <div className="options mt-2 flex gap-2 flex-wrap">
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Direct On-Chain Calls</span>
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">No-Code Indexer</span>
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Custom Backend</span>
                  </div>
                </div>
              </div>
              
              {/* Path 5: Deployment & Testing */}
              <div className="decision-path">
                <div
                  data-node-id="deployment"
                  className={`decision-node p-4 rounded-lg cursor-pointer
                             ${activeNode === 'deployment' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
                  onClick={() => handleNodeClick('deployment')}
                >
                  <div className="font-bold">5. Deployment & Testing</div>
                  {activeNode === 'deployment' && (
                    <div className="mt-2 text-sm">
                      <p className="mb-2">Choose your deployment strategy:</p>
                      <ul className="list-disc pl-5">
                        <li>One-Click Deploy: Fastest for hackathons</li>
                        <li>Local CLI: More control over deployment</li>
                        <li>CI/CD: Professional development workflow</li>
                      </ul>
                    </div>
                  )}
                  <div className="options mt-2 flex gap-2 flex-wrap">
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">One-Click Deploy</span>
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">Local CLI</span>
                    <span className="option px-2 py-1 bg-green-100 rounded text-sm hover:bg-green-200">CI/CD</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Connection lines would be SVG paths in a production implementation */}
            
            <div className="mt-12 text-center text-gray-500 max-w-2xl">
              <p className="mb-2 italic">This is an exclusive interactive map only available to users with specific ANS names.</p>
              <p>Click on any decision point above to see more details. In a full implementation, 
                 this would include animated connections between components and detailed diagrams for each technology.</p>
            </div>
          </div>
        </div>
      ) : (
        // TurboApt View (wizard-style experience)
        <div className="decision-wizard border rounded-lg p-8">
          {/* Current decision step */}
          {currentDecision && (
            <div className="decision-step">
              <h3 className="text-xl font-bold mb-4">
                {currentDecision.title}
              </h3>
              
              <div className="decision-content mb-6">
                {currentDecision.content}
              </div>
              
              {/* Link challenge if applicable */}
              {currentDecision.linkChallenge && !userProgress.providedLinks[currentStep] && (
                <div className="link-challenge bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="mb-2">{currentDecision.linkChallenge.prompt}</p>
                  {currentDecision.linkChallenge.hint && (
                    <p className="text-gray-500 text-sm mb-2">Hint: {currentDecision.linkChallenge.hint}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 p-2 border rounded"
                      placeholder="https://..."
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                    />
                    <Button onClick={() => {
                      // Basic validation
                      if (linkInput.includes(currentDecision.linkChallenge?.expectedDomain || 'aptos')) {
                        handleLinkComplete(currentStep, linkInput);
                        setLinkInput('');
                      }
                    }}>
                      Verify
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Show link when provided */}
              {currentDecision.linkChallenge && userProgress.providedLinks[currentStep] && (
                <div className="link-success bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-green-700 font-medium mb-2">✓ Link verified!</p>
                  <div className="text-sm bg-white p-2 rounded border border-green-200 break-all">
                    {userProgress.providedLinks[currentStep]}
                  </div>
                </div>
              )}
              
              {/* Decision options */}
              <div className="decision-options space-y-2 mb-6">
                {currentDecision.options.map(option => (
                  <div 
                    key={option.id}
                    className={`option p-3 rounded-lg border cursor-pointer transition-all
                      ${userProgress.selectedOptions[currentStep] === option.id 
                        ? 'bg-purple-100 border-purple-500' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }
                      ${option.isRecommended ? 'border-l-4 border-l-green-500' : ''}
                    `}
                    onClick={() => handleOptionSelect(currentStep, option.id)}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                    {option.isRecommended && (
                      <div className="text-xs text-green-600 mt-1">Recommended</div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Summary on complete page */}
              {currentStep === 'complete' && (
                <div className="summary bg-white p-4 rounded border mb-6">
                  <h4 className="font-medium mb-2">Your Journey Selections:</h4>
                  <ul className="space-y-2 text-sm">
                    {Object.entries(userProgress.selectedOptions).map(([stepId, optionId]) => {
                      const step = decisionPoints.find(d => d.id === stepId);
                      if (!step || stepId === 'complete') return null;
                      
                      const option = step.options.find(o => o.id === optionId);
                      if (!option) return null;
                      
                      return (
                        <li key={stepId} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <div>
                            <span className="font-medium">{step.title}:</span> {option.label}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              
              {/* Navigation controls */}
              <div className="navigation-controls flex justify-between items-center">
                <Button 
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={userProgress.completedSteps.length === 0}
                >
                  Previous
                </Button>
                
                {/* Progress indicators */}
                <div className="progress-indicators flex space-x-2">
                  {decisionPoints.map((point) => {
                    const isCompleted = userProgress.completedSteps.includes(point.id);
                    const isCurrent = point.id === currentStep;
                    
                    return (
                      <div 
                        key={point.id}
                        className={`w-2 h-2 rounded-full ${
                          isCurrent ? 'bg-purple-600' : 
                          isCompleted ? 'bg-purple-300' : 'bg-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
                
                <Button 
                  onClick={goToNext}
                  disabled={!canProceed}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
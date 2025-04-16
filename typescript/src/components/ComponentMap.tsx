"use client";

import { useEffect, useRef, useState } from "react";
import { useTurboAptos } from "./TurboAptos";
import { Button } from "./ui/button";
import decisionPoints from "@/data/decision-points";
import { ComponentMapMode, UserProgress } from "@/types/component-map";
import { Wand2, GitBranch, Code } from "lucide-react";
import { FlowDiagram } from "./FlowDiagram";

/**
 * Interactive component map visualization that displays the Aptos ecosystem
 * and hacker decision pathways with multiple view options
 */
export function ComponentMap() {
  // View mode state (map, turboApt, or features)
  const [mode, setMode] = useState<ComponentMapMode | 'features'>('features');
  
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
  
  // Handle option selection - shared between both views
  const handleOptionSelect = (decisionId: string, optionId: string) => {
    // Find the decision point
    const decision = decisionPoints.find(d => d.id === decisionId);
    if (!decision) return;
    
    // Find the selected option
    const option = decision.options.find(o => o.id === optionId);
    if (!option) return;
    
    // Update user progress
    setUserProgress(prev => {
      // If this is a new selection for this decision
      const isNewSelection = prev.selectedOptions[decisionId] !== optionId;
      
      // If there's a next step ID and this is in the flow diagram view, mark as completed
      let updatedCompletedSteps = [...prev.completedSteps];
      if (mode === 'map' && isNewSelection && !prev.completedSteps.includes(decisionId)) {
        updatedCompletedSteps = [...updatedCompletedSteps, decisionId];
      }
      
      return {
        ...prev,
        selectedOptions: {
          ...prev.selectedOptions,
          [decisionId]: optionId
        },
        completedSteps: updatedCompletedSteps,
        lastStepId: option.nextStepId || prev.lastStepId
      };
    });
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

  // If we're showing the initial view with the three buttons
  if (mode === 'features') {
    return (
      <div className="component-map-container">
        <div className="flex flex-col items-center justify-center h-full py-8">
          <h2 className="text-2xl font-bold mb-10 text-center">Choose Your Experience</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-8">
            {/* Guided Wizard Card */}
            <div 
              onClick={() => setMode('turboApt')}
              className="cursor-pointer bg-gradient-to-b from-purple-600 to-blue-600 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="p-8 flex flex-col items-center text-white h-full">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <Wand2 size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Guided Wizard</h3>
                <p className="text-sm text-center opacity-90">
                  Step-by-step decision guide with interactive challenges
                </p>
              </div>
            </div>
            
            {/* Flow Diagram Card */}
            <div 
              onClick={() => setMode('map')}
              className="cursor-pointer bg-gradient-to-b from-blue-600 to-cyan-600 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="p-8 flex flex-col items-center text-white h-full">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <GitBranch size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Flow Diagram</h3>
                <p className="text-sm text-center opacity-90">
                  Visual overview of all components and decision points
                </p>
              </div>
            </div>
            
            {/* Inside This dApp Card */}
            <div 
              className="cursor-pointer bg-gradient-to-b from-slate-600 to-slate-800 rounded-lg overflow-hidden shadow-lg transition-all"
            >
              <div className="p-8 flex flex-col items-center text-white h-full">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <Code size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Inside This dApp</h3>
                <p className="text-sm text-center opacity-90">
                  Explore how this application is built (Coming Soon)
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-600 max-w-lg">
            <p>
              Select any option above to explore different aspects of building on 
              Aptos. You can switch between views at any time.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Otherwise, render the selected mode (map or turboApt)
  return (
    <div className="component-map-container">
      {/* Mode toggle */}
      <div className="mode-toggle mb-4 flex gap-2">
        <Button 
          onClick={() => setMode('features')}
          className="mb-2"
          variant="outline"
        >
          ← Back to Options
        </Button>
        
        {mode === 'map' && (
          <Button 
            onClick={() => setMode('turboApt')}
            className="mb-2 ml-auto"
            variant="outline"
          >
            Switch to Guided View
          </Button>
        )}
        
        {mode === 'turboApt' && (
          <Button 
            onClick={() => setMode('map')}
            className="mb-2 ml-auto"
            variant="outline"
          >
            Switch to Map View
          </Button>
        )}
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
        // Map View - Using our new FlowDiagram component
        <div 
          ref={containerRef} 
          className="component-map-visualization border rounded-lg p-8 overflow-auto"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.3s ease'
          }}
        >
          <FlowDiagram
            zoom={zoom}
            userProgress={userProgress}
            onOptionSelect={handleOptionSelect}
            activeNode={activeNode}
            onNodeClick={handleNodeClick}
          />
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
"use client";

import { useEffect, useState } from "react";
import decisionPoints from "@/data/decision-points";
import { UserProgress } from "@/types/component-map";

interface FlowDiagramProps {
  zoom: number;
  userProgress?: UserProgress;
  onOptionSelect: (decisionId: string, optionId: string) => void;
  activeNode: string | null;
  onNodeClick: (nodeId: string) => void;
}

/**
 * FlowDiagram component that creates an interactive decision flow visualization
 * with SVG paths connecting the nodes and interactive options
 */
export function FlowDiagram({ 
  userProgress, 
  onOptionSelect,
  activeNode,
  onNodeClick
}: FlowDiagramProps) {
  const [connectionPaths, setConnectionPaths] = useState<Record<string, string>>({});
  
  // Create mapping of node positions for path calculations
  const nodePositions: Record<string, { top: number, left: number, height: number, width: number }> = {
    'start': { top: 0, left: 400, height: 80, width: 300 },
    'evaluate': { top: 160, left: 400, height: 100, width: 350 },
    'contract': { top: 340, left: 400, height: 100, width: 350 },
    'identity': { top: 520, left: 400, height: 100, width: 350 },
    'data': { top: 700, left: 400, height: 100, width: 350 },
    'deployment': { top: 880, left: 400, height: 100, width: 350 }
  };
  
  // Calculate SVG connection paths
  useEffect(() => {
    const newPaths: Record<string, string> = {};
    
    // Start to Evaluate
    newPaths['start-evaluate'] = `M${nodePositions.start.left + nodePositions.start.width/2},${nodePositions.start.top + nodePositions.start.height} L${nodePositions.evaluate.left + nodePositions.evaluate.width/2},${nodePositions.evaluate.top}`;
    
    // Evaluate to Contract
    newPaths['evaluate-contract'] = `M${nodePositions.evaluate.left + nodePositions.evaluate.width/2},${nodePositions.evaluate.top + nodePositions.evaluate.height} L${nodePositions.contract.left + nodePositions.contract.width/2},${nodePositions.contract.top}`;
    
    // Contract to Identity
    newPaths['contract-identity'] = `M${nodePositions.contract.left + nodePositions.contract.width/2},${nodePositions.contract.top + nodePositions.contract.height} L${nodePositions.identity.left + nodePositions.identity.width/2},${nodePositions.identity.top}`;
    
    // Identity to Data
    newPaths['identity-data'] = `M${nodePositions.identity.left + nodePositions.identity.width/2},${nodePositions.identity.top + nodePositions.identity.height} L${nodePositions.data.left + nodePositions.data.width/2},${nodePositions.data.top}`;
    
    // Data to Deployment
    newPaths['data-deployment'] = `M${nodePositions.data.left + nodePositions.data.width/2},${nodePositions.data.top + nodePositions.data.height} L${nodePositions.deployment.left + nodePositions.deployment.width/2},${nodePositions.deployment.top}`;
    
    setConnectionPaths(newPaths);
  }, []);
  
  // Determine if an option is selected
  const isOptionSelected = (decisionId: string, optionId: string) => {
    return userProgress?.selectedOptions[decisionId] === optionId;
  };
  
  return (
    <div className="flow-diagram relative">
      {/* SVG Connection Paths */}
      <svg className="connections-layer absolute top-0 left-0 w-full h-full pointer-events-none">
        {Object.entries(connectionPaths).map(([key, path]) => {
          const [fromNode] = key.split('-');
          const isActivePath = userProgress?.completedSteps.includes(fromNode);
          
          return (
            <path 
              key={key}
              d={path}
              stroke={isActivePath ? "#8B5CF6" : "#D1D5DB"}
              strokeWidth={isActivePath ? 3 : 2}
              fill="none"
              strokeDasharray={isActivePath ? "none" : "5,5"}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      
      {/* Decision Nodes */}
      <div className="decision-path-container flex flex-col items-center">
        <h3 className="text-xl font-bold mb-8">Hacker&apos;s Decision Pathway</h3>
        
        {/* Start Node */}
        <div 
          className={`decision-node start-node p-4 rounded-lg mb-8 text-center cursor-pointer relative
                    ${activeNode === 'start' ? 'bg-purple-200 border-2 border-purple-500' : 'bg-purple-100 border border-purple-200'}`}
          onClick={() => onNodeClick('start')}
          style={{ maxWidth: '350px' }}
        >
          <div className="font-bold">Start: &quot;I want to build a dApp&quot;</div>
          {activeNode === 'start' && (
            <div className="mt-2 text-sm">
              This is the beginning of your journey to build a decentralized application on Aptos.
              Choose your path wisely!
            </div>
          )}
          
          {/* Decision steps indicator */}
          {userProgress?.completedSteps.includes('start') && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
              ✓
            </div>
          )}
        </div>
        
        {/* Decision Pathways */}
        <div className="decision-paths grid grid-cols-1 gap-8 w-full max-w-3xl">
          {/* Path 1: Evaluate Aptos */}
          <div className="decision-path">
            <div
              data-node-id="evaluate"
              className={`decision-node p-4 rounded-lg cursor-pointer relative
                         ${activeNode === 'evaluate' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
              onClick={() => onNodeClick('evaluate')}
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
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('evaluate', 'choose-aptos') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('evaluate', 'choose-aptos');
                  }}
                >
                  Yes, try Aptos
                </button>
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('evaluate', 'undecided') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-red-100 hover:bg-red-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('evaluate', 'undecided');
                  }}
                >
                  Need more info...
                </button>
              </div>
              
              {/* Decision step indicator */}
              {userProgress?.completedSteps.includes('evaluate') && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                  ✓
                </div>
              )}
            </div>
          </div>
          
          {/* Path 2: Move Contract Approach */}
          <div className="decision-path">
            <div
              data-node-id="contract"
              className={`decision-node p-4 rounded-lg cursor-pointer relative
                         ${activeNode === 'contract' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
              onClick={() => onNodeClick('contract')}
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
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('contract', 'ai-generated') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('contract', 'ai-generated');
                  }}
                >
                  AI-Generated
                </button>
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('contract', 'template-based') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('contract', 'template-based');
                  }}
                >
                  Use Template
                </button>
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('contract', 'migration') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('contract', 'migration');
                  }}
                >
                  Migrate EVM/Solana
                </button>
              </div>
              
              {/* Decision step indicator */}
              {userProgress?.completedSteps.includes('contract') && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                  ✓
                </div>
              )}
            </div>
          </div>
          
          {/* Path 3: Frontend Identity & Wallets */}
          <div className="decision-path">
            <div
              data-node-id="identity"
              className={`decision-node p-4 rounded-lg cursor-pointer relative
                         ${activeNode === 'identity' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
              onClick={() => onNodeClick('identity')}
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
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('identity', 'aptos-connect') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('identity', 'aptos-connect');
                  }}
                >
                  Aptos Connect
                </button>
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('identity', 'social-login') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('identity', 'social-login');
                  }}
                >
                  Google Login
                </button>
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('identity', 'wallet-adapter') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('identity', 'wallet-adapter');
                  }}
                >
                  Wallet Adapter
                </button>
              </div>
              
              {/* Decision step indicator */}
              {userProgress?.completedSteps.includes('identity') && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                  ✓
                </div>
              )}
            </div>
          </div>
          
          {/* Path 4: Data & Indexing */}
          <div className="decision-path">
            <div
              data-node-id="data"
              className={`decision-node p-4 rounded-lg cursor-pointer relative
                         ${activeNode === 'data' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
              onClick={() => onNodeClick('data')}
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
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('data', 'direct-calls') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('data', 'direct-calls');
                  }}
                >
                  Direct On-Chain Calls
                </button>
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('data', 'no-code-indexer') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('data', 'no-code-indexer');
                  }}
                >
                  No-Code Indexer
                </button>
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('data', 'custom-backend') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('data', 'custom-backend');
                  }}
                >
                  Custom Backend
                </button>
              </div>
              
              {/* Decision step indicator */}
              {userProgress?.completedSteps.includes('data') && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                  ✓
                </div>
              )}
            </div>
          </div>
          
          {/* Path 5: Deployment & Testing */}
          <div className="decision-path">
            <div
              data-node-id="deployment"
              className={`decision-node p-4 rounded-lg cursor-pointer relative
                         ${activeNode === 'deployment' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100 border border-blue-200'}`}
              onClick={() => onNodeClick('deployment')}
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
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('deployment', 'one-click') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('deployment', 'one-click');
                  }}
                >
                  One-Click Deploy
                </button>
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('deployment', 'local-cli') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('deployment', 'local-cli');
                  }}
                >
                  Local CLI
                </button>
                <button 
                  className={`option px-2 py-1 rounded text-sm transition-colors
                    ${isOptionSelected('deployment', 'cicd') 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-green-100 hover:bg-green-200 text-black'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionSelect('deployment', 'cicd');
                  }}
                >
                  CI/CD
                </button>
              </div>
              
              {/* Decision step indicator */}
              {userProgress?.completedSteps.includes('deployment') && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                  ✓
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress Summary */}
        {userProgress && Object.keys(userProgress.selectedOptions).length > 0 && (
          <div className="progress-summary mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-2xl">
            <h4 className="text-lg font-medium mb-2">Your Selected Path:</h4>
            <ul className="space-y-1">
              {Object.entries(userProgress.selectedOptions).map(([decisionId, optionId]) => {
                const decision = decisionPoints.find(d => d.id === decisionId);
                if (!decision) return null;
                
                const option = decision.options.find(o => o.id === optionId);
                if (!option) return null;
                
                return (
                  <li key={decisionId} className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span>
                      <span className="font-medium">{decision.title}:</span> {option.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        
        <div className="mt-12 text-center text-gray-500 max-w-2xl">
          <p className="mb-2 italic">Click on decision points to see details, and select options to build your pathway.</p>
          <p>The connections highlight your chosen path through the Aptos ecosystem.</p>
        </div>
      </div>
    </div>
  );
}
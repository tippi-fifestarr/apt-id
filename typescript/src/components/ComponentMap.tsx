"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/button";

/**
 * Interactive component map visualization that displays the Aptos ecosystem
 * and hacker decision pathways
 */
export function ComponentMap() {
  const [zoom, setZoom] = useState(1);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  // Reset zoom
  const handleResetZoom = () => {
    setZoom(1);
    setActiveNode(null);
  };

  // Handle node click to toggle active state
  const handleNodeClick = (nodeId: string) => {
    setActiveNode(prev => prev === nodeId ? null : nodeId);
  };

  return (
    <div className="component-map-container">
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
    </div>
  );
}
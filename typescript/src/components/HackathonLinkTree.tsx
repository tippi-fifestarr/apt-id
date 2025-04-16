"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { UserProgress } from "@/types/component-map";
import decisionPoints from "@/data/decision-points";

// Define the resource link interface
interface ResourceLink {
  title: string;
  url: string;
  description: string;
  completed: boolean;
  isUserProvided?: boolean;
}
import { ExternalLink, Award, CheckCircle2 } from "lucide-react";

/**
 * A LinkTree-style component that displays hackathon resources
 * based on the links discovered in the guided experience
 */
export function HackathonLinkTree() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedSteps: [],
    selectedOptions: {},
    providedLinks: {},
    lastStepId: 'start'
  });
  
  // Load user progress from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedProgress = localStorage.getItem('componentMapProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);
  
  // Get completed links count and total links possible
  const completedLinksCount = Object.keys(userProgress.providedLinks).length;
  const totalLinksCount = decisionPoints.filter(d => d.linkChallenge).length;
  
  // Generate helpful resources links
  const generateResourceLinks = (): ResourceLink[] => {
    const resourceLinks: ResourceLink[] = [
      {
        title: "Aptos Documentation",
        url: "https://aptos.dev/docs",
        description: "Official documentation for the Aptos blockchain",
        completed: true
      },
      {
        title: "Move Language Book",
        url: "https://move-language.github.io/move/",
        description: "Learn the Move programming language for smart contracts",
        completed: userProgress.providedLinks['contract'] !== undefined
      },
      {
        title: "Aptos Wallet Adapter",
        url: "https://github.com/aptos-labs/aptos-wallet-adapter",
        description: "Connect wallets in your Aptos dApp",
        completed: userProgress.providedLinks['identity'] !== undefined
      },
      {
        title: "Aptos CLI Reference",
        url: "https://aptos.dev/tools/aptos-cli",
        description: "Command line tools for development and deployment",
        completed: userProgress.providedLinks['deployment'] !== undefined
      }
    ];
    
    // Add any user-provided links
    for (const [stepId, link] of Object.entries(userProgress.providedLinks)) {
      const step = decisionPoints.find(d => d.id === stepId);
      if (step && step.linkChallenge) {
        resourceLinks.push({
          title: `Your ${step.title} Resource`,
          url: link,
          description: "Link you discovered during guided experience",
          completed: true,
          isUserProvided: true
        });
      }
    }
    
    return resourceLinks;
  };
  
  const resources = generateResourceLinks();
  
  return (
    <div className="hackathon-linktree p-6 max-w-3xl mx-auto">
      <div className="profile-header text-center mb-8">
        <div className="avatar bg-gradient-to-br from-purple-600 to-blue-600 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Award size={48} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Hackathon Resources</h2>
        <p className="text-gray-600">
          Your curated collection of resources for the Aptos Hackathon
        </p>
        <div className="progress mt-4 bg-gray-100 rounded-full h-2 w-48 mx-auto overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full" 
            style={{ width: `${(completedLinksCount / totalLinksCount) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {completedLinksCount} of {totalLinksCount} resources discovered
        </p>
      </div>
      
      <div className="links space-y-3">
        {resources.map((resource, i) => (
          <a 
            key={i}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              link-item block p-4 rounded-lg relative
              transition-all duration-300
              ${resource.completed 
                ? 'bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 border-l-4 border-l-purple-500' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-500 border-l-4 border-l-gray-300'}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-lg">
                    {resource.title}
                  </span>
                  {resource.completed && (
                    <CheckCircle2 size={16} className="ml-2 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                {resource.isUserProvided && (
                  <div className="text-xs mt-2 text-purple-600">You discovered this link!</div>
                )}
              </div>
              <ExternalLink 
                size={18} 
                className={`${resource.completed ? 'text-purple-600' : 'text-gray-400'}`} 
              />
            </div>
          </a>
        ))}
        
        {completedLinksCount < totalLinksCount && (
          <Button
            onClick={() => window.history.back()}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Discover More Resources
          </Button>
        )}
      </div>
      
      <div className="text-center mt-6 text-sm text-gray-500">
        <p>
          Complete the guided experience to unlock all resources
        </p>
      </div>
    </div>
  );
}
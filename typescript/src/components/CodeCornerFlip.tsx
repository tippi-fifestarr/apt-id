"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Code } from 'lucide-react';

/**
 * A page corner flip component that allows switching between frontend and backend views
 * Positioned in the bottom left corner of the screen
 */
export function CodeCornerFlip() {
  const [view, setView] = useState<'frontend' | 'backend'>('frontend');
  const [isHovered, setIsHovered] = useState(false);
  
  // Flip to the other view
  const toggleView = () => {
    setView(view === 'frontend' ? 'backend' : 'frontend');
  };
  
  return (
    <div
      className="fixed bottom-0 left-0 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Folded corner appearance */}
      <div className="relative">
        {/* Main corner fold */}
        <div 
          className={`
            w-64 h-64 bg-gradient-to-br
            ${view === 'frontend'
              ? 'from-blue-700 to-indigo-900'
              : 'from-purple-700 to-indigo-900'}
            transform rotate-0 origin-bottom-left shadow-2xl
            transition-all duration-300 ease-in-out border-t border-l border-white/10
            ${isHovered ? 'scale-105' : 'scale-100'}
            cursor-pointer
          `}
          style={{
            clipPath: 'polygon(0 0, 100% 100%, 0 100%)'
          }}
          onClick={toggleView}
        >
          {/* Folded edge visualization */}
          <div 
            className="absolute top-0 right-0 w-4 h-full bg-white/10"
            style={{
              transform: 'skew(-45deg)',
              right: '6px',
            }}
          />
          
          {/* Text label */}
          <div
            className="absolute bottom-8 left-8 text-white font-semibold text-xl flex items-center"
            style={{
              transform: 'rotate(-45deg)',
              textShadow: '0 0 10px rgba(0, 0, 0, 0.8), 0 0 5px rgba(0, 0, 0, 0.9)',
            }}
          >
            <Code size={28} className="mr-3 drop-shadow-xl" />
            <div className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
              <span className="text-white">See the</span>
              <span className="ml-2 font-bold text-2xl text-white transition-opacity duration-200">
                {view === 'frontend' ? 'Backend' : 'Frontend'}
              </span>
            </div>
          </div>
          
          {/* Icon */}
          <div
            className={`
              absolute top-24 left-24 text-white
              transition-transform duration-300
              ${isHovered ? 'rotate-45' : 'rotate-0'}
            `}
          >
            <ChevronRight size={32} className="drop-shadow-xl" />
          </div>
        </div>
      </div>
      
      {/* Expanded info panel when hovered */}
      <div
        className={`
          absolute bottom-48 left-0 w-80 p-5 rounded-tr-lg rounded-br-lg shadow-xl
          ${view === 'frontend' 
            ? 'bg-blue-800 text-white' 
            : 'bg-purple-800 text-white'}
          transition-all duration-200 ease-in-out
          ${isHovered 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none h-0 p-0 overflow-hidden'}
        `}
      >
        <h3 className="font-bold text-xl mb-3">
          {view === 'frontend' ? 'Frontend Code' : 'Backend Code'}
        </h3>
        <p className="text-sm mb-4 opacity-90">
          {view === 'frontend' 
            ? 'Built with Next.js, React, and TailwindCSS' 
            : 'Smart contracts written in Move for Aptos blockchain'}
        </p>
        <div className="space-y-3">
          <Link 
            href={view === 'frontend' ? '/frontend-code' : '/backend-code'}
            className="block text-base bg-white/10 hover:bg-white/20 p-3 rounded transition-colors"
          >
            View Source Code
          </Link>
          <Link 
            href={view === 'frontend' 
              ? 'https://github.com/aptoslabs/hackathon-project-template/tree/main/typescript' 
              : 'https://github.com/aptoslabs/hackathon-project-template/tree/main/move'
            }
            target="_blank"
            className="block text-base bg-white/10 hover:bg-white/20 p-3 rounded transition-colors"
          >
            GitHub Repository
          </Link>
        </div>
      </div>
    </div>
  );
}
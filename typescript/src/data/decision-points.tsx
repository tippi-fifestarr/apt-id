import React from 'react';
import { DecisionPoint } from '@/types/component-map';

/**
 * Decision points for the TurboTax-style Aptos component map
 * Each point represents a step in the guided experience
 */
const decisionPoints: DecisionPoint[] = [
  {
    id: 'start',
    title: 'Start: "I want to build a dApp"',
    description: 'Beginning your journey to build on Aptos',
    content: (
      <div className="p-6 bg-purple-50 rounded-lg">
        <p className="mb-4">
          Welcome to your journey of building a decentralized application on Aptos!
          This guided experience will help you make key decisions for your project.
        </p>
        <p>
          Choose your path wisely to create an efficient, secure, and user-friendly dApp.
        </p>
      </div>
    ),
    options: [
      {
        id: 'begin',
        label: 'Begin My Journey',
        description: 'Start exploring the key decisions for your Aptos dApp',
        nextStepId: 'evaluate'
      }
    ]
  },
  {
    id: 'evaluate',
    title: 'Evaluate Aptos vs Other Chains',
    description: 'Understand the advantages of Aptos',
    content: (
      <div className="p-6 bg-blue-50 rounded-lg">
        <p className="mb-4">
          Aptos offers several advantages over other blockchains:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Move language for safer smart contracts</li>
          <li>Fast finality with high throughput</li>
          <li>Strong developer tooling and support</li>
          <li>Resource-oriented programming model</li>
        </ul>
        <p>
          Consider these factors when choosing your blockchain platform.
        </p>
      </div>
    ),
    linkChallenge: {
      prompt: 'Find and paste a link to the Aptos documentation to proceed:',
      hint: 'Look for the official Aptos docs website',
      expectedDomain: 'aptos.dev'
    },
    options: [
      {
        id: 'choose-aptos',
        label: 'Choose Aptos',
        description: 'Move forward with Aptos as your blockchain platform',
        nextStepId: 'contract',
        isRecommended: true
      },
      {
        id: 'undecided',
        label: 'I need more information',
        description: 'Explore more resources before deciding',
        nextStepId: 'contract'
      }
    ]
  },
  {
    id: 'contract',
    title: 'Move Contract Approach',
    description: 'Choose how to develop your smart contract',
    content: (
      <div className="p-6 bg-blue-50 rounded-lg">
        <p className="mb-4">
          There are several ways to create Move smart contracts on Aptos:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>AI-Generated Contracts</strong>: Use AI tools to generate Move code from natural language
          </li>
          <li>
            <strong>Template-Based Development</strong>: Start with pre-built patterns for common use cases
          </li>
          <li>
            <strong>Migration from EVM/Solana</strong>: Convert existing contracts from other chains
          </li>
        </ul>
      </div>
    ),
    options: [
      {
        id: 'ai-generated',
        label: 'AI-Generated',
        description: 'Fast development without requiring Move knowledge',
        nextStepId: 'identity',
      },
      {
        id: 'template-based',
        label: 'Template-Based',
        description: 'Start with battle-tested patterns and examples',
        nextStepId: 'identity',
        isRecommended: true
      },
      {
        id: 'migration',
        label: 'Migration',
        description: 'Convert existing contracts from Solidity or Rust',
        nextStepId: 'identity',
      }
    ]
  },
  {
    id: 'identity',
    title: 'Frontend Identity & Wallets',
    description: 'Choose how users will authenticate with your dApp',
    content: (
      <div className="p-6 bg-blue-50 rounded-lg">
        <p className="mb-4">
          Aptos offers multiple approaches for user authentication:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Aptos Connect</strong>: Social login with self-custody
          </li>
          <li>
            <strong>Wallet Adapter</strong>: Traditional Web3 wallet connection
          </li>
          <li>
            <strong>Google/Social Login</strong>: Familiar Web2 login experience
          </li>
        </ul>
        <p className="mt-4">
          Your choice affects user experience and security model.
        </p>
      </div>
    ),
    linkChallenge: {
      prompt: 'Find and paste a link to an Aptos wallet documentation:',
      hint: 'Look for Petra, Martian, or another Aptos wallet documentation',
      expectedDomain: 'petra.app'
    },
    options: [
      {
        id: 'aptos-connect',
        label: 'Aptos Connect',
        description: 'Best user experience with social login and self-custody',
        nextStepId: 'data',
        isRecommended: true
      },
      {
        id: 'wallet-adapter',
        label: 'Wallet Adapter',
        description: 'Traditional Web3 login with external wallets',
        nextStepId: 'data'
      },
      {
        id: 'social-login',
        label: 'Social Login',
        description: 'Familiar login experience for Web2 users',
        nextStepId: 'data'
      }
    ]
  },
  {
    id: 'data',
    title: 'Data & Indexing',
    description: 'Choose how to access blockchain data',
    content: (
      <div className="p-6 bg-blue-50 rounded-lg">
        <p className="mb-4">
          Decide how your application will access and process blockchain data:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Direct On-Chain Calls</strong>: Simple but limited to current state
          </li>
          <li>
            <strong>No-Code Indexer</strong>: Easy historical data without backend
          </li>
          <li>
            <strong>Custom Backend</strong>: Full control for complex requirements
          </li>
        </ul>
      </div>
    ),
    options: [
      {
        id: 'direct-calls',
        label: 'Direct On-Chain Calls',
        description: 'Simplest approach for accessing current state data',
        nextStepId: 'deployment',
      },
      {
        id: 'no-code-indexer',
        label: 'No-Code Indexer',
        description: 'Access historical data without building a backend',
        nextStepId: 'deployment',
        isRecommended: true
      },
      {
        id: 'custom-backend',
        label: 'Custom Backend',
        description: 'Maximum flexibility for complex data requirements',
        nextStepId: 'deployment',
      }
    ]
  },
  {
    id: 'deployment',
    title: 'Deployment & Testing',
    description: 'Choose your deployment strategy',
    content: (
      <div className="p-6 bg-blue-50 rounded-lg">
        <p className="mb-4">
          Select the best deployment approach for your project:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>One-Click Deploy</strong>: Fastest for hackathons and prototypes
          </li>
          <li>
            <strong>Local CLI</strong>: More control over deployment parameters
          </li>
          <li>
            <strong>CI/CD</strong>: Professional development workflow
          </li>
        </ul>
      </div>
    ),
    options: [
      {
        id: 'one-click',
        label: 'One-Click Deploy',
        description: 'Deploy quickly with minimal configuration',
        nextStepId: 'complete',
        isRecommended: true
      },
      {
        id: 'local-cli',
        label: 'Local CLI',
        description: 'Use Aptos CLI for controlled deployment',
        nextStepId: 'complete'
      },
      {
        id: 'cicd',
        label: 'CI/CD Pipeline',
        description: 'Professional workflow with automated testing',
        nextStepId: 'complete'
      }
    ]
  },
  {
    id: 'complete',
    title: 'Journey Complete!',
    description: 'You\'ve made all the key decisions',
    content: (
      <div className="p-6 bg-green-50 rounded-lg">
        <h3 className="text-lg font-bold text-green-800 mb-4">Congratulations!</h3>
        <p className="mb-4">
          You&apos;ve completed your journey through the key decisions for building on Aptos.
          Here&apos;s a summary of your choices:
        </p>
        <div className="summary-placeholder bg-white p-4 rounded border border-green-200 mb-4">
          {/* This will be replaced with actual choices in the UI */}
          <p className="text-gray-500 italic">Your selections will appear here...</p>
        </div>
        <p>
          You&apos;re now ready to start building your Aptos dApp with confidence!
        </p>
      </div>
    ),
    options: [
      {
        id: 'restart',
        label: 'Start Over',
        description: 'Explore different options for your Aptos dApp',
        nextStepId: 'start'
      }
    ],
    completion: {
      message: "You've successfully navigated the Aptos ecosystem decision map!"
    }
  }
];

export default decisionPoints;
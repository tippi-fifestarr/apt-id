"use client";

import React from 'react';
import { Tour } from '@/components/TurboAptos';

/**
 * Tour configuration for guiding users on how to access the secret component map
 * by getting a testnet ANS name and adding it to the allowlist
 */
export const howToUseTour: Tour = {
  id: 'how-to-use',
  title: 'How to Access Secret Features',
  description: 'Learn how to get a testnet ANS name and access the secret map',
  steps: [
    {
      id: 'intro',
      title: 'Welcome to Apt-ID!',
      content: (
        <div className="space-y-3">
          <p>
            This guide will help you access the secret component map by getting your own
            testnet ANS name.
          </p>
          <p>
            Follow along to learn how to register a name and activate the secret feature.
          </p>
        </div>
      ),
      position: 'bottom'
    },
    {
      id: 'visit-ans',
      title: 'Visit Testnet ANS',
      content: (
        <div className="space-y-3">
          <p>
            First, you need to visit the Aptos Name Service on testnet:
          </p>
          <div className="bg-gray-50 p-2 rounded">
            <a 
              href="https://testnet.aptosnames.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline font-medium"
            >
              testnet.aptosnames.com
            </a>
          </div>
          <p>
            Make sure you have a wallet with some testnet APT for the transaction.
          </p>
        </div>
      ),
      position: 'bottom'
    },
    {
      id: 'connect-wallet',
      title: 'Connect Your Wallet',
      content: (
        <div className="space-y-3">
          <p>
            On the ANS testnet site, connect your wallet using the &quot;Connect Wallet&quot; button
            in the top right corner.
          </p>
          <div className="bg-gray-50 p-2 rounded text-sm">
            <strong>TIP:</strong> Make sure you&apos;re using the same wallet you plan to use with Apt-ID.
          </div>
        </div>
      ),
      position: 'right',
      targetSelector: '.wallet-connection'
    },
    {
      id: 'register-name',
      title: 'Register a Name',
      content: (
        <div className="space-y-3">
          <p>
            Search for an available name and register it. Choose any name you&apos;d like!
          </p>
          <div className="bg-gray-50 p-2 rounded text-sm">
            <strong>TIP:</strong> Longer names like &apos;tippitippi.apt&apos; cost less testnet APT than 
            short names like &apos;tippi.apt&apos;.
          </div>
          <p className="text-sm text-gray-600 italic">
            Follow the registration process on the ANS website to complete this step.
          </p>
        </div>
      ),
      position: 'bottom'
    },
    {
      id: 'add-to-constants',
      title: 'Add Your Name to the Allowlist',
      content: (
        <div className="space-y-3">
          <p>
            Now that you have an ANS name, you need to add it to the allowlist in the code.
          </p>
          <p>
            Open <code className="bg-gray-100 px-1 rounded">typescript/src/constants.ts</code> and add your name to the <code className="bg-gray-100 px-1 rounded">ALLOWLISTED_NAMES</code> array:
          </p>
          <div className="bg-gray-100 p-2 rounded text-sm font-mono">
            export const ALLOWLISTED_NAMES = [<br/>
            &nbsp;&nbsp;&quot;greg.apt&quot;,<br/>
            &nbsp;&nbsp;&quot;wingbird.apt&quot;,<br/>
            &nbsp;&nbsp;&quot;<span className="text-green-600">yourname.apt</span>&quot;<br/>
            ];
          </div>
        </div>
      ),
      position: 'bottom'
    },
    {
      id: 'restart-app',
      title: 'Restart the App',
      content: (
        <div className="space-y-3">
          <p>
            After adding your name, save the file and restart the development server:
          </p>
          <div className="bg-gray-100 p-2 rounded text-sm font-mono">
            pnpm dev
          </div>
          <p className="text-sm italic">
            (As Greg always says, &quot;pnpm is faster than npm!&quot;)
          </p>
        </div>
      ),
      position: 'bottom'
    },
    {
      id: 'connect-wallet-to-app',
      title: 'Connect Your Wallet',
      content: (
        <div className="space-y-3">
          <p>
            Once the app has restarted, connect your wallet by clicking the &quot;Connect Wallet&quot; button.
          </p>
          <p>
            Make sure to use the same wallet that owns your ANS name.
          </p>
        </div>
      ),
      position: 'bottom',
      targetSelector: '.wallet-selector-container'
    },
    {
      id: 'secret-button-appears',
      title: 'Find the Secret Button',
      content: (
        <div className="space-y-3">
          <p>
            The secret button should now appear in the bottom right corner of the screen!
          </p>
          <p>
            Click it to access the interactive component map.
          </p>
          <div className="bg-purple-100 p-2 rounded text-sm">
            <strong>✨ Congratulations!</strong> You now have access to the secret feature.
          </div>
        </div>
      ),
      position: 'left',
      targetSelector: '.secret-button'
    }
  ],
  onComplete: () => {
    console.log('How to Use tour completed');
    // Store in localStorage to prevent showing it again (client-side only)
    if (typeof window !== 'undefined') {
      localStorage.setItem('howToUseTourCompleted', 'true');
    }
  }
};
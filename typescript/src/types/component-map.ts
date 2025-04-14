// Types for the Component Map TurboTax-style experience

// View mode for the component map
export type ComponentMapMode = 'map' | 'turboApt';

// Decision point structure for the wizard flow
export interface DecisionPoint {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  options: DecisionOption[];
  linkChallenge?: {
    prompt: string;
    hint?: string;
    expectedDomain?: string;
  };
  completion?: {
    message: string;
    nextStepId?: string;
  };
}

// Option for a decision point
export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  nextStepId?: string;
  isRecommended?: boolean;
}

// Track user progress through the wizard
export interface UserProgress {
  completedSteps: string[];
  selectedOptions: Record<string, string>;
  providedLinks: Record<string, string>;
  lastStepId: string;
}

// Component node for visualization
export interface ComponentNode {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'integration' | 'tool' | 'concept';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  implemented: boolean;
  codeExamples?: {
    typescript?: string;
    move?: string;
  };
}

// Connection between component nodes
export interface Connection {
  from: string;
  to: string;
  label?: string;
}
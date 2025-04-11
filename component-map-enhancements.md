# Component Map TurboTax-Style Enhancements

Based on your feedback, I'll outline a comprehensive plan to enhance the secret component map with a true TurboTax-style experience. The current implementation has a tour system that guides users with tooltips and highlights, but doesn't transform the map into the sequential wizard-like experience you envisioned.

## Current Implementation vs. Desired Experience

### Current Implementation:
- **Tour-based guidance**: Tooltips and highlights that explain elements of the map
- **All decision points visible simultaneously**: Users see the entire map at once
- **Passive learning experience**: Users observe rather than actively participate

### Desired TurboTax-Style Experience:
- **Sequential step-by-step wizard**: One decision point at a time
- **Active user participation**: Users make choices to proceed
- **Linear progression**: Clear next/previous navigation
- **Interactive challenges**: Users complete tasks (like filling in links) to progress

## Required Enhancements

### 1. Component Map Modes

Create two distinct modes for the Component Map:

```typescript
type ComponentMapMode = 'map' | 'turboApt';
```

- **Map Mode**: The current visualization showing all decision points simultaneously
- **TurboApt Mode**: A step-by-step wizard presenting one decision at a time

A toggle button will allow users to switch between modes:

```tsx
<Button 
  onClick={() => setMode(mode === 'map' ? 'turboApt' : 'map')}
  className="mb-4"
>
  Switch to {mode === 'map' ? 'Guided' : 'Map'} View
</Button>
```

### 2. TurboApt Mode Implementation

In TurboApt mode, the component map will:

1. **Present one decision at a time** with a focused view:
   ```tsx
   {mode === 'turboApt' && (
     <div className="decision-wizard">
       <h3>Step {currentStep + 1}: {decisionPoints[currentStep].title}</h3>
       <div className="decision-content">{decisionPoints[currentStep].content}</div>
       
       {/* Options for this decision */}
       <div className="decision-options">
         {decisionPoints[currentStep].options.map(option => (
           <DecisionOption 
             key={option.id}
             option={option}
             onSelect={handleOptionSelect}
           />
         ))}
       </div>
       
       {/* Navigation buttons */}
       <div className="navigation-controls">
         <Button disabled={currentStep === 0} onClick={goToPrevious}>Previous</Button>
         <Button disabled={!canProceed} onClick={goToNext}>Next</Button>
       </div>
     </div>
   )}
   ```

2. **Require active participation** to proceed:
   - Users must select an option before proceeding
   - Each step may have additional interactive elements

3. **Include interactive link challenges**:
   - For each decision point, users are prompted to input the correct link
   - Links are validated before allowing progression

```tsx
function LinkChallenge({ onComplete }) {
  const [linkInput, setLinkInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  
  const checkLink = () => {
    // Basic validation for now
    if (linkInput.includes('aptos') && linkInput.startsWith('http')) {
      setIsCorrect(true);
      onComplete(linkInput);
    } else {
      setIsCorrect(false);
    }
  };
  
  return (
    <div className="link-challenge">
      <p>Find and paste the correct link to continue:</p>
      <input 
        value={linkInput}
        onChange={(e) => setLinkInput(e.target.value)}
        placeholder="https://..." 
        className="link-input"
      />
      <Button onClick={checkLink}>Verify Link</Button>
      
      {isCorrect && <p className="success">Correct! You can proceed.</p>}
    </div>
  );
}
```

### 3. Decision Data Structure

Each decision point will have a more comprehensive data structure:

```typescript
interface DecisionPoint {
  id: string;
  title: string;
  description: string;
  content: ReactNode;
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

interface DecisionOption {
  id: string;
  label: string;
  description: string;
  nextStepId?: string;
  isRecommended?: boolean;
}
```

### 4. User Progress Tracking

Track and persist user's progress:

```typescript
interface UserProgress {
  completedSteps: string[];
  selectedOptions: Record<string, string>;
  providedLinks: Record<string, string>;
  lastStepId: string;
}
```

Store this in localStorage to allow users to continue where they left off:

```typescript
function saveProgress(progress: UserProgress) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('componentMapProgress', JSON.stringify(progress));
  }
}

function loadProgress(): UserProgress | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('componentMapProgress');
    return saved ? JSON.parse(saved) : null;
  }
  return null;
}
```

### 5. Smart Contract Integration Placeholders

Add TODOs for future smart contract integration:

```typescript
// TODO: Implement smart contract for verifying user-provided links
// The contract should:
// 1. Store authorized links for each decision point
// 2. Allow updating links by authorized parties
// 3. Provide verification methods for user submissions
// 4. Track user completion on-chain for potential rewards

// Example future implementation:
async function verifyLinkOnChain(stepId: string, providedLink: string): Promise<boolean> {
  // TODO: Call smart contract to verify link
  // const contract = await getContract();
  // return contract.verifyLink(stepId, providedLink);
  return true; // Placeholder
}
```

### 6. UI Button Positioning

Adjust the positioning of the buttons to ensure they don't run off screen:

```css
.button-stack {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 50;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}
```

Add conditional rendering for the How to Use button:

```tsx
{/* Only show How to Use button if secret button is not visible */}
{!isAllowlisted && <HowToUseButton />}
<FeedbackButton />
{isAllowlisted && <SecretButton />}
```

## Implementation Plan

1. **Modify ComponentMap.tsx** to support both modes
2. **Create new components** for the TurboApt experience:
   - DecisionWizard
   - DecisionOption
   - LinkChallenge
   - ProgressIndicator
3. **Update button positioning** and conditional rendering
4. **Define decision point data** with comprehensive information
5. **Implement user progress tracking**
6. **Add placeholders** for future smart contract integration

This approach will transform the component map into a true TurboTax-style experience, guiding users through one decision at a time and requiring active participation through challenges and choices.
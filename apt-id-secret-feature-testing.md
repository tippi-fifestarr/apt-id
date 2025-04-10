# Apt-ID Secret Feature Testing Guide

This guide explains how to test the secret feature that provides access to an interactive component map for users with specific ANS names.

## Implementation Overview

We've implemented a feature that:

1. Checks if the connected wallet has an allowlisted ANS name (greg.apt or wingbird.apt)
2. Displays a special button for these users in the bottom-right corner of the screen
3. When clicked, opens a dialog with an interactive component map showing the Aptos ecosystem

## Files Created/Modified

- **typescript/src/constants.ts** - Added ALLOWLISTED_NAMES array
- **typescript/src/hooks/useAllowlistedName.ts** - Custom hook to check if a user has an allowlisted name
- **typescript/src/components/SecretButton.tsx** - Button that appears only for allowlisted users
- **typescript/src/components/ComponentMapDialog.tsx** - Dialog for the component map
- **typescript/src/components/ComponentMap.tsx** - Interactive component map visualization
- **typescript/src/app/layout.tsx** - Updated to include the SecretButton

## Testing Instructions

### Prerequisites
- Running Apt-ID application (local or deployed)
- A wallet with an ANS name (for full testing)

### Test Cases

#### 1. Verify Secret Button Appears for Allowlisted Names

1. Connect a wallet with one of these ANS names:
   - greg.apt
   - wingbird.apt

2. After connecting, you should see a special button appear in the bottom-right corner of the screen with a sparkle icon (✨) and text "View Component Map"

3. If using a wallet without an allowlisted name, the button should not appear

#### 2. Test Component Map Dialog

1. Connect a wallet with an allowlisted name
2. Click the "View Component Map" button
3. Verify the dialog opens with the title "Aptos Ecosystem Component Map"
4. The dialog should display the interactive component map

#### 3. Test Component Map Interactivity

1. In the component map dialog, try the following interactions:
   - Click the "Zoom In" and "Zoom Out" buttons to adjust the zoom level
   - Click the "Reset View" button to reset the zoom
   - Click on any decision node to see additional details appear
   - Click again to collapse the details

### Local Development Testing

For testing during development without an actual wallet with these ANS names, you can temporarily modify the hook:

```typescript
// In useAllowlistedName.ts, you can force the hook to return true for testing
export function useAllowlistedName() {
  const { ansName, loading } = useAptosName();
  const [isAllowlisted, setIsAllowlisted] = useState<boolean>(true); // Force true for testing

  // ... rest of the hook
}
```

## Expected Behavior

1. **Regular users** (without greg.apt or wingbird.apt names) should not see any difference in the UI
2. **Allowlisted users** should see the secret button and be able to access the component map

## Technical Notes

- The feature uses the existing useAptosName hook to get the user's ANS name
- The button and dialog use Tailwind CSS for styling, matching the existing design system
- The component map is a simplified version that could be enhanced with D3.js for a more sophisticated visualization

## Future Enhancements

1. Add animated connections between decision points using SVG paths
2. Implement path highlighting when selecting related nodes
3. Add more detailed technical information for each component
4. Create a more sophisticated visualization with proper zoom and pan capabilities
5. Add the ability to save or export a custom decision path

This secret feature provides a valuable tool for hackathon participants to understand the Aptos ecosystem components and make informed decisions about their project architecture.
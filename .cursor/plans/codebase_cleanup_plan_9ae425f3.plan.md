---
name: Codebase Cleanup Plan
overview: Clean up dead code, unused imports, and fix React best practice violations identified by ESLint. All changes are safe refactors that preserve existing functionality.
todos:
  - id: phase1-dead-code
    content: Remove unused imports and variables from ~15 files
    status: pending
  - id: phase2a-render-components
    content: Fix components created during render (SessionJournal, ShipStatus)
    status: pending
  - id: phase2b-declaration-order
    content: Fix variable access before declaration (OracleResultDisplay, SpaceCombatView)
    status: pending
  - id: phase2c-hooks-rules
    content: Fix conditional useEffect in CharacterJournal.jsx
    status: pending
  - id: phase2d-case-blocks
    content: Fix case block declarations in GameFlowDrawer.jsx
    status: pending
  - id: phase3-cleanup
    content: Remove unused asset and clean test file imports
    status: pending
---

# Codebase Cleanup Plan

## Summary of Issues Found

ESLint identified **64 errors and 7 warnings** across the codebase. The issues fall into these categories:

| Category | Count | Risk Level |
|----------|-------|------------|
| Unused imports/variables | 35+ | Very Low |
| React hooks violations | 12 | Medium |
| Components created in render | 6 | Medium |
| Variable access before declaration | 4 | Medium |
| Fast refresh warnings | 6 | Very Low |

---

## Phase 0: Add Component Tests (Safety Net)

Before refactoring, add tests for the components we're modifying to catch any regressions.

### Test Setup

Create test utilities with mocked contexts to simplify component testing.

**Create [src/test/testUtils.jsx](src/test/testUtils.jsx)**

- Wrapper component with all context providers mocked
- Mock implementations for GameContext, CharacterContext, AuthContext, PartyContext, SpaceCombatContext

### Components to Test

**[src/components/oracles/OracleResultDisplay.test.jsx](src/components/oracles/OracleResultDisplay.test.jsx)**

- Test: Renders with result data
- Test: Navigation buttons work (handleNext/handlePrevious)
- Test: Keyboard navigation (Arrow keys)
- Focus: Verify navigation logic works before we reorder declarations

**[src/components/spacecombat/ShipStatus.test.jsx](src/components/spacecombat/ShipStatus.test.jsx)**

- Test: Renders with different armor values (0, 1, 2, 3)
- Test: Correct shield icon displays for each tier
- Focus: Verify ShieldIcon renders correctly before we refactor

**[src/components/character/CharacterJournal.test.jsx](src/components/character/CharacterJournal.test.jsx)**

- Test: Renders null when no character (early return)
- Test: Renders toolbar when character exists
- Test: Toolbar buttons are clickable
- Focus: Verify conditional rendering works before we fix hooks

**[src/components/journal/SessionJournal.test.jsx](src/components/journal/SessionJournal.test.jsx)**

- Test: Renders editor and toolbar
- Test: Toolbar buttons render correctly
- Focus: Verify ToolbarButton works before extraction

**[src/components/spacecombat/SpaceCombatView.test.jsx](src/components/spacecombat/SpaceCombatView.test.jsx)**

- Test: Renders combat view
- Test: Exit handler works (ESC key)
- Focus: Verify exit logic before declaration reorder

---

## Phase 1: Dead Code Removal (Lowest Risk)

Remove unused imports and variables. These are safe deletions that have zero functional impact.

### Files to clean:

**Layout/Core:**

- [src/App.jsx](src/App.jsx) - Remove unused `data` variable (line 35)
- [src/components/layout/Dashboard.jsx](src/components/layout/Dashboard.jsx) - Remove `useRef`, `gameState`, `updateGameState`
- [src/components/layout/GameFlowDrawer.jsx](src/components/layout/GameFlowDrawer.jsx) - Remove `generateQuickMission`, `soloOracles`, `getStepIcon`

**Character:**

- [src/components/character/CharacterGenerator.jsx](src/components/character/CharacterGenerator.jsx) - Remove `rollTable`, `selectedClass`, `generating`
- [src/components/character/CharacterSheetDrawer.jsx](src/components/character/CharacterSheetDrawer.jsx) - Remove `presenceState`

**Oracles:**

- [src/components/oracles/OracleCompendium.jsx](src/components/oracles/OracleCompendium.jsx) - Remove 9 unused imports/variables
- [src/components/oracles/OracleTable.jsx](src/components/oracles/OracleTable.jsx) - Remove `rollDice`
- [src/components/oracles/Dice.jsx](src/components/oracles/Dice.jsx) - Remove `label`

**Space Combat:**

- [src/components/spacecombat/SpaceCombatView.jsx](src/components/spacecombat/SpaceCombatView.jsx) - Remove `roomCode`, `spaceCombat`, `partyMembers`
- [src/components/spacecombat/CombatActions.jsx](src/components/spacecombat/CombatActions.jsx) - Remove `getSteadyTargetCount`
- [src/components/spacecombat/TorpedoSelector.jsx](src/components/spacecombat/TorpedoSelector.jsx) - Remove `isStandard`
- [src/context/SpaceCombatContext.jsx](src/context/SpaceCombatContext.jsx) - Remove `roomCode`

**Ship/Other:**

- [src/components/ship/ShipManager.jsx](src/components/ship/ShipManager.jsx) - Remove `getUpgradeName`
- [src/components/ui/QuickReferenceDrawer.jsx](src/components/ui/QuickReferenceDrawer.jsx) - Remove `useState`
- [src/data/progressionData.js](src/data/progressionData.js) - Remove `smugglerData`, `youngsterData`, unused `_` params
- [src/utils/shipUpgrades.js](src/utils/shipUpgrades.js) - Remove unused `type`

---

## Phase 2: React Hooks Best Practice Fixes (Medium Risk)

These require careful refactoring but don't change functionality.

### 2a. Fix Components Created During Render

**[src/components/journal/SessionJournal.jsx](src/components/journal/SessionJournal.jsx)**
Move `ToolbarButton` component outside the parent component to prevent recreation on every render.

**[src/components/spacecombat/ShipStatus.jsx](src/components/spacecombat/ShipStatus.jsx)**
Refactor dynamic `ShieldIcon` to use a memoized approach or inline the JSX.

### 2b. Fix Variable Access Before Declaration

**[src/components/oracles/OracleResultDisplay.jsx](src/components/oracles/OracleResultDisplay.jsx)**
Move `handlePrevious` and `handleNext` declarations above the `useEffect` that uses them.

**[src/components/spacecombat/SpaceCombatView.jsx](src/components/spacecombat/SpaceCombatView.jsx)**
Move `handleExitCombatView` declaration above the `useEffect` that uses it.

### 2c. Fix Rules of Hooks Violation

**[src/components/character/CharacterJournal.jsx](src/components/character/CharacterJournal.jsx)** (line 84)
This is a critical issue - `useEffect` is called after an early return. Restructure to ensure hooks are called unconditionally.

### 2d. Fix Case Block Declarations

**[src/components/layout/GameFlowDrawer.jsx](src/components/layout/GameFlowDrawer.jsx)** (lines 267-268)
Wrap case block content in braces to create proper scope for lexical declarations.

---

## Phase 3: Minor Cleanup (Very Low Risk)

### 3a. Remove Unused Asset

- Delete [src/assets/react.svg](src/assets/react.svg) - Vite boilerplate file, not used anywhere

### 3b. Test File Cleanup

Clean up minor unused imports in test files:

- [src/test/setup.js](src/test/setup.js) - Remove `expect` import
- [src/utils/dice.test.js](src/utils/dice.test.js) - Remove unused function imports
- [src/lib/keyboardUtils.test.js](src/lib/keyboardUtils.test.js) - Remove `originalActiveElement`
- [src/data/starforgedOracles.test.js](src/data/starforgedOracles.test.js) - Remove `index` param

---

## Items NOT Being Changed

The following warnings are intentional patterns and will be left as-is:

1. **Fast refresh warnings in context files** - Exporting hooks from context files is a common React pattern
2. **setState-in-effect warnings** - Some are necessary for syncing with external state (TipTap editor, realtime subscriptions)
3. **Missing useEffect dependencies** - Some are intentionally omitted to prevent infinite loops

---

## Verification

After each phase:

1. Run `npm run lint` to verify issues are resolved
2. Run `npm test` to ensure tests still pass
3. Run `npm run dev` and manually verify app functionality

---

## Implementation Todos

- [ ] **phase0-test-utils** - Create test utilities with mocked contexts
- [ ] **phase0-tests** - Add component tests for OracleResultDisplay, ShipStatus, CharacterJournal, SessionJournal, SpaceCombatView
- [ ] **phase1-dead-code** - Remove unused imports and variables from ~15 files
- [ ] **phase2a-render-components** - Fix components created during render (SessionJournal, ShipStatus)
- [ ] **phase2b-declaration-order** - Fix variable access before declaration (OracleResultDisplay, SpaceCombatView)
- [ ] **phase2c-hooks-rules** - Fix conditional useEffect in CharacterJournal.jsx
- [ ] **phase2d-case-blocks** - Fix case block declarations in GameFlowDrawer.jsx
- [ ] **phase3-cleanup** - Remove unused asset and clean test file imports
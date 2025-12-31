---
name: Perilous Void Oracle Integration
overview: "Add Perilous Void oracles with a runtime toggle: Opening Scenes merge into d30 when enabled, Inciting Incident added as campaign sub-oracle. Toggle persisted in game settings."
todos:
  - id: create-pv-data
    content: Create perilousVoidOracles.js with opening scenes, inciting incidents, and generator
    status: completed
  - id: add-toggle-context
    content: Add includePVOracles toggle to GameContext with localStorage persistence
    status: completed
  - id: create-opening-generator
    content: Create generateOpeningScene() in oracles.js with PV toggle support
    status: completed
  - id: add-inciting-tab
    content: Add Inciting Incident tab to MissionGenerator (visible when PV enabled)
    status: completed
  - id: update-display
    content: Add incident + followUpQuestions rendering to display components
    status: completed
  - id: update-consumers
    content: Update GameFlowDrawer and OracleCompendium to use new generator with toggle
    status: completed
  - id: add-toggle-ui
    content: Add UI toggle for Perilous Void oracles in settings/header area
    status: completed
---

# Perilous Void Oracle Integration (with Runtime Toggle)

## Architecture

Keep data separate, merge at runtime based on user setting:

```mermaid
graph TD
    subgraph Settings [Game Context]
        Toggle[includePVOracles: boolean]
    end
    
    subgraph Data [Separate Data Files]
        SB[oracles.js - Star Borg d20]
        PV[perilousVoidOracles.js - PV d10]
    end
    
    subgraph Generator [Runtime Merge]
        Gen[generateOpeningScene]
        Check{PV Enabled?}
    end
    
    Toggle --> Check
    Check -->|Yes| D30[Roll d30 - Combined]
    Check -->|No| D20[Roll d20 - Star Borg only]
    SB --> Gen
    PV --> Gen
```

## Implementation

### 1. Create `src/data/perilousVoidOracles.js`

Isolated file with:

- `pvOpeningScenes` - 10 entries with `{ incident, followUpQuestions }`
- `pvIncitingIncidents` - 10 entries with same structure
- `generatePVIncitingIncident()` function
- Source attribution comments

### 2. Add toggle to GameContext

Update [GameContext.jsx](src/context/GameContext.jsx):

- Add `includePVOracles` to game state (default: true)
- Add `togglePVOracles()` action
- Persist to localStorage with other settings

### 3. Create unified opening scene generator in oracles.js

Update [oracles.js](src/data/oracles.js):

- New export: `generateOpeningScene(includePV = true)`
- If `includePV`: roll d30, entries 1-20 from Star Borg, 21-30 from PV import
- If not: roll d20, Star Borg only
- Returns `{ roll, result }` or `{ roll, incident, followUpQuestions, source }` for PV entries

### 4. Add Inciting Incident to MissionGenerator

Update [MissionGenerator.jsx](src/components/oracles/generators/MissionGenerator.jsx):

- Add "Inciting" tab (only visible when PV enabled)
- Import `generatePVIncitingIncident` from perilousVoidOracles.js

### 5. Update display components

Add rendering for `result.incident && result.followUpQuestions` in:

- [OracleResultDisplay.jsx](src/components/oracles/OracleResultDisplay.jsx)
- [CompactOracleResult.jsx](src/components/oracles/CompactOracleResult.jsx)

### 6. Update consumers

**GameFlowDrawer.jsx:**

- Import `useGame` to get `includePVOracles` setting
- Pass setting to `generateOpeningScene()`

**OracleCompendium.jsx:**

- Update Opening Scene table to show d20 or d30 based on toggle
- Consider showing toggle UI here or in a settings area

### 7. Add toggle UI

Add checkbox/toggle in Header settings or Oracle Compendium:

- "Include Perilous Void Oracles"
- Controls `includePVOracles` in GameContext

## Modularity

To fully remove Perilous Void:

1. Delete `perilousVoidOracles.js`
2. Remove import and PV logic from `generateOpeningScene()`
3. Remove toggle from GameContext and UI
4. Remove Inciting tab from MissionGenerator

To temporarily disable: Just toggle off in UI.
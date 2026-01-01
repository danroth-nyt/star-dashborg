# Changelog

All notable changes to Star Dashborg are documented in this file.

## [Current Branch] - Latest Changes

### 🚀 Space Combat System Enhancements

#### ✨ Major Features
- **Modular Battle Stations**: Refactored space combat into reusable station components
  - `PilotStation.jsx` - Ship movement and evasion controls
  - `CopilotStation.jsx` - Targeting and torpedo coordination
  - `GunnerStation.jsx` - Dual gunner turret operations (Gunner 1/2)
  - `EngineerStation.jsx` - Dual engineer system management (Engineer 1/2)
  - Each station is self-contained with assignment and action logic
  
- **Station Grid Layout**: Organized station display by ship deck
  - Command Deck section (Pilot, Co-Pilot)
  - Weapons Deck section (Gunner 1, Gunner 2)
  - Engineering Bay section (Engineer 1, Engineer 2)
  - Visual deck headers with color-coded themes
  - Responsive grid layout for all screen sizes

- **Immersive Sound Effects System**: 14 new audio files for space combat
  - `laser-fire.mp3`, `laser-fire-short.mp3` - Weapon fire sounds
  - `torpedo-fire.mp3`, `load-torpedo.mp3` - Torpedo mechanics
  - `shield-hit.mp3`, `shield-power-up.mp3`, `repair-shield.mp3` - Shield systems
  - `evade.mp3`, `steady.mp3`, `target-lock.mp3` - Piloting maneuvers
  - `deflectors.mp3`, `jamming.mp3` - Engineering systems
  - `hyperdrive-charge.mp3` - FTL preparation
  - `alarm-critical.mp3` - Critical damage warnings
  - `useSoundEffects.js` hook manages audio playback and muting

### 🔮 Oracle System Expansions

#### ✨ Perilous Void Integration (Complete)
- **Opening Scenes Enhancement**: Smart duplicate handling
  - When PV disabled: d20 rolls on Star Borg core content
  - When PV enabled: d29 rolls (19 Star Borg + 10 PV)
  - Automatically skips Star Borg #5 "Bounty Hunter" to avoid PV duplicate
  
- **Inciting Incidents**: Toggle-based content mixing
  - PV adds 10 mission hooks with rich detail
  - Combines with existing Star Borg incidents
  - Dynamic die size adjustment based on enabled sources

#### ✨ Starforged Integration (NEW)
- **19 Inciting Incidents**: Ironsworn: Starforged campaign starts
  - Aid stranded starships, broker peace, chart new passages
  - Defend settlements, investigate mysteries, escort cargo
  - Prison break duplicate intelligently filtered when PV enabled
  - `starforgedOracles.js` data file with generator functions
  
- **Multi-Source Oracle Mixing**: All three systems work together
  - Star Borg (20 base) + Perilous Void (10) + Starforged (19)
  - Intelligent deduplication prevents redundant content
  - Settings toggles enable granular content control
  - Dynamic die sizes: d10, d19, d28, d29 depending on sources

#### ✨ Enhanced Oracle Mechanics
- **NPC Generator**: Now includes character names
  - Full NPC generation includes name, role, species, etc.
  - Log output shows complete NPC details
  - Travel encounter improvements

- **Event Oracle**: Better logging output
  - Now includes specific detail field in logs
  - Format: `Event (roll): [verb] [subject] - [specific]`

### 🎨 UI/UX Improvements

#### ✨ Loading Experience
- **LoadingScreen Component**: Unified app initialization
  - Prevents jarring flashes during startup
  - Smooth typewriter animation for title
  - Animated dots for loading indicator
  - Optional status details for debugging
  - Minimum display time prevents layout shift

#### ✨ Party Panel Enhancements
- **Dedicated Party Panel Component**: Improved member display
  - User's character always sorted first
  - Galaxy Save Tracker integration at top
  - Loading states with animated indicators
  - Member count display with Users icon
  - Expand button for full character sheet access
  - Better error handling and empty states

#### ✨ Settings Drawer Improvements
- **Content Sources Management**: Visual toggles for oracle content
  - Perilous Void checkbox with ACTIVE badge
  - Starforged checkbox with ACTIVE badge
  - Clear descriptions of content added by each source
  - Green visual indicators for enabled sources
  - Real-time updates to oracle generators

### 🔐 Authentication System Enhancements

#### ✨ Features
- **AuthContext Integration**: Centralized auth state in main.jsx
  - AuthProvider wraps entire app
  - Session management across all components
  - Persistent login state

- **Approval Workflow Improvements**: Better user experience
  - `PendingApproval` component with clear messaging
  - Timeout protection on approval checks (5 second limit)
  - Graceful error handling for RLS failures
  - Visual loading states during approval verification

### 🎭 Character System Improvements

#### ✨ Character Respec System (NEW)
- **Database Migration**: `migrations/add_respec_columns.sql`
  - `base_stats` JSONB column stores original rolled stats
  - `base_hp_max` integer column stores starting HP
  - Automatic migration for legacy characters
  - SQL comments for documentation
  
- **Respec Functionality**: Reset character to base values
  - Orange-themed "Respec Character" button in Danger Zone
  - Comprehensive confirmation modal showing impact
  - Resets stats to original rolled values
  - Resets HP to starting HP maximum
  - Clears all advancement abilities
  - Allows re-promotion if galaxy saves available
  - Handles legacy characters gracefully

### 🐛 Bug Fixes

#### Oracle System
- **Scene Shakeup**: Two-stage threat check improvements
  - Better logging with checkRoll, threatDie, and total
  - Clear success/fail messaging in logs
  - Stage 1 and Stage 2 results properly separated
  
- **Travel Encounter**: Two-stage threat-based encounter system
  - Check roll + Threat Die vs DC 12
  - Generate theme + actor only on success
  - Clear "No encounter" messaging on failure
  - Detailed log output with roll breakdowns

#### UI Components
- **Button Component**: Mobile-responsive sizing
  - `text-xs sm:text-sm` for better mobile readability
  - `px-3 sm:px-4` for touch-friendly targets
  - `leading-tight` prevents text overflow
  
- **Roll Result Display**: Terminology improvement
  - Changed "FAILURE" to "FUMBLE" for natural 1s
  - More thematic for critical failures

### 🔧 Technical Improvements

#### Context Management
- **GameContext Migration**: Automatic state upgrades
  - Migrates old game states without ship property
  - Migrates old game states without panelStates
  - Ensures backward compatibility with legacy saves
  - Default values for missing properties
  
- **Oracle Toggle Functions**: New GameContext methods
  - `togglePVOracles(enabled)` - Enable/disable Perilous Void
  - `toggleStarforgedOracles(enabled)` - Enable/disable Starforged
  - Persisted in game state across sessions

#### Vite Configuration
- **Environment-Based Base Path**: Better dev/prod separation
  - Development: `/` for local routing
  - Production: `/star-dashborg/` for GitHub Pages
  - Fixes sound file loading issues
  - Prevents 404s on assets

### 📦 Dependencies Added
- **TipTap Editor**: Rich text editing support (future feature prep)
  - `@tiptap/react@^3.14.0`
  - `@tiptap/starter-kit@^3.14.0`
  - `@tiptap/extension-underline@^3.14.0`

### 📝 New Files Created

**Components:**
- `src/components/spacecombat/stations/PilotStation.jsx`
- `src/components/spacecombat/stations/CopilotStation.jsx`
- `src/components/spacecombat/stations/GunnerStation.jsx`
- `src/components/spacecombat/stations/EngineerStation.jsx`
- `src/components/spacecombat/StationGrid.jsx`
- `src/components/character/PartyPanel.jsx`
- `src/components/ui/LoadingScreen.jsx`

**Data & Utilities:**
- `src/data/starforgedOracles.js`
- `src/hooks/useSoundEffects.js`

**Database Migrations:**
- `migrations/add_respec_columns.sql`

**Documentation:**
- `.cursor/plans/starforged_+_duplicate_handling_1b05ebfe.plan.md`

**Audio Assets:**
- `public/sounds/evade.mp3`
- `public/sounds/steady.mp3`
- `public/sounds/jamming.mp3`
- `public/sounds/deflectors.mp3`
- `public/sounds/laser-fire.mp3`
- `public/sounds/shield-hit.mp3`
- `public/sounds/target-lock.mp3`
- `public/sounds/load-torpedo.mp3`
- `public/sounds/torpedo-fire.mp3`
- `public/sounds/repair-shield.mp3`
- `public/sounds/alarm-critical.mp3`
- `public/sounds/shield-power-up.mp3`
- `public/sounds/laser-fire-short.mp3`
- `public/sounds/hyperdrive-charge.mp3`

### 🔄 Files Significantly Modified
- `src/main.jsx` - AuthProvider wrapper added
- `src/context/GameContext.jsx` - Oracle toggles, state migration
- `src/context/AuthContext.jsx` - Timeout protection, better error handling
- `src/components/oracles/OracleQuickBar.jsx` - Two-stage mechanics
- `src/components/trackers/ThreatDie.jsx` - Maximum threat alert
- `src/components/ui/Button.jsx` - Responsive sizing
- `src/components/oracles/RollResult.jsx` - Fumble terminology
- `src/components/oracles/generators/NPCGenerator.jsx` - Name generation
- `src/data/oracles.js` - Multi-source oracle integration
- `vite.config.js` - Environment-based base path

---

## [Unreleased] - feat/campaign-gen-enhancements branch

### 🎯 Character Progression System

#### ✨ Major Features
- **Galaxy Save Tracker**: Party-wide progression mechanic
  - Track galaxies saved across entire party
  - Increment/decrement controls with validation
  - Real-time promotion availability alerts
  - Shows count of party members ready to promote
  - Integrated into Party Panel for easy access
  
- **Character Promotions**: Rank advancement based on galaxies saved
  - Automatic promotion detection when galaxies saved > claimed promotions
  - `ProgressionModal` with comprehensive advancement options
  - HP increase (roll D6) with current HP healing
  - Choose two ability scores to increase (+1 each, max +6)
  - Select class-specific advancement ability:
    - Bot: This Means War, Portable Bot Mind, Legion Transmission
    - Bounty Hunter: Inheritance, This Is The Way, Friends In Low Places
    - Magi Knight: Strike Me Down, Foresight, High Ground
    - Smuggler: Delusions of Grandeur, Be Bygones, Always Shoots First
    - Technician: More Machine, Superweapon Savant, Always Carry A Spare
    - Youngster: Rebel Renown, Awakening, Pretty Handy
  - Advancement abilities roll features (heirlooms, skills, functions, companions)
  - Visual promotion alerts in character sheet header
  - Unclaimed promotions badge with animated pulse
  - `progressionData.js` with complete advancement system
  
- **Character Respec**: Reset character to base values
  - Orange-themed "Respec Character" button in Danger Zone
  - Comprehensive confirmation modal with impact summary
  - Resets stats to original rolled values (`base_stats`)
  - Resets HP to starting HP (`base_hp_max`)
  - Clears all advancement abilities
  - Resets `galaxy_saves_claimed` to 0
  - Shows available galaxy saves for re-promotion
  - Handles legacy characters without base values
  - Database migration: `migrations/add_respec_columns.sql`

#### 🗄️ Database Schema Updates
```sql
-- Character progression tracking
ALTER TABLE characters ADD COLUMN galaxy_saves_claimed integer DEFAULT 0;
ALTER TABLE characters ADD COLUMN advancement_options jsonb DEFAULT '[]'::jsonb;
ALTER TABLE characters ADD COLUMN motivation text;

-- Character respec support
ALTER TABLE characters ADD COLUMN base_stats jsonb;
ALTER TABLE characters ADD COLUMN base_hp_max integer;
```

### 🔮 Extended Oracle Systems

#### ✨ Perilous Void Integration
- **10 New Opening Scenes**: "Explosive Opening Scenes" from Perilous Void
  - Spaceship Battle, Death Station Escape, Hot Pursuit, Prison Break
  - Rebels Under Fire, Battle Station Defection, and more
  - Each with 3 follow-up questions for depth
  - Deduplication: Skips Star Borg "Bounty Hunter" when PV enabled
  
- **10 Inciting Incidents**: "Mission Hooks" from Perilous Void
  - Rescue missions, infiltration, artifact recovery, and more
  - Rich detail with locations, enemies, and complications
  
- **Content Toggle**: Enable/disable Perilous Void in Settings
  - `includePVOracles` flag in GameContext
  - Dynamic die size adjustment (d20 vs d29 for opening scenes)
  - Smart duplicate handling

#### ✨ Starforged Integration
- **19 Inciting Incidents**: Campaign starts from Ironsworn: Starforged
  - Aid stranded starships, broker peace, chart passages
  - Defend settlements, investigate mysteries, escort cargo
  - Sabotage operations, track beasts, transport refugees
  - Prison break duplicate excluded when PV enabled
  
- **Content Toggle**: Enable/disable Starforged in Settings
  - `includeStarforgedOracles` flag in GameContext
  - Dynamic die combinations:
    - PV only: d10
    - SF only: d19
    - Both: d28 (intelligent duplicate removal)
  
- **Unified Mission Generator**: All three sources integrated
  - Star Borg (20) + Perilous Void (10) + Starforged (19)
  - Settings drawer shows ACTIVE badges for enabled sources
  - Conditional generation based on toggles

#### 🎲 Enhanced Oracle Mechanics
- **Two-Stage Scene Shakeup**: Threat Die integration
  - Stage 1: d20 + Threat Die vs DC 15
  - Stage 2 (if triggered): d20 + Threat Die on shakeup table
  - Detailed log output: `[d20] + [Threat] = Total`
  - "No shakeup" result when check fails
  
- **Two-Stage Travel Encounter**: Threat Die integration
  - Stage 1: d20 + Threat Die vs DC 12
  - Stage 2 (if triggered): Roll theme + actor
  - Detailed log output with check results
  - "No encounter" result when check fails

### 📚 Content Sources Management

#### ✨ Settings Drawer Enhancements
- **Content Sources Section**: Toggle external oracle content
  - Perilous Void checkbox with ACTIVE badge
  - Starforged checkbox with ACTIVE badge
  - Clear descriptions of content added
  - Real-time updates to oracle generators
  
- **Visual Indicators**: 
  - Green "ACTIVE" badges for enabled sources
  - Entry counts shown ("Adds 10 opening scenes")
  - Organized sections for better UX

### 🎮 Threat Die Enhancements

#### ✨ Maximum Threat Alerts
- **Visual Warning**: Pulsing glow effect when Threat Die = 6
- **Inline Alert Box**: Automatic display at max threat
  - AlertTriangle icon with danger styling
  - Two consequence options clearly listed:
    - Advance ALL Danger Clocks by 1
    - Completely fill ONE Danger Clock
  - Animated pulse effect draws attention
  - Positioned directly below Threat Die

### 🎨 UI/UX Improvements

#### ✨ Button Component Updates
- **Responsive Sizing**: Mobile-friendly button sizing
  - `px-3 sm:px-4` horizontal padding scales with screen
  - `text-xs sm:text-sm` font size adjusts for mobile
  - `leading-tight` prevents text overflow
  
- **Improved Touch Targets**: Better mobile interaction
  - Adequate padding on small screens
  - Active state feedback with scale transform
  
#### ✨ Terminology Updates
- **"FUMBLE" vs "FAILURE"**: More thematic critical fail text
  - Oracle roll results now show "✕ FUMBLE ✕" instead of "✕ FAILURE ✕"
  - Consistent with tabletop RPG terminology

### 🐛 Bug Fixes

#### Event Oracle
- **Missing Specific Field**: Added `.specific` to event log output
  - Now logs: `Event (roll): [verb] [subject] - [specific]`
  - Previously omitted the specific detail

#### Session Journal
- **Visual Spacing Fix**: Removed extra padding-bottom from save indicator
  - Cleaner, more compact journal footer

### 📁 Code Organization

#### ✨ New Files Created
- `src/data/perilousVoidOracles.js` - PV oracle tables and generators
- `src/data/starforgedOracles.js` - Starforged oracle tables and generators
- `src/data/progressionData.js` - Character advancement system
- `migrations/add_respec_columns.sql` - Database migration for respec feature
- `.cursor/plans/perilous_void_oracle_integration_402b3f4a.plan.md` - PV integration plan
- `.cursor/plans/starforged_+_duplicate_handling_1b05ebfe.plan.md` - SF integration plan
- `.cursor/plans/character_respec_button_353df8ab.plan.md` - Respec feature plan

#### 🔧 Modified Files
- `src/context/GameContext.jsx` - Added PV/SF toggles, galaxy saves
- `src/context/CharacterContext.jsx` - Added respec function, promotion claiming
- `src/components/character/CharacterGenerator.jsx` - Store base values
- `src/components/character/CharacterSheetDrawer.jsx` - Respec UI, promotions
- `src/components/trackers/GalaxySaveTracker.jsx` - Galaxy save tracking
- `src/components/trackers/ThreatDie.jsx` - Max threat warning
- `src/components/oracles/OracleQuickBar.jsx` - Two-stage checks
- `src/components/oracles/generators/NPCGenerator.jsx` - Two-stage encounters
- `src/components/oracles/RollResult.jsx` - Fumble terminology
- `src/components/layout/SettingsDrawer.jsx` - Content source toggles
- `src/components/ui/Button.jsx` - Responsive sizing
- `src/data/oracles.js` - PV/SF integration logic
- `README.md` - Updated database schema, feature documentation

---

## [Previous] - feat/game-flow-enhancements branch

### 🎮 Desktop Optimization & UI Polish

#### ✨ Major Features
- **Desktop Space Combat Layout**: Optimized for wider screens (1280px+)
  - Max width increased to 1920px (from 1280px)
  - XL breakpoint styling (xl:) for better use of large monitors
  - Column proportions: 3-6-3 on xl screens (vs 4-5-3 on lg)
  - Increased spacing, padding, and gaps throughout
  - Larger text sizes for improved readability
  - Combat log max height: 800px on xl screens
  
- **Unified Ship Panel**: Consolidated ship information in space combat
  - Ship name moved to top as editable header (replaces "Ship Status")
  - Click ship name to edit inline
  - Dice icon to reroll ship name
  - Shopping cart icon to open upgrade shop
  - Compact armor display with horizontal progress bar
  - Active upgrades section with visual indicators
  - Turbo Laser configuration directly in panel
  - Quick stats footer: crew, manned stations, torpedoes
  - Removed redundant `SpaceCombatShipPanel` component
  
- **Upgrade Integration in Combat**: Ship upgrades visually integrated with actions
  - Turbo Lasers: "D8" badge on assigned gunner's fire action
  - Booster Rockets: "D2 Targets" badge on pilot's steady action
  - Torpedo Winch: "Winch" badge on load torpedo actions at all stations
  - Station headers show upgrade icons (Lightning for Turbo, Rocket for Boosters)
  - Action descriptions updated to reflect upgrade effects

### 🔐 Authentication System

#### ✨ Features
- **Admin Approval Workflow**: New user accounts require admin approval
  - `AuthContext` for centralized auth state management
  - `PendingApproval` screen with clear status messaging
  - `admin_profiles` table with approval tracking
  - RLS policies for secure access control
  - Email notifications on approval (future enhancement)
  
- **Session Management**: Persistent authentication state
  - Auto-login on page refresh
  - Protected routes based on approval status
  - Graceful sign-out with cleanup

### 🌌 Galaxy Save & Progression System

#### ✨ Features
- **Galaxy Save Tracker**: Campaign progression tracking
  - Increment/decrement controls for galaxies saved
  - Visual counter with neon yellow styling
  - Integrated with character promotion system
  - Promotion alerts (shows count of members ready to promote)
  - Compact design fits in party panel
  
- **Character Promotions**: Rank advancement system
  - Automatic detection of unclaimed promotions
  - Visual alerts when members can promote
  - Promotion claiming via character sheet
  - `promotions_claimed` field tracks progress

### 📖 Character Journal System

#### ✨ Features
- **Personal Character Journals**: Individual note-taking per character
  - Separate from session journal
  - Auto-save with 2-second debounce
  - Cloud-synced via Supabase
  - Visual save indicators (saving/synced)
  - 180px minimum height for better UX
  - Integrated in character sheet drawer

### 🎲 Enhanced Oracle & Threat Systems

#### ✨ Features
- **Travel Encounter System**: Threat-based encounter mechanics
  - Stage 1: d8 + Threat Die ≥ 12 for encounter
  - Stage 2: Generate theme and actor on success
  - Detailed log messages with roll breakdown
  - Clear success/fail messaging
  - Format: `[d8] + [Threat] = total ✓/✗`
  
- **Scene Shakeup System**: Two-stage threat check
  - Stage 1: d10 + Threat Die ≥ 15 to trigger
  - Stage 2: d20 + Threat Die for shakeup result
  - Separate roll logs for each stage
  - Clear success/fail messaging
  - Format: `[d10] + [Threat] = total ✓/✗`
  
- **Maximum Threat Alert**: Visual warning at Threat Die = 6
  - Pulsing red glow on die
  - Inline alert panel with rule reminder
  - Two options clearly presented:
    - Advance ALL danger clocks by 1
    - Completely fill ONE danger clock
  
- **Event Oracle Enhancement**: More detailed logging
  - Now includes specific detail in log
  - Format: "Event (roll): verb subject - specific"

### 🎨 UI/UX Improvements

#### ✨ Features
- **Responsive Button Sizing**: Better mobile experience
  - Mobile: `text-xs sm:px-3`
  - Desktop: `text-sm sm:px-4`
  - Improved line-height and leading
  - Better touch targets on small screens
  
- **Mission Generator Buttons**: Mobile-optimized
  - Smaller gaps on mobile: `gap-1 sm:gap-2`
  - Smaller text: `text-[10px] sm:text-xs`
  - Better use of limited screen real estate
  
- **Party Panel Enhancements**: Improved member display
  - User's character always sorted first
  - Galaxy Save Tracker integration
  - Loading states with animations
  - Expand functionality for character sheets
  - Member count display
  
- **Roll Result Terminology**: Changed "FAILURE" to "FUMBLE"
  - More thematic for critical failures (nat 1)
  - Consistent with Star Borg terminology

### 🔧 Technical Improvements

#### Context & State Management
- **AuthContext**: New authentication context
  - Session tracking
  - User approval status
  - Sign-out functionality
  - Approval checking with timeout protection
  
- **GameContext Enhancements**: Ship state migration
  - Auto-migration for old game states
  - Ship property added to initialGameState
  - Torpedo inventory tracking
  - Turbo laser station assignment
  - Galaxies saved counter
  
- **PartyContext**: Enhanced party management
  - Better error handling
  - Improved loading states
  - User sorting logic

#### Data & Configuration
- **spaceCombatData.js**: Upgrade metadata
  - Added `targetStation`, `targetAction`, `requiresConfig` fields
  - Better upgrade-to-action mapping
  - Cleaner integration logic
  
- **Vite Config**: Environment-aware base path
  - Production: `/star-dashborg/` for GitHub Pages
  - Development: `/` for local dev
  - Fixes asset loading issues

### 🐛 Critical Bug Fixes

- **Missing useParty Import**: Fixed blank screen in SpaceCombatView
  - Added `import { useParty } from '../../context/PartyContext'`
  - Root cause of app not loading after UI redesign
  
- **JSX Syntax Error**: Fixed unclosed `<button>` tag in UpgradeShop
  - Line 317-320 had missing closing tag
  - Prevented app from rendering
  
- **Undefined Safety Checks**: Added optional chaining
  - `partyMembers?.length` instead of `partyMembers.length`
  - `spaceCombat.stationAssignments || {}`
  - `spaceCombat.torpedoesLoaded || 0`
  - Prevents crashes when data is loading

### 📝 Documentation

- **Admin Approval Guide**: `docs/admin-approval-guide.md`
  - Setup instructions for approval system
  - Database configuration
  - RLS policy explanations
  
- **README Updates**: Enhanced feature descriptions
  - Authentication system documentation
  - Desktop optimization notes
  - Updated quick start guide

### 🗄️ Database Schema Updates

```sql
-- Admin profiles table for approval system
create table admin_profiles (
  user_id uuid primary key references auth.users(id),
  approved boolean default false,
  created_at timestamp with time zone default now()
);

-- Character journal field
alter table characters add column journal text default '';

-- Character promotions tracking
alter table characters add column promotions_claimed integer default 0;

-- Game state enhancements (stored in sessions.game_state JSONB)
-- ship.galaxiesSaved: integer
-- ship.turboLaserStation: 'gunner1' | 'gunner2' | null
```

### 🎯 Performance Optimizations

- Debounced journal saves (2 second delay)
- Preloaded sound effects
- Optimized re-renders with proper dependencies
- Efficient party member sorting
- Memoized upgrade checks

### 📦 Files Added

**Components:**
- `src/components/auth/PendingApproval.jsx`
- `src/components/character/CharacterJournal.jsx`
- `src/components/character/PartyPanel.jsx`
- `src/components/trackers/GalaxySaveTracker.jsx`
- `src/components/spacecombat/stations/PilotStation.jsx`
- `src/components/spacecombat/stations/CopilotStation.jsx`
- `src/components/spacecombat/stations/GunnerStation.jsx`
- `src/components/spacecombat/stations/EngineerStation.jsx`
- `src/components/spacecombat/StationGrid.jsx`

**Context:**
- `src/context/AuthContext.jsx`

**Documentation:**
- `docs/admin-approval-guide.md`

### 🔄 Files Significantly Modified

- `src/components/spacecombat/SpaceCombatView.jsx` - Desktop layout optimization
- `src/components/spacecombat/ShipStatus.jsx` - Complete redesign as unified panel
- `src/components/spacecombat/StationCard.jsx` - Added upgrade badges
- `src/components/spacecombat/CombatActions.jsx` - Integrated upgrade effects
- `src/components/spacecombat/CombatLog.jsx` - Enhanced max height on xl screens
- `src/components/ship/UpgradeShop.jsx` - Fixed JSX syntax error
- `src/components/oracles/generators/NPCGenerator.jsx` - Travel encounter mechanics
- `src/components/oracles/OracleQuickBar.jsx` - Scene shakeup mechanics
- `src/components/trackers/ThreatDie.jsx` - Maximum threat alert
- `src/context/GameContext.jsx` - Ship state migration
- `src/main.jsx` - Added AuthProvider wrapper
- `src/App.jsx` - Integrated approval checks
- `vite.config.js` - Environment-based base path

---

## [Previous] - feature/space-combat branch

### 🚀 Space Combat System - COMPLETE

#### ✨ Major Features
- **Full Space Combat Implementation**: Complete space combat system with 6 battle stations
  - Command Deck: Pilot (ship movement/evasion) and Co-Pilot (targeting/torpedoes)
  - Weapons Deck: Gunner 1 & 2 (laser turret operations)
  - Engineering Bay: Engineer 1 & 2 (repairs/systems/hyperdrive)
  
- **Battle Station Actions**: Character stats integrated with combat actions
  - AGI tests: Pilot evasion, gunner turrets, copilot targeting
  - KNW tests: Pilot steady, copilot torpedoes, engineer repairs
  - PRS tests: Pilot fixed beam, copilot jamming, engineer deflectors
  - STR tests: Engineer torpedo loading
  
- **Ship Systems Management**
  - Armor tiers (0-3) with visual damage reduction display
  - Torpedo loading (d2 roll) and firing mechanics
  - Hyperdrive charging (3 rounds to charge, dangerous with 4+ enemies)
  - Station assignment system with party member selection
  
- **Combat Log & Feedback**
  - Detailed roll logs: `[d20] + [stat] = total vs DR`
  - Success/fail messaging with damage calculations
  - Critical hits (nat 20) and blunders (nat 1)
  - Armor degradation on failed defense rolls
  
- **Ship Upgrades System**
  - Purchase upgrades with bits: Turbo Lasers, Torpedo Winch, Overcharge Shields, Booster Rockets
  - Heroic upgrades earned by saving galaxies
  - Upgrades persist across sessions
  - Visual indicators for equipped upgrades
  
- **Torpedo Inventory**
  - 5 torpedo types: Standard, Cluster, Hunter-Killer, Ion, Chaff
  - Purchase torpedoes from shop
  - Select torpedo type before firing
  - Inventory tracking with visual display
  
- **Sound Effects System**
  - Immersive combat audio: laser fire, torpedo launch, shield hits, hyperdrive charge, critical alarm
  - Toggle mute/unmute with persistent localStorage preference
  - Volume controls per sound effect
  - Graceful fallback if audio blocked

- **Ship Name Generator**
  - d100 procedural naming system with 100 prefixes and 100 suffixes (10,000 combinations)
  - Generates sci-fi ship names like "The Androma", "The Stelloterra", "The Proxonyx"
  - Editable ship names (click to edit inline)
  - Reroll button (dice icon) for instant new name generation
  - All names automatically prefixed with "The"
  - Ship names persist in session state and sync across players
  - Available in both Space Combat view and Ship Manager

#### 🐛 Bug Fixes - Space Combat
- **Fixed Character Stats Not Applied**: Changed `character.abilities` to `character.stats` in combat actions
  - Combat log was showing `NaN + 0 = NaN` for all tests
  - Root cause: incorrect property lookup for character ability scores
  
- **Fixed Torpedo Loading NaN**: Changed `rollDice(2)` to `rollD(2)` for proper d2 rolls
  - Torpedo loading showed "Loaded NaN torpedoes" 
  - Root cause: `rollDice` expects two params (count, sides), only received one
  
- **Fixed Torpedo Count Not Updating**: Fixed stale closure bug in `SpaceCombatContext`
  - Torpedo count displayed in log but not in Quick Stats
  - Root cause: `updateSpaceCombat` used captured `localState` instead of current state callback
  - Solution: Refactored to use `setLocalState((currentState) => ...)` pattern
  
- **Fixed d20 Combat Rolls**: Changed `rollDice(20)` to `rollD(20)` in combat actions
  - d20 rolls returned null causing NaN in calculations
  - All combat action tests now use proper single-die rolls

### 👥 Character & Party Enhancements

#### ✨ Features
- **Character Journals**: Personal journal for each character
  - Auto-save with 2-second debounce
  - Cloud-synced via Supabase
  - Separate from session journal
  - Visual saving indicator
  
- **Party Panel Improvements**
  - Shows all party members with real-time sync
  - User's character displayed first
  - Expand button to view full character sheet
  - Loading states during character fetch

### 🎲 Oracle & Tracker Improvements

#### ✨ Features  
- **Scene Shakeup**: Two-stage threat check with proper success/fail messaging
  - Stage 1: d20 + Threat Die vs 15+ to trigger
  - Stage 2: d20 + Threat Die for shakeup severity
  - Clear log messages with roll breakdowns
  
- **Travel Encounter**: Threat-based encounter check
  - Stage 1: d20 + Threat Die vs 12+ to trigger
  - Stage 2: Generate theme and actor if successful
  - Clear success/fail messaging in log
  
- **Threat Die Max Alert**: Visual warning when Threat Die = 6
  - Pulsing red glow effect
  - Inline alert with rule reminder
  - Options: Advance all clocks by 1 OR fill one clock completely
  
- **Game Flow Quick Actions**: Enabled quick action buttons
  - Console logging for action tracking
  - Foundation for future navigation integration

### 🎨 UI/UX Improvements

#### ✨ Features
- **Mobile Responsiveness**: Improved button sizing for small screens
  - Responsive padding: `px-3 sm:px-4`
  - Responsive text: `text-xs sm:text-sm` and `text-[10px] sm:text-xs`
  - Better touch targets on mobile devices
  
- **Loading Screen**: Unified loading component
  - Smooth typewriter animation
  - Prevents jarring flashes during initialization
  - Optional status details display
  
- **Visual Feedback**: Enhanced alerts and animations
  - Pulsing glow for max threat
  - Inline alerts for critical states
  - Smooth transitions throughout

#### 🐛 Bug Fixes
- **Roll Result Display**: Changed "FAILURE" to "FUMBLE" for d20 rolls of 1
- **Button Wrapping**: Improved text wrapping and line-height for better mobile display
- **Session Journal**: Fixed padding inconsistency in save indicator

### 🔧 Technical Improvements

#### Context & State Management
- **SpaceCombatContext**: New context for space combat state
  - Ship armor, torpedoes, hyperdrive tracking
  - Station assignments with real-time sync
  - Combat log management
  - Context methods for all combat actions
  
- **GameContext Enhancements**: Added ship and spaceCombat to initial state
  - Ship upgrades and torpedo inventory
  - Migration for legacy game states
  - Persistent upgrade tracking
  
- **Fixed Stale Closures**: Refactored state update patterns
  - Use state callback pattern for always-current state
  - Prevents race conditions in rapid updates
  - Better dependency arrays in useCallback hooks

#### Data & Utils
- **spaceCombatData.js**: Complete combat mechanics data
  - 6 stations with role descriptions
  - 11 combat actions with abilities and DRs
  - Armor tiers with damage reduction
  - Combat rules reference
  
- **shipShopData.js**: Ship upgrades and torpedo definitions
  - 4 purchasable upgrades with costs
  - 4 heroic upgrades earned through gameplay
  - 5 torpedo types with effects and costs
  
- **shipUpgrades.js**: Utility functions for upgrade logic
  - Check upgrade ownership
  - Calculate max armor tier
  - Get gunner damage with upgrades
  - Check torpedo loading permissions
  
- **useSoundEffects.js**: Custom hook for audio management
  - Preload audio files for performance
  - Mute/unmute with localStorage persistence
  - Volume controls per sound
  - Graceful error handling

- **oracles.js**: Ship name generator data and function
  - `shipNameFirstParts`: 100 sci-fi prefixes (Androm, Stel, Prox, etc.)
  - `shipNameSecondParts`: 100 sci-fi suffixes (a, oterra, onyx, etc.)
  - `generateShipName()`: Combines random parts with "The" prefix
  - Integration with existing oracle system patterns

### 📝 Configuration Changes
- **vite.config.js**: Environment-based base path
  - Local dev uses `/` for proper routing
  - Production uses `/star-dashborg/` for GitHub Pages
  - Fixes sound file loading in development

### 🗄️ Database Schema Updates
```sql
-- Add journal field to characters table
alter table characters add column journal text default '';

-- GameContext now stores ship and spaceCombat state in sessions.game_state JSONB
```

---

## [Previous] - feature/character-creation branch

### Character Creation System Overhaul

#### ✨ Major Features
- **Complete Character Creation Alignment**: Audited and aligned all character creation mechanics with Star Borg Rebel Handbook v1.1
  - Implemented class-specific stat rolling (each class uses unique dice combinations)
  - Added proper HP calculation: `(HP Die + Grit Modifier) × 2` per rulebook
  - Integrated starting bits calculation based on class
  - Added all class features with proper roll mechanics
  - Implemented species selection with Bot-specific handling
  
- **Oracle Integration in Character Creation**: Character creation oracles now fully integrated
  - Rebel Motivations automatically rolled and displayed during creation
  - Class-specific oracles (backgrounds, nemeses, etc.) integrated inline
  - Re-roll functionality for all oracle-based features
  - Roll values stored with character for reference
  - Results logged to character sheet for persistence

#### 🎭 Class-Specific Implementations

**Magi Knight**
- Nemesis oracle with auto-roll for "Roll 2 Nemeses" result
- Duplicate prevention (rolls without replacement)
- Weapon and armor proficiency
- Starting equipment

**Tech**
- Background oracle integration
- Starting credits (2d6 × 100)
- Tech kit and gadgets
- Starting tech points

**Fighter**
- Military background oracle
- Weapon specialization
- Combat training features
- Starting armor and weapons

**Psi**
- Psi powers oracle
- Mental discipline features
- Starting psi points
- Meditation training

**Smuggler**
- Contraband specialty oracle
- Street contacts
- Fast-talk features
- Hidden compartments

**Youngster**
- Youth background oracle
- Scrappy features
- Starting luck points
- Underdog advantages

**Bot**
- Bot chassis type oracle
- Hardware upgrades
- System features
- Power core mechanics

#### 🐛 Bug Fixes
- **Party Panel Empty State**: Fixed race condition where party panel appeared empty after character creation until refresh
  - Added `refreshPartyMembers` function to `PartyContext`
  - Implemented manual refresh on Dashboard mount
  - Ensures realtime subscriptions don't miss INSERT events
  
- **Dropdown Legibility**: Fixed poor contrast in character creation dropdowns
  - Applied consistent styling to all select elements
  - Added explicit background and text colors
  - Matches pattern used across app (MissionTrack, DangerClock)

#### 🎨 UI/UX Improvements
- **Loading States**: Unified loading experience with `LoadingScreen` component
  - Prevents jarring flashes during initialization
  - Smooth typewriter animation
  - Optional status details
  
- **Button Responsiveness**: Improved button sizing for mobile
  - Responsive padding: `px-3 sm:px-4`
  - Responsive text: `text-xs sm:text-sm`
  - Better touch targets on mobile devices
  
- **Mission Generator**: Optimized button layout for small screens
  - Adjusted gap spacing: `gap-1 sm:gap-2`
  - Smaller text on mobile: `text-[10px] sm:text-xs`
  - Better use of limited screen space

#### 🔧 Technical Improvements
- **Context Enhancements**
  - `PartyContext`: Added manual refresh capability
  - Improved real-time subscription reliability
  - Better error handling in approval checks
  
- **Character Data Structure**
  - Added `class_features` with roll values
  - Stored oracle results with character
  - Enhanced character sheet display
  
- **Oracle System**
  - Refactored oracle functions for better reusability
  - Improved roll logging with detailed breakdowns
  - Better integration between generators and character creation

#### 📝 Documentation
- **Admin Approval Guide**: Updated with approval workflow details
- **Inline Help**: Added help icons to tracker panels
- **Code Comments**: Enhanced documentation for complex mechanics

#### 🎯 Rulebook Alignment Checklist
- [x] Class-specific stat dice rolling
- [x] Proper HP calculation formula
- [x] Starting bits by class
- [x] All class features with roll mechanics
- [x] Species selection (Bot special handling)
- [x] Oracle integration (motivations, backgrounds)
- [x] Equipment starting loadouts
- [x] Class-specific resources (credits, psi points, etc.)

#### 🚀 Performance
- **Debounced Character Saves**: 300ms delay prevents excessive database writes
- **Optimized Real-time**: Reduced unnecessary re-renders in party panel
- **Loading Optimization**: Minimum display time prevents layout shift

---

## Development Notes

### Testing Checklist for Character Creation
- [ ] All classes generate with correct stat dice
- [ ] HP calculation matches `(HP Die + Grit Modifier) × 2`
- [ ] Starting bits match class specifications
- [ ] Class features display with roll values
- [ ] Oracle results can be re-rolled
- [ ] Character saves to database correctly
- [ ] Party panel shows character immediately
- [ ] Real-time updates work for all party members
- [ ] Dropdowns are legible on all themes
- [ ] Mobile responsiveness for all screens

### Known Limitations
- Character editing after creation is limited (by design - create new character instead)
- Oracle re-rolls don't maintain history (by design - only show current result)
- Some class features need manual tracking (as per TTRPG nature)

### Future Enhancements (Not in this branch)
- Character advancement/leveling system
- Equipment management improvements
- Character import/export
- Print-friendly character sheets
- Multiple characters per user

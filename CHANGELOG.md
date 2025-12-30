# Changelog

All notable changes to Star Dashborg are documented in this file.

## [Unreleased] - feature/space-combat branch

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

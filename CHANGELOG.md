# Changelog

All notable changes to Star Dashborg are documented in this file.

## [Unreleased] - feature/character-creation branch

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

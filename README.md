# Star Dashborg

A real-time multiplayer TTRPG companion dashboard for Star Borg, featuring an authentic retro sci-fi aesthetic with comprehensive oracle systems, character management, and session management tools.

![Star Borg](https://img.shields.io/badge/Star%20Borg-Rebel%20Dashboard-yellow?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?style=flat-square)

## ✨ Features

### 👥 Character & Party Management
- **Character Creation** - Full character generator with all 6 Star Borg classes (Bot, Bounty Hunter, Magi Knight, Smuggler, Technician, Youngster)
- **Character Sheets** - Slide-out drawer with stats, HP tracking, equipment, destiny points, and class features
- **Personal Journal** - Cloud-synced personal notes for each character to track goals, relationships, and discoveries
  - Auto-save with 2-second debounce
  - Visual saving/synced indicators
  - Separate from session journal
- **Party Panel** - Real-time view of all characters in the session with synchronized HP and stats
  - User's character displayed first
  - Expandable to full character sheet
  - Loading states with animations
- **Galaxy Save Tracker** - Campaign progression system
  - Track galaxies saved as party-wide milestone
  - Increment/decrement controls with validation
  - Promotion alerts showing count of members ready to advance
  - Integrated with Party Panel
- **Character Promotions** - Comprehensive rank advancement system
  - Automatic detection when galaxies saved exceeds claimed promotions
  - Visual alerts with animated promotion badge in character sheet
  - Promotion modal with three advancement choices:
    - Increase HP (roll D6, also heals current HP)
    - Choose two ability scores to increase (+1 each, max +6)
    - Select class-specific advancement ability (3 options per class)
  - Class advancements include new abilities, companions, and special features
  - Rolled features (heirlooms, skills, functions) stored in character advancement options
  - Full progression data system with repeatable/non-repeatable tracking
- **Character Respec** - Reset character to base values for re-specialization
  - Orange-themed "Respec Character" button in Danger Zone
  - Comprehensive confirmation modal showing impact
  - Resets stats to original rolled values
  - Resets HP to starting maximum
  - Clears all advancement abilities
  - Allows re-promotion if galaxy saves are available
  - Handles legacy characters gracefully
- **Quick Stat Rolls** - Click any stat to roll d20 + modifier with crit/fumble detection
- **Authentication System** - Secure user accounts with admin approval workflow
  - New users require admin approval before access
  - Pending approval screen with clear status
  - Session persistence across browser refreshes

### 🎲 Core Gameplay Tools
- **Threat Die Tracker** - Visual D6 with click-to-cycle functionality
  - Animated die roll effect when cycling
  - Pulsing glow effect at maximum threat (6)
  - Inline alert box at max threat with consequence options:
    - Advance ALL Danger Clocks by 1
    - Completely fill ONE Danger Clock
- **Mission Tracks** - Create and manage mission progress with completion attempts (DR10/12/14/16)
- **Danger Clocks** - Segment trackers (4/6/8/10) with filled state alerts
- **Dice Roller** - D4, D6, D8, D10, D12, D20, D100, and 2D6 with advantage/disadvantage
- **Ship Log** - Real-time activity feed with formatted oracle results and detailed roll breakdowns

### 🔮 Oracle Systems
- **Affirmation Oracle** - Yes/No/And/But oracle with advantage/disadvantage rolls and detail fields
- **Scene Shakeup** - Two-stage threat check (d20 + Threat Die, 15+ triggers)
  - Stage 1: Check if shakeup occurs (DC 15)
  - Stage 2: Roll on shakeup table if triggered
  - Detailed log output with both rolls and modifiers
- **Event Oracle** - Multi-roll complex event generator with 6 independent tables (verb, subject, specific)
- **Travel Encounter** - Two-stage threat-based encounter check (d20 + Threat Die, 12+ triggers)
  - Stage 1: Check if encounter occurs (DC 12)
  - Stage 2: Generate theme + actor if triggered
  - Detailed log output showing success/failure
- **Dangerous Locations** - Ship/Base location generator with obstacle mechanics
- **Site Explorer** - Procedural dungeon-crawl system for ships and bases
- **Morale Check** - 2D6 vs MRL with Flee/Surrender outcomes
- **Oracle Compendium** - Comprehensive tabbed interface with 40+ oracle tables
- **Perilous Void Integration** - Optional expanded content (toggle in Settings)
  - 10 explosive opening scenes with 3 follow-up questions each
  - 10 inciting incidents for campaign starts
  - Smart duplicate handling with core Star Borg content
- **Starforged Integration** - Optional Ironsworn: Starforged content (toggle in Settings)
  - 19 inciting incidents for varied campaign starts (aid starships, broker peace, track beasts)
  - `starforgedOracles.js` data file with `generateSFIncitingIncident()` function
  - Intelligent deduplication: excludes "Prison Break" when Perilous Void enabled
  - Multi-source mixing: d10 (PV), d19 (SF), d28 (both), d29 (SB+PV)
  - Combines with Star Borg and PV for maximum variety

### 🎭 Generators
- **Monster Generator** - Beast adaptations, monstrosities, and weak spots with d6 rolls
- **Crime Lord Generator** - Names, visage, weapons, and bases
- **NPC Generator** - Name, role, species, motivation, secrets, traits, and demeanor
  - Full NPC generation includes character name
  - Travel encounters with two-stage threat check (d20 + Threat Die vs 12+)
- **Planet Generator** - Terrain, weather, population, control, and scenes
- **Settlement Generator** - Extended with leader, landmark, rumors, and NPC hook-ups
- **Mission Generator** - Detailed missions, quick missions, villains, and scenario titles
  - Integrates Star Borg (20), Perilous Void (10), and Starforged (19) incidents
  - Dynamic content based on enabled oracle sources
- **Ship Name Generator** - d100 table combining prefixes and suffixes (100 each) for 10,000 possible names

### 🎯 Session Management
- **Real-time Multiplayer** - Supabase-powered sync across all connected players
- **Character Persistence** - Each player's character automatically syncs to the session
- **Party Awareness** - See all party members' stats, HP, and status in real-time
- **Session Journal** - Collaborative note-taking with auto-save
- **Customizable Layout** - Drag-and-drop panels between columns
- **Game Flow Drawer** - Step-by-step campaign and session play procedure guide
- **Help Modal** - Context-sensitive help for trackers (press `H` or `?`)
- **Quick Reference** - Comprehensive rules reference accessible from header
- **Content Sources Management** - Toggle optional oracle content in Settings
  - Enable/disable Perilous Void oracles
  - Enable/disable Starforged oracles
  - Visual ACTIVE badges show enabled sources
  - Dynamic die size adjustments based on enabled content

### 🚀 Space Combat System
- **Battle Stations** - 6 ship stations with role-specific actions (Pilot, Co-Pilot, Gunner 1/2, Engineer 1/2)
  - Modular station components (`PilotStation`, `CopilotStation`, `GunnerStation`, `EngineerStation`)
  - Each station is self-contained with assignment logic and action rendering
  - Station Grid layout with organized decks: Command, Weapons, Engineering
  - Color-coded deck headers for visual organization
- **Station Assignments** - Assign party members to stations with real-time sync
- **Combat Actions** - Character stats automatically applied to space combat tests
- **Unified Ship Panel** - Consolidated ship information display
  - Editable ship name as header (click to edit, dice to reroll)
  - Compact armor display with tier and damage reduction
  - Active upgrades section with visual indicators
  - Turbo Laser configuration interface
  - Quick stats footer (crew, stations, torpedoes)
  - Shopping cart icon for instant upgrade shop access
- **Ship Status** - Track armor tier, torpedo count, and hyperdrive charge
- **Combat Log** - Detailed action log with d20 rolls, modifiers, and success/fail results
- **Sound Effects** - 14 immersive combat audio files with full playback system
  - Combat sounds: laser fire (long/short), torpedo launch, torpedo loading
  - Defense sounds: shield hit, shield power-up, shield repair
  - Maneuver sounds: evade, steady, target lock
  - System sounds: deflectors, jamming, hyperdrive charge, critical alarm
  - `useSoundEffects` custom hook with preloading and volume control
  - Toggle mute/unmute with localStorage persistence
  - Graceful fallback if autoplay blocked
- **Ship Name Generator** - d100 table generates procedural ship names (e.g., "The Androma", "The Stelloterra")
  - Click ship name to edit manually
  - Click dice icon to generate new names
  - All names prefixed with "The"
- **Ship Upgrades** - Purchase and equip ship upgrades (Turbo Lasers, Torpedo Winch, Overcharge Shields, Booster Rockets)
  - Visual integration with combat actions (badges on actions)
  - Upgrade icons on affected station headers
  - In-combat reconfiguration for Turbo Lasers
- **Torpedoes** - Load and fire different torpedo types (Standard, Cluster, Hunter-Killer, Ion, Chaff)
- **Heroic Rewards** - Earn heroic upgrades by saving galaxies
- **Desktop Optimized** - Enhanced layout for large screens (1280px+)
  - Wider max width (1920px) utilizes full monitor space
  - Optimized column proportions and spacing
  - Larger text and better visual hierarchy

### 🎨 Visual Design
- **Authentic Star Borg Aesthetic** - Yellow/cyan/red color scheme with neon glow effects
- **CRT Scanlines & Effects** - Retro terminal styling throughout
- **Fully Responsive** - Optimized for desktop, tablet, and mobile with adaptive button sizing
  - Mobile: Compact text and padding for small screens
  - Desktop: Comfortable sizing for mouse/keyboard
  - XL screens (1280px+): Enhanced spacing and larger text
- **Desktop Optimized Layout** - Space combat UI maximizes large monitors
  - 1920px max width (vs standard 1280px)
  - Optimized column proportions (3-6-3 on xl screens)
  - Better use of horizontal space
- **Smooth Animations** - Polished transitions, hover effects, and alert pulses
- **Visual Alerts** - Pulsing glows for maximum threat and filled danger clocks
  - Inline alert panels for critical states
  - Upgrade badges on combat actions
- **Smooth Loading States** - Unified loading experience prevents jarring transitions
- **Sound Effects** - Toggle combat sounds on/off with persistent preference
  - 15+ immersive audio effects
  - Volume control per sound
  - LocalStorage persistence

## ⚡ Key Highlights

### Character & Party Features
- **Full Character System**: Create characters with all Star Borg classes and species
- **Real-time Party Sync**: See all party members' characters update live
- **Interactive Stats**: Click stats to roll tests with automatic modifiers
- **HP Tracking**: Visual HP bars with damage/heal buttons
- **Character Persistence**: Characters saved to session, no need to recreate

### Threat-Based Mechanics
- **Scene Shakeup**: Two-stage threat check (d20 + Threat Die vs 15+) with automatic calculation
- **Travel Encounters**: Threat-based encounter check (d20 + Threat Die vs 12+) with clear success/fail messaging
- **Dangerous Locations**: Obstacle checks using Threat Die + d20 mechanics
- **Maximum Threat Alert**: Visual warning and rule reminder when Threat Die reaches 6

### Space Combat Features
- **6 Battle Stations**: Command Deck (Pilot, Co-Pilot), Weapons Deck (Gunner 1/2), Engineering Bay (Engineer 1/2)
  - Modular station components with clean architecture
  - Station Grid organizes stations by deck
- **Station-Specific Actions**: Each station has unique actions tied to character stats (AGI, KNW, PRS, STR)
- **Real-time Combat**: d20 + character stat vs DR with automatic success/fail calculation
- **Ship Systems**: Armor tiers, torpedo loading (d2), hyperdrive charging (3 rounds)
- **Unified Ship Panel**: Consolidated ship information hub
  - Editable ship name with reroll functionality
  - Compact armor visualization
  - Active upgrades display
  - Turbo Laser configuration
  - Quick stats footer
- **Combat Audio**: 15+ immersive sound effects with mute toggle
  - Laser fire, torpedo launch, shield impacts, hyperdrive charge, critical alarms
  - Action-specific sounds (evade, steady, jamming, deflectors, repair, etc.)
  - Persistent mute preference
- **Ship Name Generator**: d100 procedural naming system generates names like "The Androma" or "The Proxonyx"
  - Editable ship name (click to edit)
  - Reroll button (dice icon) for instant new names
  - All names automatically prefixed with "The"
- **Ship Upgrades**: Turbo Laser Turrets (d8 damage), Torpedo Winch (any station loads), Overcharge Shields (Tier 3 max), Booster Rockets (Steady affects D2)
  - Visual badges on affected actions
  - Upgrade icons on station headers
  - In-combat reconfiguration
- **Torpedo Types**: Standard, Cluster, Hunter-Killer, Ion, Chaff with unique effects
- **Desktop Optimized**: Enhanced layout for large monitors (1920px max width, optimized spacing)

### Visual Alerts & Feedback
- **Maximum Threat**: Pulsing red alert when Threat Die reaches 6
- **Filled Danger Clocks**: Visual notification when consequences trigger
- **Detailed Roll Logs**: All calculations shown in format `[d20] + [Threat] = total`
- **Smooth Loading**: Unified loading screens prevent flashing during app initialization

### Context-Sensitive Help
- **Keyboard Shortcut**: Press `H` or `?` for instant help
- **Panel Help Buttons**: Click `?` icon on tracker headers
- **Quick Reference**: Full rules accessible from header

### Mobile Optimized
- Responsive button sizing and text wrapping
- Touch-friendly interface on phones and tablets
- Adaptive layout for all screen sizes
- Capitalized class names for better readability

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/star-dashborg.git
   cd star-dashborg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   Create a new project at [supabase.com](https://supabase.com) and run this SQL:
   ```sql
   -- Sessions table for game state
   create table sessions (
     room_code text primary key,
     game_state jsonb,
     created_at timestamp with time zone default now()
   );

   -- Rooms table
   create table rooms (
     code text primary key,
     gm_id uuid references auth.users(id),
     created_at timestamp with time zone default now()
   );

  -- Characters table
  create table characters (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    room_code text references rooms(code),
    name text,
    class text,
    class_name text,
    species text,
    stats jsonb,
    base_stats jsonb,
    hp_current integer,
    hp_max integer,
    base_hp_max integer,
    equipment jsonb,
    bits integer,
    destiny_points integer,
    motivation text,
    class_features jsonb,
    journal text default '',
    galaxy_saves_claimed integer default 0,
    advancement_options jsonb default '[]'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );

   -- Admin profiles table for approval system
   create table admin_profiles (
     user_id uuid primary key references auth.users(id),
     approved boolean default false,
     created_at timestamp with time zone default now()
   );

   -- Enable realtime updates
   alter publication supabase_realtime add table sessions;
   alter publication supabase_realtime add table characters;

   -- Enable Row Level Security
   alter table rooms enable row level security;
   alter table characters enable row level security;
   alter table admin_profiles enable row level security;

   -- RLS Policies (adjust as needed for your security requirements)
   create policy "Users can view all rooms" on rooms for select using (true);
   create policy "Users can create rooms" on rooms for insert with check (auth.uid() = gm_id);
   
   create policy "Users can view characters in their rooms" on characters for select using (true);
   create policy "Users can create their own characters" on characters for insert with check (auth.uid() = user_id);
   create policy "Users can update their own characters" on characters for update using (auth.uid() = user_id);
   create policy "Users can delete their own characters" on characters for delete using (auth.uid() = user_id);
   
   create policy "Users can view their own profile" on admin_profiles for select using (auth.uid() = user_id);
   ```

4. **Apply migrations (if upgrading existing database)**
   
   If you're upgrading from an earlier version, run the migrations in the `migrations/` folder:
   ```bash
   # In Supabase SQL Editor, run:
   # migrations/add_respec_columns.sql
   ```
   
   This adds support for character respec functionality.

5. **Configure environment**
   
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Get these values from your Supabase project settings (Settings > API)

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open the app**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

## 🎮 How to Use

### First Time Setup
1. Create an account using the authentication page
2. Wait for admin approval (if approval system is enabled)
3. Once approved, you'll be redirected to character creation

### Creating Your Character
1. On first login, you'll be prompted to create a character
2. Select your class (Smuggler, Tech, Fighter, Psi, or Bot)
3. Stats are automatically rolled using class-specific dice
4. Your character is automatically saved to the session

### Starting a Session
1. Load the app to generate a random 4-character room code
2. Click **"Copy Invite"** to share the session URL with players
3. All players with the same room code will see real-time updates
4. Each player creates their own character in the shared session

### Character Management
- Click **character icon** in header to open your character sheet
- View and edit stats, HP, equipment, bits, and destiny points
- Click any stat to roll a test (d20 + modifier)
- **Personal Journal** to track character-specific notes, goals, and discoveries (auto-saves)
- **Party Panel** shows all characters in the session
- HP bars update in real-time for all party members

### Panel Layout
- **Drag panels** between columns to customize your layout
- Layout preferences are saved in local storage
- Drop zones appear at the bottom of each column

### Game Flow Guide
- Click **"Game Flow"** button in header to open the step-by-step guide
- Covers Campaign Start (character creation, campaign goal)
- Covers Session Play loop (mission, threat, scenes, resolution)
- Quick action buttons for common tasks

### Quick Reference
- Click **"Quick Ref"** button in header for rules lookup
- Includes DRs, Solo Test results, Combat tests, Armor tiers, Resting rules
- Always accessible without leaving current screen

### Help System
- Press **`H`** or **`?`** key to open context-sensitive help
- Click **help icons** (?) on tracker panel headers
- Tabs for Threat Die, Mission Tracks, and Danger Clocks
- Includes usage instructions and rule references

### Threat Die
- Click to cycle values 1-6
- At **maximum threat (6)**: Pulsing alert with rule reminder
- Integrates with Scene Shakeup and Travel Encounter checks

### Mission Tracks
- Create tracks with difficulty: Short (DR10), Average (DR12), Long (DR14), Galaxy Saving (DR16)
- Click segments to mark progress
- Click **"Attempt"** to test completion (d20 + progress vs DR)
- Success removes mission, failure removes 1 progress

### Danger Clocks
- Create clocks with 4/6/8/10 segments
- Click segments to mark progress
- **Filled clocks** show pulsing alert: "Danger Triggered!"
- At Threat Die 6: Advance all clocks or fill one completely

### Oracle System
- Access oracles through the **Oracle Compendium** panel
- Results display with formatted data and individual roll breakdowns
- All oracle rolls are logged to the **Ship Log** with detailed calculations
- Threat-based checks show success/fail thresholds

### Generators
- Use one-click generators for complex entities (NPCs, monsters, planets)
- Results show detailed breakdowns with individual roll values
- Multi-roll pattern ensures maximum variety
- Generate as many times as needed - results update in real-time

## 📁 Project Structure

```
star-dashborg/
├── src/
│   ├── components/
│   │   ├── auth/             # Auth, PendingApproval
│   │   ├── character/        # CharacterGenerator, CharacterSheetDrawer, CharacterJournal, PartyPanel, PartyMemberCard, ProgressionModal
│   │   ├── journal/          # DiceLog, SessionJournal
│   │   ├── layout/           # Dashboard, Header, Panel, GameFlowDrawer
│   │   ├── oracles/          # Oracle systems and generators
│   │   │   ├── generators/   # Monster, Crime Lord, NPC, Planet, Mission
│   │   │   ├── OracleCompendium.jsx
│   │   │   ├── OracleTable.jsx
│   │   │   ├── OracleQuickBar.jsx
│   │   │   ├── OracleResultDisplay.jsx
│   │   │   ├── AffirmationOracle.jsx
│   │   │   └── DiceRoller.jsx
│   │   ├── ship/             # ShipManager, UpgradeShop, HeroicRewardsModal
│   │   ├── spacecombat/      # Space combat system components
│   │   │   ├── stations/     # Modular station components
│   │   │   │   ├── PilotStation.jsx      # Command Deck - Movement & Evasion
│   │   │   │   ├── CopilotStation.jsx    # Command Deck - Targeting & Torpedoes
│   │   │   │   ├── GunnerStation.jsx     # Weapons Deck - Turret Operations
│   │   │   │   └── EngineerStation.jsx   # Engineering Bay - Systems & Repairs
│   │   │   ├── SpaceCombatView.jsx       # Main combat interface
│   │   │   ├── StationGrid.jsx           # Organized station layout by deck
│   │   │   ├── StationCard.jsx           # Individual station UI wrapper
│   │   │   ├── CombatActions.jsx         # Action execution and dice rolling
│   │   │   ├── CombatLog.jsx             # Combat event logging
│   │   │   ├── ShipStatus.jsx            # Unified ship stats display
│   │   │   ├── TorpedoSelector.jsx       # Torpedo type selection
│   │   │   └── SpaceCombatShipPanel.jsx  # Ship upgrades in combat
│   │   ├── trackers/         # ThreatDie, MissionTrack, DangerClock, SiteExplorer, GalaxySaveTracker
│   │   └── ui/               # Button, Accordion, HelpModal, QuickReference, QuickReferenceDrawer, LoadingScreen
│   ├── context/
│   │   ├── AuthContext.jsx          # Authentication state management
│   │   ├── CharacterContext.jsx     # Character data management
│   │   ├── PartyContext.jsx         # Party members tracking
│   │   ├── GameContext.jsx          # Global game state management
│   │   └── SpaceCombatContext.jsx   # Space combat state management
│   ├── data/
│   │   ├── characterData.js         # Character classes and species data
│   │   ├── oracles.js               # Core Star Borg oracle tables and generators
│   │   ├── perilousVoidOracles.js   # Perilous Void expansion oracles
│   │   ├── starforgedOracles.js     # Starforged inciting incidents
│   │   ├── progressionData.js       # Character advancement and promotion system
│   │   ├── spaceCombatData.js       # Space combat stations and actions
│   │   ├── shipShopData.js          # Ship upgrades and torpedo types
│   │   └── trackerHelpContent.js    # Help content for tracker components
│   ├── hooks/
│   │   ├── useDebounce.js       # Debounce hook for auto-save
│   │   └── useSoundEffects.js   # Sound effects management
│   ├── lib/
│   │   ├── supabaseClient.js # Supabase configuration
│   │   └── utils.js          # Utility functions
│   ├── types/
│   │   └── starborg.js       # TypeScript-style type definitions
│   ├── utils/
│   │   ├── dice.js           # Dice rolling utilities
│   │   └── shipUpgrades.js   # Ship upgrade logic
│   ├── App.jsx               # Root component with auth flow
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles and custom animations
├── public/
│   └── sounds/               # 14 audio files for space combat
│       ├── laser-fire.mp3            # Gunner turret fire
│       ├── laser-fire-short.mp3     # Quick weapon sound
│       ├── torpedo-fire.mp3          # Torpedo launch
│       ├── load-torpedo.mp3          # Loading torpedoes
│       ├── shield-hit.mp3            # Incoming damage
│       ├── shield-power-up.mp3      # Shield activation
│       ├── repair-shield.mp3         # Engineer repairs
│       ├── evade.mp3                 # Pilot evasion
│       ├── steady.mp3                # Pilot stabilization
│       ├── target-lock.mp3           # Copilot targeting
│       ├── deflectors.mp3            # Engineering deflectors
│       ├── jamming.mp3               # Copilot jamming
│       ├── hyperdrive-charge.mp3    # FTL preparation
│       └── alarm-critical.mp3        # Critical damage alert
├── migrations/
│   └── add_respec_columns.sql  # Database migration for respec feature
├── .env                      # Environment variables (create this)
├── package.json
├── tailwind.config.js        # Tailwind configuration
└── vite.config.js            # Vite configuration
```

## 🛠️ Development

### Tech Stack
- **React 18** - UI library with hooks
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend, auth, and real-time sync
- **Lucide React** - Icon library
- **Orbitron Font** - Star Borg-style typography
- **TipTap** - Rich text editor (future feature prep)

### Key Technologies
- **React Context** - Global state management for game data, auth, characters, and party
- **Supabase Auth** - User authentication with approval workflow
- **Supabase Realtime** - WebSocket-based multiplayer sync for characters and game state
- **LocalStorage** - Panel layout and preferences persistence
- **CSS Custom Properties** - Theme colors and effects
- **Row Level Security** - Supabase RLS for data access control

### Code Style
- Components use functional React with hooks
- Tailwind classes for styling (minimal custom CSS)
- Debounced sync for performance (300ms delay)
- Optimistic UI updates for responsive feel

### Adding New Oracle Tables
1. Open `src/data/oracles.js`
2. Add your data array following existing patterns
3. Export the array in the relevant section
4. Create an `OracleTable` component instance in `OracleCompendium.jsx`
5. Tables automatically support roll formatting and logging

### Creating New Generators
1. Create a generator function in `src/data/oracles.js`
2. Create a component in `src/components/oracles/generators/`
3. Follow the pattern from `MonsterGenerator.jsx` or `NPCGenerator.jsx`
4. Import and add to the appropriate tab in `OracleCompendium.jsx`
5. Use `OracleResultDisplay` for consistent formatting

### Adding Help Content
1. Open `src/data/trackerHelpContent.js`
2. Add your help content with title, purpose, usage steps, and tips
3. Add help tab to `HelpModal.jsx` component
4. Connect help button via `onHelpClick` prop in `Dashboard.jsx`

### Implementing Threat Checks
Follow the two-stage pattern from Scene Shakeup:
1. Stage 1: Roll d20 + Threat Die vs threshold
2. On success: Stage 2 generates the actual result
3. On fail: Show clear message with roll breakdown
4. Log both stages with detailed calculations

## 🚢 Deployment

### GitHub Pages (Recommended)
1. Set repository secrets in GitHub:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Push to `main` branch - GitHub Actions will automatically:
   - Build the app
   - Deploy to `gh-pages` branch

3. Enable GitHub Pages in repository settings:
   - Settings > Pages
   - Source: `gh-pages` branch
   - Root directory

### Other Platforms
The app works on any static hosting service:
- **Vercel**: Import repo, add environment variables
- **Netlify**: Connect repo, configure build settings
- **Cloudflare Pages**: Similar setup with env vars

## 🎨 Customization

### Color Scheme
Edit theme colors in `tailwind.config.js`:
```js
colors: {
  'accent-cyan': '#00f0ff',
  'accent-yellow': '#fffc00',
  'accent-red': '#ff003c',
  // ...
}
```

### Oracle Content
All oracle data is in `src/data/oracles.js` - modify arrays to match your Star Borg content or homebrew additions.

### UI Layout
- Default panel configuration: `src/components/layout/Dashboard.jsx`
- Panel variants and styling: `src/components/layout/Panel.jsx`
- Adjust responsive breakpoints in Tailwind config

## 🐛 Troubleshooting

### Supabase Connection Issues
- Verify `.env` file has correct URL and key
- Check Supabase project is active
- Ensure realtime is enabled on `sessions` table

### Panels Not Syncing
- Check browser console for errors
- Verify all players use same room code
- Check Supabase dashboard for session data

### Local Storage Issues
- Clear browser storage: `localStorage.clear()`
- Reset panel order by refreshing page

## 📝 License

This is a fan project inspired by **Star Borg** by Free League Publishing. Star Borg is a trademark of Free League Publishing. This project is not affiliated with or endorsed by Free League Publishing.

## 🙏 Credits

- **Star Borg** - Free League Publishing
- **Icons** - Lucide Icons
- **Font** - Orbitron by Matt McInerney
- **Built with** - React, Vite, Tailwind CSS, Supabase

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs via GitHub Issues
- Suggest features or improvements
- Submit pull requests

---

**Made with 🚀 for the Star Borg community**

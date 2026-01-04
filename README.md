# Star Dashborg

A real-time multiplayer TTRPG companion dashboard for Star Borg, featuring an authentic retro sci-fi aesthetic with comprehensive oracle systems, character management, and session tools.

![Star Borg](https://img.shields.io/badge/Star%20Borg-Rebel%20Dashboard-yellow?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-264%20passing-green?style=flat-square)

## ⚡ Quick Overview

| Feature | Description |
|---------|-------------|
| 🎲 **Oracle System** | 40+ oracle tables, generators, Visual Boost Oracle with animations |
| 👥 **Multiplayer** | Real-time sync via Supabase for party play |
| 🚀 **Space Combat** | 6 battle stations, sound effects, ship upgrades |
| 📊 **Trackers** | Threat Die, Mission Tracks, Danger Clocks |
| 🎭 **Character System** | All 6 classes, promotions, respec, party panel |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (free tier works)

### Installation

```bash
# Clone and install
git clone https://github.com/yourusername/star-dashborg.git
cd star-dashborg
npm install

# Configure environment
# Create .env file with:
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Start development
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

<details>
<summary><strong>📦 Database Setup (Supabase SQL)</strong></summary>

Create a new project at [supabase.com](https://supabase.com) and run this SQL:

```sql
-- Sessions table for game state
create table sessions (
  room_code text primary key,
  game_state jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
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

-- RLS Policies
create policy "Users can view all rooms" on rooms for select using (true);
create policy "Users can create rooms" on rooms for insert with check (auth.uid() = gm_id);
create policy "Users can view characters in their rooms" on characters for select using (true);
create policy "Users can create their own characters" on characters for insert with check (auth.uid() = user_id);
create policy "Users can update their own characters" on characters for update using (auth.uid() = user_id);
create policy "Users can delete their own characters" on characters for delete using (auth.uid() = user_id);
create policy "Users can view their own profile" on admin_profiles for select using (auth.uid() = user_id);
```

**Upgrading?** Run migrations in `migrations/` folder in order.

</details>

---

## ✨ Features

<details>
<summary><strong>👥 Character & Party Management</strong></summary>

- **Character Creation** - All 6 Star Borg classes (Bot, Bounty Hunter, Magi Knight, Smuggler, Technician, Youngster)
- **Character Sheets** - Slide-out drawer with stats, HP tracking, equipment, destiny points, class features
- **Personal Journal** - Cloud-synced notes with auto-save (2-second debounce)
- **Party Panel** - Real-time view of all party members with synchronized HP
- **Galaxy Save Tracker** - Party-wide campaign progression with promotion alerts
- **Character Promotions** - Rank advancement with HP increases, stat boosts, and class abilities
- **Character Respec** - Reset to base values for re-specialization
- **Quick Stat Rolls** - Click any stat to roll d20 + modifier with crit/fumble detection
- **Authentication** - Secure accounts with admin approval workflow

</details>

<details>
<summary><strong>🎲 Core Gameplay Tools</strong></summary>

- **Threat Die Tracker** - Visual D6 with click-to-cycle, pulsing glow at max threat (6)
- **Mission Tracks** - Create missions with DR10/12/14/16 completion attempts
- **Danger Clocks** - Segment trackers (4/6/8/10) with filled state alerts
- **Dice Roller** - D4, D6, D8, D10, D12, D20, D100, 2D6 with advantage/disadvantage
- **Ship Log** - Real-time activity feed with formatted oracle results

</details>

<details>
<summary><strong>🔮 Oracle Systems</strong></summary>

- **40+ Oracle Tables** - Comprehensive tabbed interface in Oracle Compendium
- **Oracle History** - Navigate through up to 10 previous results per tab
- **Visual Boost Oracle** - Interactive 20-icon grid with slot machine animation
- **Affirmation Oracle** - Yes/No/And/But with mobile-responsive modifiers
- **Scene Shakeup** - Two-stage threat check (d20 + Threat Die vs 15+)
- **Travel Encounter** - Threat-based encounter check (d20 + Threat Die vs 12+)
- **Event Oracle** - Multi-roll complex event generator (verb, subject, specific)
- **Dangerous Locations** - Ship/Base location generator with obstacles
- **Site Explorer** - Procedural dungeon-crawl system
- **Morale Check** - 2D6 vs MRL with Flee/Surrender outcomes

**Optional Content:**
- **Perilous Void** - 10 opening scenes, 10 inciting incidents
- **Starforged** - 19 inciting incidents with intelligent deduplication

</details>

<details>
<summary><strong>🎭 Generators</strong></summary>

- **Monster Generator** - Beast adaptations, monstrosities, weak spots
- **Crime Lord Generator** - Names, visage, weapons, bases
- **NPC Generator** - Name, role, species, motivation, secrets, traits, demeanor
- **Planet Generator** - Terrain, weather, population, control, scenes
- **Settlement Generator** - Leader, landmark, rumors, NPC hook-ups
- **Mission Generator** - Integrates Star Borg + Perilous Void + Starforged
- **Ship Name Generator** - d100 table (10,000 possible names)

</details>

<details>
<summary><strong>🚀 Space Combat System</strong></summary>

**Battle Stations (6 stations across 3 decks):**
- Command Deck: Pilot (movement/evasion), Co-Pilot (targeting/torpedoes)
- Weapons Deck: Gunner 1 & 2 (laser turrets)
- Engineering Bay: Engineer 1 & 2 (repairs/systems/hyperdrive)

**Ship Systems:**
- Armor tiers (0-3) with visual damage reduction
- Torpedo loading (d2) and 5 torpedo types
- Hyperdrive charging (3 rounds)
- Ship upgrades: Turbo Lasers, Torpedo Winch, Overcharge Shields, Booster Rockets

**Combat Features:**
- 15+ immersive sound effects with mute toggle
- Ship Name Generator (procedural names like "The Androma")
- Detailed combat log with roll breakdowns
- Desktop optimized (1920px max width)

</details>

<details>
<summary><strong>🎯 Session Management</strong></summary>

- **Real-time Multiplayer** - Supabase-powered sync across all players
- **Character Persistence** - Auto-syncs to session
- **Session Journal** - Collaborative note-taking with auto-save
- **Customizable Layout** - Drag-and-drop panels between columns
- **Game Flow Drawer** - Step-by-step campaign/session guide
- **Help System** - Press `H` or `?` for context-sensitive help
- **Quick Reference** - Rules accessible from header

</details>

<details>
<summary><strong>🎨 Visual Design</strong></summary>

- **Star Borg Aesthetic** - Yellow/cyan/red color scheme with neon glow effects
- **CRT Scanlines** - Retro terminal styling throughout
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - Staggered dice animations, hover effects, alert pulses
- **Visual Alerts** - Pulsing glows for maximum threat and filled danger clocks
- **Sound Effects** - 15+ immersive audio effects with volume control

</details>

---

## 🎮 How to Use

<details>
<summary><strong>Getting Started</strong></summary>

1. **Create Account** - Sign up on the auth page (may require admin approval)
2. **Create Character** - Select class, stats auto-roll using class-specific dice
3. **Start Session** - Load app to generate room code, share via "Copy Invite"
4. **Play** - All players with same room code see real-time updates

</details>

<details>
<summary><strong>Key Controls</strong></summary>

| Action | How |
|--------|-----|
| Open character sheet | Click character icon in header |
| Roll stat test | Click any stat (d20 + modifier) |
| Open help | Press `H` or `?` key |
| Cycle threat die | Click the die |
| Mark mission progress | Click segments |
| Attempt mission | Click "Attempt" button |
| Open quick reference | Click "Quick Ref" in header |

</details>

---

## 📁 Project Structure

<details>
<summary><strong>View full structure</strong></summary>

```
star-dashborg/
├── src/
│   ├── components/
│   │   ├── auth/             # Auth, PendingApproval
│   │   ├── character/        # CharacterGenerator, CharacterSheetDrawer, PartyPanel
│   │   ├── journal/          # DiceLog, SessionJournal
│   │   ├── layout/           # Dashboard, Header, Panel, GameFlowDrawer
│   │   ├── oracles/          # Oracle systems and generators
│   │   ├── ship/             # ShipManager, UpgradeShop
│   │   ├── spacecombat/      # Space combat components + stations/
│   │   ├── trackers/         # ThreatDie, MissionTrack, DangerClock
│   │   └── ui/               # Button, HelpModal, LoadingScreen
│   ├── context/              # Auth, Character, Party, Game, SpaceCombat, OracleHistory
│   ├── data/                 # Oracle tables, character data, combat data
│   ├── hooks/                # useDebounce, useOracleHistory, useSwipeGesture, useSoundEffects
│   ├── lib/                  # assetPath, keyboardUtils, supabaseClient
│   ├── test/                 # Vitest setup and utilities
│   ├── utils/                # dice.js, shipUpgrades.js
│   └── App.jsx
├── public/
│   ├── sounds/               # 15+ audio files
│   └── images/boost/         # Visual Boost Oracle icons
├── migrations/               # SQL migration scripts
└── coverage/                 # Test coverage reports (generated)
```

</details>

---

## 🛠️ Development

### Tech Stack
React 19 • Vite • Vitest • Tailwind CSS • Supabase • Lucide React

### Commands
```bash
npm run dev        # Start dev server
npm test           # Run tests (264 tests)
npm run test:ui    # Vitest UI
npm run test:coverage  # Coverage report
npm run build      # Production build
```

### Testing
- **264 tests** across 19 test files
- Component, hook, utility, and integration tests
- Coverage reports in `coverage/` directory

<details>
<summary><strong>Test file list</strong></summary>

- `dice.test.js` (37 tests) - Dice rolling utilities
- `shipUpgrades.test.js` (36 tests) - Ship upgrade logic
- `LoadingScreen.test.jsx` (22 tests) - Loading states
- `ThreatDie.test.jsx` (20 tests) - Threat die behavior
- `useSwipeGesture.test.js` (19 tests) - Gesture detection
- `useOracleHistory.test.js` (17 tests) - History management
- `VisualBoostOracle.test.jsx` (16 tests) - Visual oracle
- `StationCard.test.jsx` (16 tests) - Station assignments
- `starforgedOracles.test.js` (14 tests) - Oracle data
- `assetPath.test.js` (13 tests) - Asset path handling
- `OracleQuickBar.test.jsx` (12 tests) - Modifier buttons
- `keyboardUtils.test.js` (8 tests) - Keyboard detection
- `useDebounce.test.js` (8 tests) - Debounce hook
- Plus context, component, and integration tests

</details>

<details>
<summary><strong>Adding new features</strong></summary>

**New Oracle Table:**
1. Add data array in `src/data/oracles.js`
2. Add `OracleTable` instance in `OracleCompendium.jsx`

**New Generator:**
1. Create function in `src/data/oracles.js`
2. Create component in `src/components/oracles/generators/`
3. Follow `MonsterGenerator.jsx` pattern

**New Help Content:**
1. Add content in `src/data/trackerHelpContent.js`
2. Add tab in `HelpModal.jsx`

</details>

---

## 🚢 Deployment

### GitHub Pages
1. Set repository secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
2. Push to `main` - GitHub Actions auto-deploys to `gh-pages`
3. Enable Pages in Settings > Pages (source: `gh-pages` branch)

### Other Platforms
Works on Vercel, Netlify, Cloudflare Pages - just add environment variables.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Supabase connection | Verify `.env` has correct URL/key, check project is active |
| Panels not syncing | Check console for errors, verify same room code |
| Assets not loading | Check base path in `vite.config.js` |
| Local storage issues | Run `localStorage.clear()` in console |

---

## 📝 License

Fan project inspired by **Star Borg** by Free League Publishing. Not affiliated with or endorsed by Free League.

## 🙏 Credits

- **Star Borg** - Free League Publishing
- **Icons** - Lucide Icons
- **Font** - Orbitron by Matt McInerney
- **Built with** - React, Vite, Tailwind CSS, Supabase

---

**Made with 🚀 for the Star Borg community**

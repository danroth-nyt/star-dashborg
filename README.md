# Star Dashborg

A real-time multiplayer TTRPG companion dashboard for Star Borg, featuring an authentic retro sci-fi aesthetic with comprehensive oracle systems, character management, and session management tools.

![Star Borg](https://img.shields.io/badge/Star%20Borg-Rebel%20Dashboard-yellow?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?style=flat-square)

## ✨ Features

### 👥 Character & Party Management
- **Character Creation** - Full character generator with class selection (Smuggler, Tech, Fighter, Psi, Bot)
- **Character Sheets** - Slide-out drawer with stats, HP tracking, equipment, and destiny points
- **Party Panel** - Real-time view of all characters in the session with synchronized HP and stats
- **Quick Stat Rolls** - Click any stat to roll d20 + modifier with crit/fumble detection
- **Authentication System** - Secure user accounts with admin approval workflow

### 🎲 Core Gameplay Tools
- **Threat Die Tracker** - Visual D6 with click-to-cycle functionality and maximum threat alerts
- **Mission Tracks** - Create and manage mission progress with completion attempts (DR10/12/14/16)
- **Danger Clocks** - Segment trackers (4/6/8/10) with filled state alerts
- **Dice Roller** - D4, D6, D8, D10, D12, D20, D100, and 2D6 with advantage/disadvantage
- **Ship Log** - Real-time activity feed with formatted oracle results and detailed roll breakdowns

### 🔮 Oracle Systems
- **Affirmation Oracle** - Yes/No/And/But oracle with advantage/disadvantage rolls and detail fields
- **Scene Shakeup** - Two-stage threat check (d20 + Threat Die, 15+ triggers)
- **Event Oracle** - Multi-roll complex event generator with 6 independent tables
- **Travel Encounter** - Threat-based encounter check (d20 + Threat Die, 12+ triggers)
- **Dangerous Locations** - Ship/Base location generator with obstacle mechanics
- **Site Explorer** - Procedural dungeon-crawl system for ships and bases
- **Morale Check** - 2D6 vs MRL with Flee/Surrender outcomes
- **Oracle Compendium** - Comprehensive tabbed interface with 40+ oracle tables

### 🎭 Generators
- **Monster Generator** - Beast adaptations, monstrosities, and weak spots with d6 rolls
- **Crime Lord Generator** - Names, visage, weapons, and bases
- **NPC Generator** - Role, species, motivation, secrets, traits, and travel encounters
- **Planet Generator** - Terrain, weather, population, control, and scenes
- **Settlement Generator** - Extended with leader, landmark, rumors, and NPC hook-ups
- **Mission Generator** - Detailed missions, quick missions, villains, and scenario titles

### 🎯 Session Management
- **Real-time Multiplayer** - Supabase-powered sync across all connected players
- **Character Persistence** - Each player's character automatically syncs to the session
- **Party Awareness** - See all party members' stats, HP, and status in real-time
- **Session Journal** - Collaborative note-taking with auto-save
- **Customizable Layout** - Drag-and-drop panels between columns
- **Game Flow Drawer** - Step-by-step campaign and session play procedure guide
- **Help Modal** - Context-sensitive help for trackers (press `H` or `?`)
- **Quick Reference** - Comprehensive rules reference accessible from header

### 🎨 Visual Design
- **Authentic Star Borg Aesthetic** - Yellow/cyan/red color scheme with neon glow effects
- **CRT Scanlines & Effects** - Retro terminal styling throughout
- **Fully Responsive** - Optimized for desktop, tablet, and mobile with adaptive button sizing
- **Smooth Animations** - Polished transitions, hover effects, and alert pulses
- **Visual Alerts** - Pulsing glows for maximum threat and filled danger clocks
- **Smooth Loading States** - Unified loading experience prevents jarring transitions

## ⚡ Key Highlights

### Character & Party Features
- **Full Character System**: Create characters with all Star Borg classes and species
- **Real-time Party Sync**: See all party members' characters update live
- **Interactive Stats**: Click stats to roll tests with automatic modifiers
- **HP Tracking**: Visual HP bars with damage/heal buttons
- **Character Persistence**: Characters saved to session, no need to recreate

### Threat-Based Mechanics
- **Scene Shakeup**: Two-stage threat check with automatic calculation
- **Travel Encounters**: Threat-based encounter generation with clear success/fail
- **Dangerous Locations**: Obstacle checks using Threat Die + d20 mechanics

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
     hp_current integer,
     hp_max integer,
     equipment jsonb,
     bits integer,
     destiny_points integer,
     class_features jsonb,
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

4. **Configure environment**
   
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Get these values from your Supabase project settings (Settings > API)

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
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
│   │   ├── character/        # CharacterGenerator, CharacterSheetDrawer, PartyPanel, PartyMemberCard
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
│   │   ├── trackers/         # ThreatDie, MissionTrack, DangerClock, SiteExplorer
│   │   └── ui/               # Button, Accordion, HelpModal, QuickReference, LoadingScreen
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication state management
│   │   ├── CharacterContext.jsx  # Character data management
│   │   ├── PartyContext.jsx  # Party members tracking
│   │   └── GameContext.jsx   # Global game state management
│   ├── data/
│   │   ├── characterData.js  # Character classes and species data
│   │   ├── oracles.js        # All oracle tables and generator functions
│   │   └── trackerHelpContent.js  # Help content for tracker components
│   ├── lib/
│   │   ├── supabaseClient.js # Supabase configuration
│   │   └── utils.js          # Utility functions
│   ├── types/
│   │   └── starborg.js       # TypeScript-style type definitions
│   ├── App.jsx               # Root component with auth flow
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles and custom animations
├── public/                   # Static assets
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

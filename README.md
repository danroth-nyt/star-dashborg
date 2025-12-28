# Star Dashborg

A real-time multiplayer TTRPG companion dashboard for Star Borg, featuring an authentic retro sci-fi aesthetic with comprehensive oracle systems, generators, and session management tools.

![Star Borg](https://img.shields.io/badge/Star%20Borg-Rebel%20Dashboard-yellow?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan?style=flat-square)

## ✨ Features

### 🎲 Core Gameplay Tools
- **Threat Die Tracker** - Visual D6 with click-to-cycle functionality
- **Mission Tracks** - Create and manage 4/6/8/10 step mission progress trackers
- **Danger Clocks** - Pie-chart style segment trackers for escalating threats
- **Dice Roller** - D4, D6, D8, D10, D12, D20, D100, and 2D6 with advantage/disadvantage
- **Ship Log** - Real-time activity feed with formatted oracle results

### 🔮 Oracle Systems
- **Affirmation Oracle** - Yes/No/And/But oracle with advantage/disadvantage rolls
- **Scene Shakeup** - Threat-based encounter escalation
- **Event Oracle** - Multi-roll complex event generator
- **Dangerous Locations** - Ship/Base location generator with threat mechanics
- **Oracle Compendium** - Comprehensive tabbed interface with 40+ oracle tables

### 🎭 Generators
- **Monster Generator** - Beast adaptations, monstrosities, and weak spots
- **Crime Lord Generator** - Names, visage, weapons, and bases
- **NPC Generator** - Role, species, motivation, secrets, and traits
- **Planet Generator** - Terrain, weather, population, and control
- **Settlement Generator** - Appearance, complications, and current state
- **Mission Generator** - Detailed missions, quick missions, villains, and scenarios

### 🎯 Session Management
- **Real-time Multiplayer** - Supabase-powered sync across all connected players
- **Session Journal** - Collaborative note-taking with auto-save
- **Customizable Layout** - Drag-and-drop panels between columns
- **Game Flow Drawer** - Quick access to all trackers and generators

### 🎨 Visual Design
- **Authentic Star Borg Aesthetic** - Yellow/cyan/red color scheme
- **CRT Scanlines & Effects** - Retro terminal styling throughout
- **Responsive Design** - Optimized for desktop and mobile
- **Smooth Animations** - Polished transitions and hover effects

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
   create table sessions (
     room_code text primary key,
     game_state jsonb,
     created_at timestamp with time zone default now()
   );

   -- Enable realtime updates
   alter publication supabase_realtime add table sessions;
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

### Starting a Session
1. Load the app to generate a random 4-character room code
2. Click **"Copy Invite"** to share the session URL with players
3. All players with the same room code will see real-time updates

### Panel Layout
- **Drag panels** between columns to customize your layout
- Layout preferences are saved in local storage
- Drop zones appear at the bottom of each column

### Oracle System
- Access oracles through the **Oracle Compendium** panel
- Results display with formatted data and roll breakdowns
- All oracle rolls are logged to the **Ship Log**

### Generators
- Use one-click generators for complex entities (NPCs, monsters, planets)
- Results show detailed breakdowns with individual roll values
- Generate as many times as needed - results update in real-time

## 📁 Project Structure

```
star-dashborg/
├── src/
│   ├── components/
│   │   ├── journal/          # DiceLog, SessionJournal
│   │   ├── layout/           # Dashboard, Header, Panel, GameFlowDrawer
│   │   ├── oracles/          # Oracle systems and generators
│   │   │   ├── generators/   # Monster, Crime Lord, NPC, Planet, Mission
│   │   │   ├── OracleCompendium.jsx
│   │   │   ├── OracleTable.jsx
│   │   │   └── DiceRoller.jsx
│   │   ├── trackers/         # ThreatDie, MissionTrack, DangerClock
│   │   └── ui/               # Button, Accordion, reusable components
│   ├── context/
│   │   └── GameContext.jsx   # Global game state management
│   ├── data/
│   │   └── oracles.js        # All oracle tables and generator functions
│   ├── lib/
│   │   ├── supabaseClient.js # Supabase configuration
│   │   └── utils.js          # Utility functions
│   ├── App.jsx               # Root component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles and custom classes
├── public/                   # Static assets
├── .env                      # Environment variables (create this)
├── package.json
├── tailwind.config.js        # Tailwind configuration
└── vite.config.js            # Vite configuration
```

## 🛠️ Development

### Tech Stack
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend and real-time sync
- **Lucide React** - Icon library
- **Orbitron Font** - Star Borg-style typography

### Key Technologies
- **React Context** - Global state management for game data
- **Supabase Realtime** - WebSocket-based multiplayer sync
- **LocalStorage** - Panel layout and preferences persistence
- **CSS Custom Properties** - Theme colors and effects

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
3. Follow the pattern from `MonsterGenerator.jsx`
4. Import and add to the appropriate tab in `OracleCompendium.jsx`

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

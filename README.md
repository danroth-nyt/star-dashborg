# Star Borg - Rebel Mission Dashboard

A real-time multiplayer TTRPG companion app inspired by Star Borg's gritty retro sci-fi aesthetic. Built with React, Vite, Tailwind CSS, and Supabase.

## Features

- **Real-time Multiplayer**: Share your session with remote players using Supabase realtime sync
- **Threat Die Tracker**: Visual D6 tracker with click-to-cycle functionality
- **Mission Tracks**: Create and track mission progress (4/6/8/10 step tracks)
- **Danger Clocks**: Visual pie-chart style danger clocks with segment tracking
- **Dice Roller**: Quick access to D4, D6, D8, D10, D12, D20, D100, and 2D6
- **Oracle System**: Yes/No oracle, mission generator, and random tables
- **Session Journal**: Shared note-taking with auto-save and debounced sync
- **Dice Log**: Real-time activity feed of all rolls and events
- **Star Borg Aesthetic**: Retro sci-fi styling with yellow/cyan/red accents, CRT scanlines, and glow effects

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Supabase account and project

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. In the SQL Editor, create the sessions table:

```sql
create table sessions (
  room_code text primary key,
  game_state jsonb
);

-- Enable realtime
alter publication supabase_realtime add table sessions;
```

3. Get your project URL and anon key from Settings > API

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173)

### How to Use

1. When you first load the app, a random room code will be generated
2. Share the URL (with `?room=XXXX` parameter) with other players
3. All players in the same room will see real-time updates
4. Use the "Copy Invite" button in the header to share your session

## Customizing Oracle Data

The oracle tables in `src/data/oracles.js` contain sample data. To add your own content from Star Borg PDFs:

1. Open `src/data/oracles.js`
2. Replace the placeholder arrays with your extracted oracle content
3. Add new categories as needed

## Deployment

This app is configured for GitHub Pages deployment:

1. Set up repository secrets in GitHub:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Push to the `main` branch to trigger automatic deployment

3. Configure GitHub Pages to use the `gh-pages` branch

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend/Sync**: Supabase (Postgres + Realtime)
- **Hosting**: GitHub Pages
- **Icons**: Lucide React
- **Font**: Orbitron (Google Fonts)

## License

This is a fan project inspired by Star Borg. Star Borg is a trademark of Free League Publishing.

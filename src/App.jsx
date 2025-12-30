import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import { PartyProvider } from './context/PartyContext';
import { GameProvider } from './context/GameContext';
import { supabase } from './lib/supabaseClient';
import { generateRoomCode, getRoomFromURL, updateURLWithRoom } from './lib/utils';
import Dashboard from './components/layout/Dashboard';
import Auth from './components/auth/Auth';
import PendingApproval from './components/auth/PendingApproval';
import CharacterGenerator from './components/character/CharacterGenerator';

function App() {
  const { session, loading: authLoading, approved, checkingApproval } = useAuth();
  const [roomCode, setRoomCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only initialize room if user is authenticated
    if (!session) {
      setLoading(false);
      return;
    }

    async function initializeRoom() {
      try {
        // Check if room code is in URL
        let code = getRoomFromURL();

        if (code) {
          // Try to join existing room
          const { data, error } = await supabase
            .from('sessions')
            .select('room_code')
            .eq('room_code', code)
            .single();

          if (error && error.code === 'PGRST116') {
            // Room doesn't exist, create it
            await createRoom(code);
          } else if (error) {
            throw error;
          }

          setRoomCode(code);
        } else {
          // No room code in URL, create a new room
          code = generateRoomCode();
          await createRoom(code);
          updateURLWithRoom(code);
          setRoomCode(code);
        }
      } catch (err) {
        console.error('Error initializing room:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function createRoom(code) {
      // First, create the room entry (required for foreign key)
      const { error: roomError } = await supabase.from('rooms').insert({
        code: code,
        gm_id: session.user.id,
      });

      // Ignore duplicate key errors for rooms
      if (roomError && roomError.code !== '23505') {
        throw roomError;
      }

      // Then create the session
      const { error: sessionError } = await supabase.from('sessions').insert({
        room_code: code,
        game_state: {
          threatDie: 1,
          missions: [],
          dangerClocks: [],
          journal: '',
          log: [],
        },
      });

      // Ignore duplicate key errors for sessions
      if (sessionError && sessionError.code !== '23505') {
        throw sessionError;
      }
    }

    initializeRoom();
  }, [session]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center scanlines">
        <div className="text-center space-y-4">
          <div className="text-accent-cyan text-3xl font-orbitron text-glow-cyan typewriter">
            AUTHENTICATING
          </div>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    );
  }

  // Show Auth component if not logged in
  if (!session) {
    return <Auth />;
  }

  // Check approval status
  if (checkingApproval) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center scanlines">
        <div className="text-center space-y-4">
          <div className="text-accent-cyan text-3xl font-orbitron text-glow-cyan typewriter">
            CHECKING ACCESS
          </div>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    );
  }

  // Show pending approval if user is not approved
  if (!approved) {
    return <PendingApproval />;
  }

  // Show loading while initializing room
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center scanlines">
        <div className="text-center space-y-4">
          <div className="text-accent-cyan text-3xl font-orbitron text-glow-cyan typewriter">
            INITIALIZING SESSION
          </div>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
          </div>
          <div className="text-accent-yellow/50 text-sm font-mono mt-6">
            {'>'} Establishing secure connection...<br />
            {'>'} Loading rebel systems...<br />
            {'>'} Syncing mission data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-accent-red text-2xl font-orbitron text-glow-red">
          ERROR: {error}
        </div>
      </div>
    );
  }

  return (
    <CharacterProvider userId={session.user.id} roomCode={roomCode}>
      <PartyProvider roomCode={roomCode}>
        <AppContent roomCode={roomCode} />
      </PartyProvider>
    </CharacterProvider>
  );
}

// Inner component that uses CharacterContext
function AppContent({ roomCode }) {
  const { character, loading: characterLoading } = useCharacter();

  if (characterLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center scanlines">
        <div className="text-center space-y-4">
          <div className="text-accent-cyan text-3xl font-orbitron text-glow-cyan typewriter">
            LOADING CHARACTER
          </div>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    );
  }

  // No character yet - show generator
  if (!character) {
    return (
      <div className="min-h-screen bg-bg-primary p-4 md:p-8 scanlines">
        <div className="max-w-6xl mx-auto">
          <CharacterGenerator />
        </div>
      </div>
    );
  }

  // Has character - show dashboard
  return (
    <GameProvider roomCode={roomCode}>
      <Dashboard roomCode={roomCode} />
    </GameProvider>
  );
}

export default App;

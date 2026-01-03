import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import { PartyProvider } from './context/PartyContext';
import { GameProvider } from './context/GameContext';
import { SpaceCombatProvider } from './context/SpaceCombatContext';
import { supabase } from './lib/supabaseClient';
import { generateRoomCode, getRoomFromURL, updateURLWithRoom } from './lib/utils';
import Dashboard from './components/layout/Dashboard';
import Auth from './components/auth/Auth';
import PendingApproval from './components/auth/PendingApproval';
import CharacterGenerator from './components/character/CharacterGenerator';
import LoadingScreen from './components/ui/LoadingScreen';

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
          const { error } = await supabase
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
    return <LoadingScreen message="AUTHENTICATING" />;
  }

  // Show Auth component if not logged in
  if (!session) {
    return <Auth />;
  }

  // Check approval status
  if (checkingApproval) {
    return <LoadingScreen message="CHECKING ACCESS" />;
  }

  // Show pending approval if user is not approved
  if (!approved) {
    return <PendingApproval />;
  }

  // Show loading while initializing room
  if (loading) {
    return (
      <LoadingScreen
        message="INITIALIZING SESSION"
        details={[
          'Establishing secure connection...',
          'Loading rebel systems...',
          'Syncing mission data...',
        ]}
      />
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

  // Show loading screen while character state is being determined
  if (characterLoading) {
    return <LoadingScreen message="LOADING CHARACTER" />;
  }

  // Wrap everything in GameProvider so both CharacterGenerator and Dashboard have access
  return (
    <GameProvider roomCode={roomCode}>
      {!characterLoading && character === null ? (
        // Show CharacterGenerator if loading is complete AND character is confirmed null
        // This prevents the flash when character is still being loaded
        <div className="min-h-screen bg-bg-primary p-4 md:p-8 scanlines">
          <div className="max-w-6xl mx-auto">
            <CharacterGenerator />
          </div>
        </div>
      ) : (
        // Has character - show dashboard
        <SpaceCombatProvider roomCode={roomCode}>
          <Dashboard roomCode={roomCode} />
        </SpaceCombatProvider>
      )}
    </GameProvider>
  );
}

export default App;

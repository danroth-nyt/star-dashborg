import { useEffect, useState } from 'react';
import { GameProvider } from './context/GameContext';
import { supabase } from './lib/supabaseClient';
import { generateRoomCode, getRoomFromURL, updateURLWithRoom } from './lib/utils';
import Dashboard from './components/layout/Dashboard';

function App() {
  const [roomCode, setRoomCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      const { error } = await supabase.from('sessions').insert({
        room_code: code,
        game_state: {
          threatDie: 1,
          missions: [],
          dangerClocks: [],
          journal: '',
          log: [],
        },
      });

      if (error && error.code !== '23505') {
        // Ignore duplicate key errors
        throw error;
      }
    }

    initializeRoom();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-accent-cyan text-2xl font-orbitron text-glow-cyan">
          INITIALIZING SESSION...
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
    <GameProvider roomCode={roomCode}>
      <Dashboard roomCode={roomCode} />
    </GameProvider>
  );
}

export default App;

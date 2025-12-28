import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const GameContext = createContext();

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

const initialGameState = {
  threatDie: 1,
  missions: [],
  dangerClocks: [],
  journal: '',
  log: [],
};

export function GameProvider({ children, roomCode }) {
  const [gameState, setGameState] = useState(initialGameState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial game state
  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    async function loadGameState() {
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('game_state')
          .eq('room_code', roomCode)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No row found - this is fine for new rooms
            setGameState(initialGameState);
          } else {
            throw error;
          }
        } else if (data?.game_state) {
          setGameState(data.game_state);
        }
      } catch (err) {
        console.error('Error loading game state:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadGameState();
  }, [roomCode]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!roomCode) return;

    const channel = supabase
      .channel(`room:${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `room_code=eq.${roomCode}`,
        },
        (payload) => {
          if (payload.new?.game_state) {
            setGameState(payload.new.game_state);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode]);

  // Update game state in Supabase
  const updateGameState = useCallback(
    async (updates) => {
      if (!roomCode) return;

      const newState = typeof updates === 'function' ? updates(gameState) : { ...gameState, ...updates };
      
      // Optimistic update
      setGameState(newState);

      try {
        const { error } = await supabase
          .from('sessions')
          .upsert({
            room_code: roomCode,
            game_state: newState,
          });

        if (error) throw error;
      } catch (err) {
        console.error('Error updating game state:', err);
        setError(err.message);
        // Revert optimistic update on error
        setGameState(gameState);
      }
    },
    [roomCode, gameState]
  );

  // Add log entry
  const addLog = useCallback(
    (message, type = 'info') => {
      updateGameState((state) => ({
        ...state,
        log: [
          {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            message,
            type,
          },
          ...state.log,
        ].slice(0, 100), // Keep last 100 entries
      }));
    },
    [updateGameState]
  );

  const value = {
    gameState,
    updateGameState,
    addLog,
    loading,
    error,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}


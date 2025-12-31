import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  includePVOracles: true, // Include Perilous Void oracles by default
  spaceCombat: {
    isActive: false,
    shipArmor: 2,
    torpedoesLoaded: 0,
    hyperdriveCharge: 0,
    stationAssignments: {
      pilot: null,
      copilot: null,
      engineer1: null,
      engineer2: null,
      gunner1: null,
      gunner2: null,
    },
    combatLog: [],
  },
  ship: {
    name: 'The Rebel Corvette',
    heroicUpgrades: [],
    purchasedUpgrades: [],
    torpedoInventory: {
      standard: 0,
      cluster: 0,
      hunterKiller: 0,
      chaff: 0,
      ion: 0,
    },
    turboLaserStation: null,
    galaxiesSaved: 0,
  },
};

export function GameProvider({ children, roomCode }) {
  const [gameState, setGameState] = useState(initialGameState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const syncTimerRef = useRef(null);
  const pendingStateRef = useRef(null);

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
          // Migrate old game states that don't have ship property
          const migratedState = {
            ...data.game_state,
            ship: data.game_state.ship || initialGameState.ship,
          };
          setGameState(migratedState);
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

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, []);

  // Update game state in Supabase
  const updateGameState = useCallback(
    (updates) => {
      if (!roomCode) return;

      let newState;
      
      // Immediate UI update
      setGameState(currentState => {
        newState = typeof updates === 'function' ? updates(currentState) : { ...currentState, ...updates };
        pendingStateRef.current = newState;
        return newState;
      });

      // Debounced database sync
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }

      syncTimerRef.current = setTimeout(async () => {
        try {
          const stateToSync = pendingStateRef.current;
          const { error } = await supabase
            .from('sessions')
            .upsert({
              room_code: roomCode,
              game_state: stateToSync,
            });

          if (error) throw error;
        } catch (err) {
          console.error('Error syncing game state:', err);
          setError(err.message);
        }
      }, 300); // 300ms debounce
    },
    [roomCode]
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

  // Toggle Perilous Void oracles
  const togglePVOracles = useCallback(
    (enabled) => {
      updateGameState((state) => ({
        ...state,
        includePVOracles: enabled,
      }));
    },
    [updateGameState]
  );

  const value = {
    gameState,
    updateGameState,
    addLog,
    togglePVOracles,
    loading,
    error,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}


import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';

const GameContext = createContext();

// Generate a unique client ID for this browser tab
const generateClientId = () => `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
  includeStarforgedOracles: true, // Include Starforged oracles by default
  panelStates: {}, // Track collapsed state of panels: { panelId: isCollapsed }
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
  const dirtyFieldsRef = useRef(new Set()); // Track fields with pending local changes
  const isSyncingRef = useRef(false); // Track if we're currently syncing to DB
  const broadcastChannelRef = useRef(null); // Broadcast channel for instant sync
  const lastBroadcastTimestampRef = useRef(0); // Track last received broadcast timestamp
  
  // Generate stable client ID for this session
  const clientId = useMemo(() => generateClientId(), []);

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
          // Migrate old game states that don't have ship or panelStates properties
          const migratedState = {
            ...data.game_state,
            ship: data.game_state.ship || initialGameState.ship,
            panelStates: data.game_state.panelStates || initialGameState.panelStates,
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

  // Subscribe to broadcast channel for instant sync
  useEffect(() => {
    if (!roomCode) return;

    const broadcastChannel = supabase
      .channel(`game-sync:${roomCode}`)
      .on('broadcast', { event: 'game_state_update' }, (payload) => {
        const { senderId, timestamp, updates } = payload.payload;
        
        // Ignore our own broadcasts
        if (senderId === clientId) return;
        
        // Ignore stale broadcasts (older than our last received)
        if (timestamp <= lastBroadcastTimestampRef.current) return;
        lastBroadcastTimestampRef.current = timestamp;
        
        // Apply the updates from the broadcast
        setGameState((currentState) => {
          // Only update fields that aren't dirty locally
          const mergedState = { ...currentState };
          Object.keys(updates).forEach((key) => {
            if (!dirtyFieldsRef.current.has(key)) {
              mergedState[key] = updates[key];
            }
          });
          return mergedState;
        });
      })
      .subscribe();

    broadcastChannelRef.current = broadcastChannel;

    return () => {
      supabase.removeChannel(broadcastChannel);
      broadcastChannelRef.current = null;
    };
  }, [roomCode, clientId]);

  // Subscribe to postgres_changes as fallback for persistence/reconnection
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
            const remoteState = payload.new.game_state;
            
            // Merge strategy: Only accept remote values for fields we're not currently editing
            // This serves as a fallback - broadcast should have already applied most updates
            setGameState((currentState) => {
              // If we're in the middle of syncing our own changes, ignore this update
              if (isSyncingRef.current) {
                return currentState;
              }

              const mergedState = { ...currentState };
              
              // For each top-level field in remote state
              Object.keys(remoteState).forEach((key) => {
                // Only accept remote value if this field isn't marked as dirty (locally edited)
                if (!dirtyFieldsRef.current.has(key)) {
                  mergedState[key] = remoteState[key];
                }
              });
              
              return mergedState;
            });
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

  // Update game state in Supabase with dirty field tracking and instant broadcast
  const updateGameState = useCallback(
    (updates) => {
      if (!roomCode) return;

      let newState;
      let changedFields = new Set();
      let changedUpdates = {};
      
      // Immediate UI update
      setGameState(currentState => {
        newState = typeof updates === 'function' ? updates(currentState) : { ...currentState, ...updates };
        pendingStateRef.current = newState;
        
        // Track which top-level fields changed
        if (typeof updates === 'function') {
          // For function updates, find actual differences
          Object.keys(newState).forEach(key => {
            if (JSON.stringify(currentState[key]) !== JSON.stringify(newState[key])) {
              changedFields.add(key);
              changedUpdates[key] = newState[key];
            }
          });
        } else {
          // For object updates, only mark the changed fields
          Object.keys(updates).forEach(key => {
            changedFields.add(key);
            changedUpdates[key] = updates[key];
          });
        }
        
        // Mark these fields as dirty (locally modified, pending sync)
        changedFields.forEach(field => dirtyFieldsRef.current.add(field));
        
        return newState;
      });

      // Broadcast changes immediately for instant sync with other clients
      if (broadcastChannelRef.current && Object.keys(changedUpdates).length > 0) {
        broadcastChannelRef.current.send({
          type: 'broadcast',
          event: 'game_state_update',
          payload: {
            senderId: clientId,
            timestamp: Date.now(),
            updates: changedUpdates,
          },
        });
      }

      // Debounced database sync for persistence
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }

      syncTimerRef.current = setTimeout(async () => {
        try {
          isSyncingRef.current = true; // Flag that we're syncing
          const stateToSync = pendingStateRef.current;
          
          const { error } = await supabase
            .from('sessions')
            .upsert({
              room_code: roomCode,
              game_state: stateToSync,
            });

          if (error) throw error;
          
          // Clear dirty fields after successful sync
          dirtyFieldsRef.current.clear();
        } catch (err) {
          console.error('Error syncing game state:', err);
          setError(err.message);
        } finally {
          isSyncingRef.current = false; // Clear syncing flag
        }
      }, 300); // 300ms debounce
    },
    [roomCode, clientId]
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

  // Toggle Starforged oracles
  const toggleStarforgedOracles = useCallback(
    (enabled) => {
      updateGameState((state) => ({
        ...state,
        includeStarforgedOracles: enabled,
      }));
    },
    [updateGameState]
  );

  const value = {
    gameState,
    updateGameState,
    addLog,
    togglePVOracles,
    toggleStarforgedOracles,
    loading,
    error,
    roomCode, // Expose roomCode for child contexts
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}


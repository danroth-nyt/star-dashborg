import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useGame } from './GameContext';

const SpaceCombatContext = createContext();

export function useSpaceCombat() {
  const context = useContext(SpaceCombatContext);
  if (!context) {
    throw new Error('useSpaceCombat must be used within a SpaceCombatProvider');
  }
  return context;
}

const initialSpaceCombatState = {
  isActive: false,
  shipArmor: 2, // Tier 2 default
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
};

export function SpaceCombatProvider({ children }) {
  const { gameState, updateGameState, addLog } = useGame();
  const [localState, setLocalState] = useState(initialSpaceCombatState);

  // Sync with game state
  useEffect(() => {
    if (gameState.spaceCombat) {
      setLocalState(gameState.spaceCombat);
    }
  }, [gameState.spaceCombat]);

  // Update space combat state
  const updateSpaceCombat = useCallback(
    (updates) => {
      setLocalState((currentState) => {
        const newSpaceCombat = typeof updates === 'function' 
          ? updates(currentState) 
          : { ...currentState, ...updates };
        
        updateGameState({ spaceCombat: newSpaceCombat });
        return newSpaceCombat;
      });
    },
    [updateGameState]
  );

  // Enter space combat mode
  const enterCombat = useCallback(() => {
    updateSpaceCombat({ 
      isActive: true,
      shipArmor: 2,
      torpedoesLoaded: 0,
      hyperdriveCharge: 0,
      combatLog: []
    });
    addLog('Entering space combat - Battle Stations!', 'combat');
  }, [updateSpaceCombat, addLog]);

  // Exit space combat mode
  const exitCombat = useCallback(() => {
    updateSpaceCombat({ isActive: false });
    addLog('Space combat ended', 'combat');
  }, [updateSpaceCombat, addLog]);

  // Assign character to station
  const assignStation = useCallback(
    (stationId, characterId) => {
      updateSpaceCombat((prev) => ({
        ...prev,
        stationAssignments: {
          ...prev.stationAssignments,
          [stationId]: characterId,
        },
      }));
    },
    [updateSpaceCombat]
  );

  // Unassign character from station
  const unassignStation = useCallback(
    (stationId) => {
      updateSpaceCombat((prev) => ({
        ...prev,
        stationAssignments: {
          ...prev.stationAssignments,
          [stationId]: null,
        },
      }));
    },
    [updateSpaceCombat]
  );

  // Modify ship armor
  const modifyArmor = useCallback(
    (change) => {
      // Play shield hit sound when armor decreases
      if (change < 0) {
        const audio = new Audio(`${import.meta.env.BASE_URL}sounds/shield-hit.mp3`);
        audio.volume = 0.5;
        audio.play().catch(() => {}); // Silently fail if autoplay blocked
      }
      // Play shield power-up sound when armor increases
      else if (change > 0) {
        const audio = new Audio(`${import.meta.env.BASE_URL}sounds/shield-power-up.mp3`);
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }
      
      updateSpaceCombat((prev) => {
        const newArmor = Math.max(0, Math.min(3, prev.shipArmor + change));
        return { ...prev, shipArmor: newArmor };
      });
    },
    [updateSpaceCombat]
  );

  // Load torpedoes
  const loadTorpedoes = useCallback(
    (count) => {
      updateSpaceCombat((prev) => ({
        ...prev,
        torpedoesLoaded: prev.torpedoesLoaded + count,
      }));
    },
    [updateSpaceCombat]
  );

  // Fire torpedo
  const fireTorpedo = useCallback(() => {
    updateSpaceCombat((prev) => ({
      ...prev,
      torpedoesLoaded: Math.max(0, prev.torpedoesLoaded - 1),
    }));
  }, [updateSpaceCombat]);

  // Charge hyperdrive
  const chargeHyperdrive = useCallback(() => {
    updateSpaceCombat((prev) => ({
      ...prev,
      hyperdriveCharge: Math.min(3, prev.hyperdriveCharge + 1),
    }));
  }, [updateSpaceCombat]);

  // Decrement hyperdrive
  const decrementHyperdrive = useCallback(() => {
    updateSpaceCombat((prev) => ({
      ...prev,
      hyperdriveCharge: Math.max(0, prev.hyperdriveCharge - 1),
    }));
  }, [updateSpaceCombat]);

  // Reset hyperdrive
  const resetHyperdrive = useCallback(() => {
    updateSpaceCombat((prev) => ({
      ...prev,
      hyperdriveCharge: 0,
    }));
  }, [updateSpaceCombat]);

  // Add combat log entry
  const addCombatLog = useCallback(
    (message, type = 'info', data = null) => {
      updateSpaceCombat((prev) => ({
        ...prev,
        combatLog: [
          {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            message,
            type,
            data, // Additional metadata like rollMode, drAdjust, etc.
          },
          ...prev.combatLog,
        ].slice(0, 50), // Keep last 50 entries
      }));
    },
    [updateSpaceCombat]
  );

  const value = {
    spaceCombat: localState,
    updateSpaceCombat,
    enterCombat,
    exitCombat,
    assignStation,
    unassignStation,
    modifyArmor,
    loadTorpedoes,
    fireTorpedo,
    chargeHyperdrive,
    decrementHyperdrive,
    resetHyperdrive,
    addCombatLog,
  };

  return (
    <SpaceCombatContext.Provider value={value}>
      {children}
    </SpaceCombatContext.Provider>
  );
}

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useGame } from './GameContext';
import { getMaxArmorTier } from '../utils/shipUpgrades';
import { 
  rollMoraleCheck, 
  rollWeaponDamage, 
  calculateDamageAfterArmor,
  ENEMY_SHIPS 
} from '../data/enemyShipData';

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
  enemies: [], // Enemy ships/units being tracked
};

export function SpaceCombatProvider({ children }) {
  const { gameState, updateGameState, addLog } = useGame();
  const [localState, setLocalState] = useState(initialSpaceCombatState);
  const [viewingCombat, setViewingCombat] = useState(false); // Local-only state for this user's view

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

  // Enter space combat mode (shared state + local view)
  const enterCombat = useCallback(() => {
    updateSpaceCombat({ 
      isActive: true,
      shipArmor: 2,
      torpedoesLoaded: 0,
      hyperdriveCharge: 0,
      combatLog: []
    });
    setViewingCombat(true); // Set local viewing state
    addLog('Entering space combat - Battle Stations!', 'combat');
  }, [updateSpaceCombat, addLog]);

  // Exit combat view for this user only (local state)
  const exitCombatView = useCallback(() => {
    setViewingCombat(false);
  }, []);

  // Join an active combat session (local state only)
  const joinCombatView = useCallback(() => {
    setViewingCombat(true);
  }, []);

  // Exit space combat mode for all users (shared state)
  const exitCombat = useCallback(() => {
    updateSpaceCombat({ isActive: false });
    setViewingCombat(false); // Also exit local view
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
      
      // Get max tier based on ship upgrades (default 2, or 3 with Overcharge Shields)
      const maxTier = getMaxArmorTier(gameState.ship || {});
      
      updateSpaceCombat((prev) => {
        const newArmor = Math.max(0, Math.min(maxTier, prev.shipArmor + change));
        return { ...prev, shipArmor: newArmor };
      });
    },
    [updateSpaceCombat, gameState.ship]
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

  // ==========================================
  // ENEMY MANAGEMENT
  // ==========================================

  // Add a single enemy
  const addEnemy = useCallback(
    (enemy) => {
      updateSpaceCombat((prev) => ({
        ...prev,
        enemies: [...(prev.enemies || []), enemy],
      }));
      addCombatLog(`Enemy spawned: ${enemy.name}`, 'enemy', { enemyId: enemy.id });
    },
    [updateSpaceCombat, addCombatLog]
  );

  // Add multiple enemies at once
  const addEnemies = useCallback(
    (enemies) => {
      updateSpaceCombat((prev) => ({
        ...prev,
        enemies: [...(prev.enemies || []), ...enemies],
      }));
      const names = enemies.map(e => e.name).join(', ');
      addCombatLog(`Enemies spawned: ${names}`, 'enemy', { count: enemies.length });
    },
    [updateSpaceCombat, addCombatLog]
  );

  // Update an existing enemy
  const updateEnemy = useCallback(
    (enemyId, updates) => {
      updateSpaceCombat((prev) => ({
        ...prev,
        enemies: (prev.enemies || []).map((enemy) =>
          enemy.id === enemyId ? { ...enemy, ...updates } : enemy
        ),
      }));
    },
    [updateSpaceCombat]
  );

  // Remove an enemy
  const removeEnemy = useCallback(
    (enemyId) => {
      updateSpaceCombat((prev) => {
        const enemy = (prev.enemies || []).find(e => e.id === enemyId);
        return {
          ...prev,
          enemies: (prev.enemies || []).filter((e) => e.id !== enemyId),
        };
      });
    },
    [updateSpaceCombat]
  );

  // Clear all enemies
  const clearAllEnemies = useCallback(() => {
    updateSpaceCombat((prev) => ({
      ...prev,
      enemies: [],
    }));
    addCombatLog('All enemies cleared', 'info');
  }, [updateSpaceCombat, addCombatLog]);

  // Apply damage to an enemy (with armor calculation)
  const applyDamageToEnemy = useCallback(
    (enemyId, damage) => {
      updateSpaceCombat((prev) => {
        const enemies = prev.enemies || [];
        const enemy = enemies.find(e => e.id === enemyId);
        if (!enemy) return prev;

        // Calculate damage after armor
        const { finalDamage, reduction, armorDie } = calculateDamageAfterArmor(damage, enemy.armor);
        
        // Check for fodder (one-hit kill)
        let newHp;
        if (enemy.fodder && finalDamage > 0) {
          newHp = 0;
        } else {
          newHp = Math.max(0, enemy.hp.current - finalDamage);
        }

        const newStatus = newHp === 0 ? 'destroyed' : enemy.status;

        // Log the damage
        let logMessage = `${enemy.name} takes ${finalDamage} damage`;
        if (reduction > 0) {
          logMessage += ` (${damage} - ${armorDie}[${reduction}] armor)`;
        }
        if (newHp === 0) {
          logMessage += ' - DESTROYED!';
        } else {
          logMessage += ` [${newHp}/${enemy.hp.max} HP]`;
        }

        return {
          ...prev,
          enemies: enemies.map((e) =>
            e.id === enemyId
              ? { ...e, hp: { ...e.hp, current: newHp }, status: newStatus }
              : e
          ),
          combatLog: [
            {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              message: logMessage,
              type: newHp === 0 ? 'destroy' : 'damage',
              data: { enemyId, damage, finalDamage, reduction },
            },
            ...prev.combatLog,
          ].slice(0, 50),
        };
      });
    },
    [updateSpaceCombat]
  );

  // Roll enemy attack (returns damage result for display)
  const rollEnemyAttack = useCallback(
    (enemyId) => {
      const enemies = localState.enemies || [];
      const enemy = enemies.find(e => e.id === enemyId);
      if (!enemy || !enemy.weapon) return null;

      const result = rollWeaponDamage(enemy.weapon, enemy.weapon.advantage);
      
      addCombatLog(
        `${enemy.name} attacks with ${enemy.weapon.name}: ${result.total} damage`,
        'attack',
        { enemyId, ...result }
      );

      return result;
    },
    [localState.enemies, addCombatLog]
  );

  // Roll morale check for an enemy
  const rollEnemyMorale = useCallback(
    (enemyId) => {
      const enemies = localState.enemies || [];
      const enemy = enemies.find(e => e.id === enemyId);
      if (!enemy || enemy.morale === null) return null;

      // Check for squadthink bonus
      const sameTypeCount = enemies.filter(
        e => e.type === enemy.type && e.status === 'active'
      ).length;
      const template = ENEMY_SHIPS[enemy.type];
      const effectiveMorale = (sameTypeCount >= 4 && template?.moraleBoosted) 
        ? template.moraleBoosted 
        : enemy.morale;

      const result = rollMoraleCheck(effectiveMorale);

      let logMessage = `${enemy.name} morale check: [${result.dice.join(', ')}] = ${result.total} vs MRL ${effectiveMorale}`;
      if (sameTypeCount >= 4 && template?.moraleBoosted) {
        logMessage += ' (Squadthink)';
      }

      if (result.demoralized) {
        logMessage += ` - DEMORALIZED! ${result.outcome === 'flees' ? 'FLEEING!' : 'SURRENDERS!'}`;
        
        // Update enemy status
        updateSpaceCombat((prev) => ({
          ...prev,
          enemies: (prev.enemies || []).map((e) =>
            e.id === enemyId
              ? { ...e, status: result.outcome === 'flees' ? 'fleeing' : 'surrendered' }
              : e
          ),
        }));
      } else {
        logMessage += ' - Holds firm!';
      }

      addCombatLog(logMessage, result.demoralized ? 'morale-fail' : 'morale', {
        enemyId,
        ...result,
        effectiveMorale,
      });

      return result;
    },
    [localState.enemies, addCombatLog, updateSpaceCombat]
  );

  // Quick HP adjustment (for inline roster)
  const adjustEnemyHp = useCallback(
    (enemyId, delta) => {
      updateSpaceCombat((prev) => {
        const enemies = prev.enemies || [];
        const enemy = enemies.find(e => e.id === enemyId);
        if (!enemy) return prev;

        const newHp = Math.max(0, Math.min(enemy.hp.max, enemy.hp.current + delta));
        const newStatus = newHp === 0 ? 'destroyed' : (newHp > 0 && enemy.status === 'destroyed') ? 'active' : enemy.status;

        return {
          ...prev,
          enemies: enemies.map((e) =>
            e.id === enemyId
              ? { ...e, hp: { ...e.hp, current: newHp }, status: newStatus }
              : e
          ),
        };
      });
    },
    [updateSpaceCombat]
  );

  // Get count of active enemies
  const getActiveEnemyCount = useCallback(() => {
    return (localState.enemies || []).filter(e => e.status === 'active').length;
  }, [localState.enemies]);

  const value = {
    spaceCombat: localState,
    viewingCombat,
    updateSpaceCombat,
    enterCombat,
    exitCombat,
    exitCombatView,
    joinCombatView,
    assignStation,
    unassignStation,
    modifyArmor,
    loadTorpedoes,
    fireTorpedo,
    chargeHyperdrive,
    decrementHyperdrive,
    resetHyperdrive,
    addCombatLog,
    // Enemy management
    addEnemy,
    addEnemies,
    updateEnemy,
    removeEnemy,
    clearAllEnemies,
    applyDamageToEnemy,
    rollEnemyAttack,
    rollEnemyMorale,
    adjustEnemyHp,
    getActiveEnemyCount,
  };

  return (
    <SpaceCombatContext.Provider value={value}>
      {children}
    </SpaceCombatContext.Provider>
  );
}

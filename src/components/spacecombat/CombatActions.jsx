import { useState } from 'react';
import { Dices, Target, Shield, Wrench, Zap, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useParty } from '../../context/PartyContext';
import { useGame } from '../../context/GameContext';
import { ACTIONS } from '../../data/spaceCombatData';
import { TORPEDO_TYPES } from '../../data/shipShopData';
import { rollDice, rollD, rollTest } from '../../utils/dice';
import { getMaxArmorTier, getGunnerDamage, canAnyStationLoadTorpedoes, hasUpgrade } from '../../utils/shipUpgrades';
import TorpedoSelector from './TorpedoSelector';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const ACTION_ICONS = {
  attack: Zap,
  defense: Shield,
  support: Wrench,
  special: Target,
};

export default function CombatActions({ stationId, actionIds, assignedCharacterId }) {
  const { addCombatLog, spaceCombat, fireTorpedo, modifyArmor, loadTorpedoes, chargeHyperdrive } = useSpaceCombat();
  const { partyMembers } = useParty();
  const { gameState, updateGameState } = useGame();
  const { play } = useSoundEffects();
  const [rollingAction, setRollingAction] = useState(null);
  const [selectedTorpedoType, setSelectedTorpedoType] = useState('standard');
  
  // Per-action modifiers state: { [actionId]: { rollMode: 'normal'|'advantage'|'disadvantage', drAdjust: number } }
  const [actionModifiers, setActionModifiers] = useState({});
  
  // Track which action's modifier controls are expanded
  const [expandedActionId, setExpandedActionId] = useState(null);

  const character = partyMembers.find(m => m.id === assignedCharacterId);
  const ship = gameState.ship || {
    heroicUpgrades: [],
    purchasedUpgrades: [],
    torpedoInventory: { standard: 0, cluster: 0, hunterKiller: 0, chaff: 0, ion: 0 },
    turboLaserStation: null,
  };
  
  // Apply ship upgrades to actions
  let actions = actionIds.map(id => {
    const action = { ...ACTIONS[id] };
    
    if (!action || !action.id) {
      console.error(`Action not found for id: ${id}`);
      return null;
    }
    
    // Apply Turbo Laser upgrade to gunner damage
    if (action.id === 'fireLaserTurret') {
      action.damage = getGunnerDamage(ship, stationId);
    }
    
    // Allow any station to load torpedoes if Torpedo Winch is installed
    if (action.id === 'loadTorpedo' && !canAnyStationLoadTorpedoes(ship)) {
      // Keep only for engineer stations by default
    }
    
    return action;
  }).filter(Boolean);
  
  // Add loadTorpedo action to all stations if Torpedo Winch installed
  if (canAnyStationLoadTorpedoes(ship) && !actionIds.includes('loadTorpedo')) {
    actions.push({ ...ACTIONS.loadTorpedo });
  }

  const getAbilityScore = (ability) => {
    if (!character || !character.stats) return 0;
    return character.stats[ability.toLowerCase()] || 0;
  };

  // Get modifier for an action (default: normal roll, 0 DR adjust)
  const getActionModifier = (actionId) => {
    return actionModifiers[actionId] || { rollMode: 'normal', drAdjust: 0 };
  };

  // Update modifier for an action
  const updateActionModifier = (actionId, updates) => {
    setActionModifiers(prev => ({
      ...prev,
      [actionId]: { ...getActionModifier(actionId), ...updates }
    }));
  };

  // Toggle modifier controls visibility
  const toggleModifierControls = (actionId) => {
    setExpandedActionId(prev => prev === actionId ? null : actionId);
  };

  const performAction = async (action) => {
    if (!character) return;
    
    // Check special requirements
    if (action.requiresTorpedo && spaceCombat.torpedoesLoaded === 0) {
      addCombatLog(`${action.name} failed: No torpedoes loaded!`, 'damage');
      return;
    }

    setRollingAction(action.id);

    // Sound mapping for all battle station actions
    const soundMap = {
      fireLaserTurret: 'laserFire',
      fixedBeamCannon: 'laserFire',
      fireTorpedo: 'torpedoFire',
      hyperdriveJump: 'hyperdriveCharge',
      evade: 'evade',
      targetLock: 'targetLock',
      jamming: 'jamming',
      repairShield: 'repairShield',
      loadTorpedo: 'loadTorpedo',
      deflectors: 'deflectors',
      steady: 'steady',
    };

    // Play sound effect if action has one mapped
    if (soundMap[action.id]) {
      play(soundMap[action.id], 0.5);
    }

    // Handle instant actions (no roll required)
    if (action.type === 'instant') {
      // Simulate brief delay for feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let logMessage = `${character.name} - ${action.name}: `;
      
      // Execute instant action effects
      if (action.id === 'hyperdriveJump') {
        chargeHyperdrive();
        logMessage += `Hyperdrive charged (${spaceCombat.hyperdriveCharge + 1}/3)!`;
      }
      
      addCombatLog(logMessage, action.type);
      setRollingAction(null);
      return;
    }

    // Simulate rolling delay for actions that require rolls
    await new Promise(resolve => setTimeout(resolve, 600));

    // Get action modifiers
    const modifier = getActionModifier(action.id);
    const effectiveDR = action.dr + modifier.drAdjust;
    const abilityScore = getAbilityScore(action.ability);

    // Use rollTest with advantage/disadvantage support
    const testResult = rollTest(
      abilityScore,
      effectiveDR,
      modifier.rollMode === 'advantage',
      modifier.rollMode === 'disadvantage'
    );

    const { roll: d20Roll, total, success, crit, blunder } = testResult;

    let logMessage = `${character.name} - ${action.name}: `;
    let logType = action.type;
    let logData = {
      rollMode: modifier.rollMode,
      drAdjust: modifier.drAdjust,
      baseDR: action.dr,
      effectiveDR: effectiveDR
    };

    // Handle crit/blunder
    if (crit) {
      logMessage += `CRITICAL! (20 + ${abilityScore} = ${total})`;
      logType = 'attack';
    } else if (blunder) {
      logMessage += `BLUNDER! (1 + ${abilityScore} = ${total})`;
      logType = 'damage';
      // Reduce armor on blunder for defense actions
      if (action.type === 'defense') {
        modifyArmor(-1);
        logMessage += ' - Shield degraded!';
      }
    } else {
      // Build roll display with advantage/disadvantage info
      let rollDisplay = '';
      if (modifier.rollMode === 'advantage' || modifier.rollMode === 'disadvantage') {
        rollDisplay = `[ADV/DIS: ${d20Roll}]`;
      } else {
        rollDisplay = `${d20Roll}`;
      }
      
      // Build DR display with adjustment info
      let drDisplay = `DR${effectiveDR}`;
      if (modifier.drAdjust !== 0) {
        drDisplay += ` (base ${action.dr} ${modifier.drAdjust > 0 ? '+' : ''}${modifier.drAdjust})`;
      }
      
      logMessage += `${success ? 'SUCCESS' : 'FAIL'} (${rollDisplay} + ${abilityScore} = ${total} vs ${drDisplay})`;
    }

    // Handle damage rolls for attacks
    if (success && action.damage) {
      const damageDiceMatch = action.damage.match(/(\d+)d(\d+)/);
      if (damageDiceMatch) {
        const [, count, sides] = damageDiceMatch;
        let damageTotal = 0;
        for (let i = 0; i < parseInt(count); i++) {
          damageTotal += rollDice(parseInt(sides));
        }
        logMessage += ` - Dealt ${damageTotal} damage!`;
        
        // Use torpedo if required
        if (action.requiresTorpedo) {
          fireTorpedo();
        }
      }
    }

    // Handle special effects
    if (success) {
      if (action.id === 'repairShield') {
        const maxTier = getMaxArmorTier(ship);
        modifyArmor(1);
        logMessage += ` - Shield repaired! (Max tier: ${maxTier})`;
      } else if (action.id === 'loadTorpedo') {
        const torpedoCount = rollD(2);
        loadTorpedoes(torpedoCount);
        logMessage += ` - Loaded ${torpedoCount} torpedo${torpedoCount > 1 ? 'es' : ''}!`;
      } else if (action.id === 'fireTorpedo' && selectedTorpedoType !== 'standard') {
        // Use special torpedo from inventory
        updateGameState((prevState) => {
          const newShip = { ...prevState.ship };
          newShip.torpedoInventory = {
            ...newShip.torpedoInventory,
            [selectedTorpedoType]: Math.max(0, (newShip.torpedoInventory[selectedTorpedoType] || 0) - 1),
          };
          return { ...prevState, ship: newShip };
        });
        const torpedoName = TORPEDO_TYPES[selectedTorpedoType].name;
        logMessage += ` - Used ${torpedoName}!`;
      }
    }

    addCombatLog(logMessage, logType, logData);
    setRollingAction(null);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 font-orbitron uppercase mb-2">
        Available Actions:
      </p>
      
      {/* Torpedo Type Selector for Fire Torpedo action */}
      {actions.some(a => a.id === 'fireTorpedo') && spaceCombat.torpedoesLoaded > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 font-orbitron uppercase mb-1">
            Select Torpedo:
          </p>
          <TorpedoSelector 
            selectedType={selectedTorpedoType}
            onSelect={setSelectedTorpedoType}
          />
        </div>
      )}
      
      {actions.map((action, btnIndex) => {
        const Icon = ACTION_ICONS[action.type] || Dices;
        const isRolling = rollingAction === action.id;
        const isDisabled = action.requiresTorpedo && spaceCombat.torpedoesLoaded === 0;
        const modifier = getActionModifier(action.id);
        const isExpanded = expandedActionId === action.id;
        const effectiveDR = action.dr + modifier.drAdjust;

        return (
          <div key={`${stationId}-${action.id}-${btnIndex}`} className="space-y-1">
            <div
              className={`w-full p-2 border-2 transition-all ${
                isRolling
                  ? 'border-accent-yellow bg-accent-yellow/20'
                  : isDisabled
                  ? 'border-gray-700 bg-gray-900/50 opacity-50'
                  : modifier.rollMode === 'advantage'
                  ? 'border-accent-yellow/50 bg-accent-yellow/5'
                  : modifier.rollMode === 'disadvantage'
                  ? 'border-accent-red/50 bg-accent-red/5'
                  : action.type === 'attack'
                  ? 'border-accent-red/30 hover:border-accent-red hover:bg-accent-red/10'
                  : action.type === 'defense'
                  ? 'border-accent-cyan/30 hover:border-accent-cyan hover:bg-accent-cyan/10'
                  : 'border-accent-yellow/30 hover:border-accent-yellow hover:bg-accent-yellow/10'
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                  isRolling ? 'animate-spin' : ''
                } ${
                  action.type === 'attack' ? 'text-accent-red' :
                  action.type === 'defense' ? 'text-accent-cyan' :
                  'text-accent-yellow'
                }`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-orbitron font-bold text-text-primary">
                      {action.name}
                    </p>
                    {action.type !== 'instant' && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-orbitron text-gray-400">
                          {action.ability} DR{effectiveDR}
                          {modifier.drAdjust !== 0 && (
                            <span className="text-accent-yellow ml-1">
                              ({modifier.drAdjust > 0 ? '+' : ''}{modifier.drAdjust})
                            </span>
                          )}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModifierControls(action.id);
                          }}
                          className="p-0.5 text-gray-500 hover:text-accent-cyan transition-colors"
                          title="Toggle modifiers"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-400">
                    {action.description}
                  </p>
                  
                  {action.damage && (
                    <p className="text-xs text-accent-red font-orbitron mt-1">
                      Damage: {action.damage}
                    </p>
                  )}
                  
                  {isDisabled && (
                    <p className="text-xs text-accent-red font-orbitron mt-1">
                      No torpedoes loaded!
                    </p>
                  )}
                  
                  {action.warning && (
                    <p className="text-xs text-accent-yellow font-orbitron mt-1">
                      ⚠ {action.warning}
                    </p>
                  )}
                </div>
              </div>

              {/* Roll Button */}
              <button
                onClick={() => performAction(action)}
                disabled={isRolling || isDisabled || !character}
                className={`w-full mt-2 px-2 py-1 text-xs font-orbitron font-bold uppercase border transition-all ${
                  isRolling || isDisabled || !character
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-accent-cyan hover:text-bg-primary'
                } ${
                  action.type === 'attack'
                    ? 'border-accent-red text-accent-red hover:bg-accent-red'
                    : action.type === 'defense'
                    ? 'border-accent-cyan text-accent-cyan'
                    : 'border-accent-yellow text-accent-yellow hover:bg-accent-yellow'
                }`}
              >
                {isRolling ? (action.type === 'instant' ? 'Executing...' : 'Rolling...') : (action.type === 'instant' ? 'Execute Action' : 'Roll Action')}
              </button>
            </div>

            {/* Modifier Controls - Collapsible (only for actions with rolls) */}
            {isExpanded && action.type !== 'instant' && (
              <div className="bg-bg-secondary/50 border border-accent-cyan/20 p-2 space-y-2">
                {/* Roll Mode Toggle */}
                <div>
                  <p className="text-xs text-gray-500 font-orbitron uppercase mb-1">
                    Roll Mode:
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateActionModifier(action.id, { rollMode: 'normal' })}
                      className={`flex-1 px-2 py-1 font-orbitron font-bold uppercase text-xs border transition-all ${
                        modifier.rollMode === 'normal'
                          ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
                          : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan/20'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => updateActionModifier(action.id, { rollMode: 'advantage' })}
                      className={`flex-1 px-2 py-1 font-orbitron font-bold uppercase text-xs border transition-all ${
                        modifier.rollMode === 'advantage'
                          ? 'bg-accent-yellow text-bg-primary border-accent-yellow'
                          : 'bg-transparent text-accent-yellow border-accent-yellow hover:bg-accent-yellow/20'
                      }`}
                    >
                      ADV
                    </button>
                    <button
                      onClick={() => updateActionModifier(action.id, { rollMode: 'disadvantage' })}
                      className={`flex-1 px-2 py-1 font-orbitron font-bold uppercase text-xs border transition-all ${
                        modifier.rollMode === 'disadvantage'
                          ? 'bg-accent-red text-bg-primary border-accent-red'
                          : 'bg-transparent text-accent-red border-accent-red hover:bg-accent-red/20'
                      }`}
                    >
                      DIS
                    </button>
                  </div>
                </div>

                {/* DR Adjustment */}
                <div>
                  <p className="text-xs text-gray-500 font-orbitron uppercase mb-1">
                    DR Adjustment:
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateActionModifier(action.id, { drAdjust: Math.max(-4, modifier.drAdjust - 1) })}
                      disabled={modifier.drAdjust <= -4}
                      className="px-2 py-1 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <div className="flex-1 text-center">
                      <div className="text-sm font-orbitron font-bold text-accent-cyan">
                        DR {effectiveDR}
                      </div>
                      <div className="text-xs text-gray-500 font-orbitron">
                        (Base: {action.dr})
                      </div>
                    </div>
                    <button
                      onClick={() => updateActionModifier(action.id, { drAdjust: Math.min(4, modifier.drAdjust + 1) })}
                      disabled={modifier.drAdjust >= 4}
                      className="px-2 py-1 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {modifier.drAdjust !== 0 && (
                    <button
                      onClick={() => updateActionModifier(action.id, { drAdjust: 0 })}
                      className="w-full mt-1 px-2 py-1 text-xs font-orbitron text-gray-400 border border-gray-600 hover:border-accent-cyan hover:text-accent-cyan transition-all"
                    >
                      Reset to Base DR
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

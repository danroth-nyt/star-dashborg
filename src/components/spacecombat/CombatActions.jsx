import { useState } from 'react';
import { Dices, Target, Shield, Wrench, Zap } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useParty } from '../../context/PartyContext';
import { useGame } from '../../context/GameContext';
import { ACTIONS } from '../../data/spaceCombatData';
import { TORPEDO_TYPES } from '../../data/shipShopData';
import { rollDice } from '../../utils/dice';
import { getMaxArmorTier, getGunnerDamage, canAnyStationLoadTorpedoes, hasUpgrade } from '../../utils/shipUpgrades';
import TorpedoSelector from './TorpedoSelector';

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
  const [rollingAction, setRollingAction] = useState(null);
  const [selectedTorpedoType, setSelectedTorpedoType] = useState('standard');

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
    if (!character || !character.abilities) return 0;
    return character.abilities[ability.toLowerCase()] || 0;
  };

  const performAction = async (action) => {
    if (!character) return;
    
    // Check special requirements
    if (action.requiresTorpedo && spaceCombat.torpedoesLoaded === 0) {
      addCombatLog(`${action.name} failed: No torpedoes loaded!`, 'damage');
      return;
    }

    setRollingAction(action.id);

    // Simulate rolling delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Roll d20
    const d20Roll = rollDice(20);
    const abilityScore = getAbilityScore(action.ability);
    const total = d20Roll + abilityScore;
    const success = total >= action.dr;

    let logMessage = `${character.name} - ${action.name}: `;
    let logType = action.type;

    // Handle crit/blunder
    if (d20Roll === 20) {
      logMessage += `CRITICAL! (20 + ${abilityScore} = ${total})`;
      logType = 'attack';
    } else if (d20Roll === 1) {
      logMessage += `BLUNDER! (1 + ${abilityScore} = ${total})`;
      logType = 'damage';
      // Reduce armor on blunder for defense actions
      if (action.type === 'defense') {
        modifyArmor(-1);
        logMessage += ' - Shield degraded!';
      }
    } else {
      logMessage += `${success ? 'SUCCESS' : 'FAIL'} (${d20Roll} + ${abilityScore} = ${total} vs DR${action.dr})`;
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
        const torpedoCount = rollDice(2);
        loadTorpedoes(torpedoCount);
        logMessage += ` - Loaded ${torpedoCount} torpedo${torpedoCount > 1 ? 'es' : ''}!`;
      } else if (action.id === 'hyperdriveJump') {
        chargeHyperdrive();
        logMessage += ` - Hyperdrive charged (${spaceCombat.hyperdriveCharge + 1}/3)!`;
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

    addCombatLog(logMessage, logType);
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
      
      {actions.map(action => {
        const Icon = ACTION_ICONS[action.type] || Dices;
        const isRolling = rollingAction === action.id;
        const isDisabled = action.requiresTorpedo && spaceCombat.torpedoesLoaded === 0;

        return (
          <button
            key={action.id}
            onClick={() => performAction(action)}
            disabled={isRolling || isDisabled || !character}
            className={`w-full p-2 border-2 text-left transition-all group ${
              isRolling
                ? 'border-accent-yellow bg-accent-yellow/20 cursor-wait'
                : isDisabled
                ? 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
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
                  <span className="text-xs font-orbitron text-gray-400">
                    {action.ability} DR{action.dr}
                  </span>
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
          </button>
        );
      })}
    </div>
  );
}

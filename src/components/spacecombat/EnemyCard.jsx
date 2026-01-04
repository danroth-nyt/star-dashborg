import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Crosshair, 
  Shield, 
  Skull, 
  Swords,
  Dice5,
  ArrowRight,
  Flag,
  Trash2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { ENEMY_ARMOR_TIERS, ENEMY_STATUS, FIGHTER_BUILDS } from '../../data/enemyShipData';

// Status badge component
function StatusBadge({ status }) {
  const statusConfig = ENEMY_STATUS[status] || ENEMY_STATUS.active;
  
  const colorClasses = {
    active: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan',
    fleeing: 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow',
    surrendered: 'bg-gray-500/20 text-gray-400 border-gray-500',
    destroyed: 'bg-accent-red/20 text-accent-red border-accent-red',
  };
  
  const icons = {
    active: Crosshair,
    fleeing: ArrowRight,
    surrendered: Flag,
    destroyed: Skull,
  };
  
  const Icon = icons[status] || Crosshair;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-orbitron uppercase border rounded ${colorClasses[status]}`}>
      <Icon className="w-3 h-3" />
      {statusConfig.label}
    </span>
  );
}

export default function EnemyCard({ enemy, onRemove }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastAttackResult, setLastAttackResult] = useState(null);
  const [lastMoraleResult, setLastMoraleResult] = useState(null);
  const { 
    updateEnemy, 
    applyDamageToEnemy, 
    rollEnemyAttack, 
    rollEnemyMorale,
    adjustEnemyHp 
  } = useSpaceCombat();
  const { play } = useSoundEffects();
  
  const hpPercent = enemy.hp.max ? (enemy.hp.current / enemy.hp.max) * 100 : 0;
  const isInactive = enemy.status !== 'active';
  const armorInfo = ENEMY_ARMOR_TIERS[enemy.armor] || ENEMY_ARMOR_TIERS[0];
  
  // Find build info if present
  const buildInfo = enemy.build ? FIGHTER_BUILDS[enemy.build] : null;
  
  // HP bar color
  const getHpColor = () => {
    if (enemy.status === 'destroyed') return 'bg-gray-600';
    if (hpPercent > 66) return 'bg-accent-cyan';
    if (hpPercent > 33) return 'bg-accent-yellow';
    return 'bg-accent-red';
  };
  
  // Handle attack roll
  const handleAttack = () => {
    const result = rollEnemyAttack(enemy.id);
    if (result) {
      setLastAttackResult(result);
      play('enemyAttack', 0.5);
      // Clear result after 3 seconds
      setTimeout(() => setLastAttackResult(null), 3000);
    }
  };
  
  // Handle morale check
  const handleMoraleCheck = () => {
    const result = rollEnemyMorale(enemy.id);
    if (result) {
      setLastMoraleResult(result);
      if (result.demoralized) {
        if (result.outcome === 'flees') {
          play('enemyFlee', 0.5);
        } else {
          play('alarmCritical', 0.3);
        }
      }
      // Clear result after 4 seconds
      setTimeout(() => setLastMoraleResult(null), 4000);
    }
  };
  
  // Toggle status manually
  const toggleStatus = (newStatus) => {
    updateEnemy(enemy.id, { status: newStatus });
  };

  return (
    <div className={`border-2 rounded transition-all ${
      enemy.status === 'destroyed' 
        ? 'border-gray-700 bg-gray-900/50 opacity-60' 
        : enemy.status === 'fleeing'
        ? 'border-accent-yellow/50 bg-accent-yellow/5'
        : enemy.status === 'surrendered'
        ? 'border-gray-600 bg-gray-800/30'
        : 'border-accent-red/50 bg-bg-secondary/80'
    }`}>
      {/* Header - Always visible */}
      <div 
        className="flex items-center gap-2 p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse */}
        <button className="text-gray-400">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {/* Name & Type */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-orbitron font-bold text-sm truncate ${
            isInactive ? 'text-gray-500' : 'text-text-primary'
          }`}>
            {enemy.name}
          </h4>
          {buildInfo && (
            <p className="text-[10px] text-accent-yellow font-mono truncate">
              {buildInfo.name}
            </p>
          )}
        </div>
        
        {/* Status Badge */}
        <StatusBadge status={enemy.status} />
        
        {/* HP Display */}
        <div className="flex items-center gap-2">
          <div className="w-20 h-3 bg-gray-800 rounded overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getHpColor()}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono text-gray-400 w-12 text-right">
            {enemy.hp.current}/{enemy.hp.max}
          </span>
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-700 p-3 space-y-3">
          {/* Stats Row */}
          <div className="flex flex-wrap gap-3 text-xs">
            {/* Armor */}
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-accent-cyan" />
              <span className="text-gray-400">Armor:</span>
              <span className="text-text-primary font-mono">{armorInfo.label}</span>
            </div>
            
            {/* Weapon */}
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-accent-yellow" />
              <span className="text-gray-400">Weapon:</span>
              <span className="text-text-primary font-mono">
                {enemy.weapon.name} ({enemy.weapon.damage})
              </span>
            </div>
            
            {/* Morale */}
            {enemy.morale !== null && (
              <div className="flex items-center gap-1">
                <Dice5 className="w-3 h-3 text-accent-red" />
                <span className="text-gray-400">MRL:</span>
                <span className="text-text-primary font-mono">{enemy.morale}</span>
              </div>
            )}
            
            {/* DR */}
            <div className="flex items-center gap-1">
              <span className="text-gray-400">DR:</span>
              <span className={`font-mono ${enemy.dr === 14 ? 'text-accent-red' : 'text-text-primary'}`}>
                {enemy.dr}
              </span>
            </div>
          </div>
          
          {/* Traits */}
          {enemy.traits && enemy.traits.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {enemy.traits.map((trait, i) => (
                <span 
                  key={i}
                  className="px-2 py-0.5 text-[10px] font-mono bg-gray-800 text-gray-300 rounded"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}
          
          {/* Build Effect */}
          {buildInfo && (
            <div className="text-xs text-accent-yellow bg-accent-yellow/10 p-2 rounded border border-accent-yellow/30">
              <span className="font-bold">{buildInfo.name}:</span> {buildInfo.effect}
            </div>
          )}
          
          {/* HP Adjustment */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">HP:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjustEnemyHp(enemy.id, -5)}
                className="px-2 py-1 text-xs bg-accent-red/20 text-accent-red border border-accent-red rounded hover:bg-accent-red hover:text-bg-primary transition-colors"
              >
                -5
              </button>
              <button
                onClick={() => adjustEnemyHp(enemy.id, -1)}
                className="px-2 py-1 text-xs bg-accent-red/20 text-accent-red border border-accent-red rounded hover:bg-accent-red hover:text-bg-primary transition-colors"
              >
                -1
              </button>
              <span className="px-3 py-1 text-sm font-mono bg-gray-800 rounded min-w-[60px] text-center">
                {enemy.hp.current}
              </span>
              <button
                onClick={() => adjustEnemyHp(enemy.id, 1)}
                className="px-2 py-1 text-xs bg-accent-cyan/20 text-accent-cyan border border-accent-cyan rounded hover:bg-accent-cyan hover:text-bg-primary transition-colors"
              >
                +1
              </button>
              <button
                onClick={() => adjustEnemyHp(enemy.id, 5)}
                className="px-2 py-1 text-xs bg-accent-cyan/20 text-accent-cyan border border-accent-cyan rounded hover:bg-accent-cyan hover:text-bg-primary transition-colors"
              >
                +5
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          {!isInactive && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAttack}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-orbitron bg-accent-red/20 text-accent-red border border-accent-red rounded hover:bg-accent-red hover:text-bg-primary transition-colors"
              >
                <Swords className="w-3 h-3" />
                Attack
              </button>
              
              {enemy.morale !== null && (
                <button
                  onClick={handleMoraleCheck}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-orbitron bg-accent-yellow/20 text-accent-yellow border border-accent-yellow rounded hover:bg-accent-yellow hover:text-bg-primary transition-colors"
                >
                  <Dice5 className="w-3 h-3" />
                  Morale
                </button>
              )}
            </div>
          )}
          
          {/* Attack Result */}
          {lastAttackResult && (
            <div className="bg-accent-red/10 border border-accent-red/30 p-2 rounded">
              <p className="text-xs text-accent-red font-mono">
                <span className="font-bold">{enemy.weapon.name}:</span>{' '}
                {lastAttackResult.advantage 
                  ? `[${lastAttackResult.rolls.map(r => `${r.roll1}/${r.roll2}→${r.best}`).join(', ')}]`
                  : `[${lastAttackResult.rolls.join(', ')}]`
                } = <span className="text-lg font-bold">{lastAttackResult.total}</span> damage
              </p>
            </div>
          )}
          
          {/* Morale Result */}
          {lastMoraleResult && (
            <div className={`p-2 rounded border ${
              lastMoraleResult.demoralized 
                ? 'bg-accent-yellow/10 border-accent-yellow/30' 
                : 'bg-accent-cyan/10 border-accent-cyan/30'
            }`}>
              <p className={`text-xs font-mono ${
                lastMoraleResult.demoralized ? 'text-accent-yellow' : 'text-accent-cyan'
              }`}>
                Morale: [{lastMoraleResult.dice.join(', ')}] = {lastMoraleResult.total} vs MRL {lastMoraleResult.morale}
                {lastMoraleResult.demoralized ? (
                  <span className="font-bold ml-2">
                    {lastMoraleResult.outcome === 'flees' ? '→ FLEES!' : '→ SURRENDERS!'}
                  </span>
                ) : (
                  <span className="ml-2">→ Holds!</span>
                )}
              </p>
            </div>
          )}
          
          {/* Status Toggle */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
            <span className="text-xs text-gray-400">Set Status:</span>
            <div className="flex gap-1">
              {Object.keys(ENEMY_STATUS).map((statusKey) => (
                <button
                  key={statusKey}
                  onClick={() => toggleStatus(statusKey)}
                  className={`px-2 py-1 text-[10px] rounded border transition-colors ${
                    enemy.status === statusKey
                      ? 'bg-gray-600 text-white border-gray-500'
                      : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {ENEMY_STATUS[statusKey].label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Delete Button */}
          <div className="pt-2 border-t border-gray-700">
            <button
              onClick={() => onRemove(enemy.id)}
              className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 hover:text-accent-red transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

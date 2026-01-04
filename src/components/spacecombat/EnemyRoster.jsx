import { useState } from 'react';
import { AlertTriangle, Plus, Minus, Settings, Skull, ArrowRight, Flag, Crosshair } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { ENEMY_STATUS } from '../../data/enemyShipData';

// Status icon component
function StatusIcon({ status, size = 'w-3 h-3' }) {
  switch (status) {
    case 'destroyed':
      return <Skull className={`${size} text-accent-red`} />;
    case 'fleeing':
      return <ArrowRight className={`${size} text-accent-yellow`} />;
    case 'surrendered':
      return <Flag className={`${size} text-gray-400`} />;
    default:
      return <Crosshair className={`${size} text-accent-cyan`} />;
  }
}

// Single enemy row in the compact roster
function EnemyRow({ enemy, onAdjustHp }) {
  const isInfiniteHp = enemy.hp.max === null || enemy.hp.max === undefined;
  const hpPercent = isInfiniteHp ? 100 : (enemy.hp.max ? (enemy.hp.current / enemy.hp.max) * 100 : 0);
  const isInactive = enemy.status !== 'active';
  
  // HP bar color based on percentage
  const getHpColor = () => {
    if (enemy.status === 'destroyed') return 'bg-gray-600';
    if (isInfiniteHp) return 'bg-purple-500'; // Special color for infinite HP
    if (hpPercent > 66) return 'bg-accent-cyan';
    if (hpPercent > 33) return 'bg-accent-yellow';
    return 'bg-accent-red';
  };

  return (
    <div 
      className={`flex items-center gap-2 py-1.5 px-2 border-b border-gray-700/50 last:border-b-0 transition-opacity ${
        isInactive ? 'opacity-50' : ''
      }`}
    >
      {/* Status Icon */}
      <StatusIcon status={enemy.status} />
      
      {/* Name (truncated) */}
      <span 
        className={`flex-1 text-xs font-mono truncate ${
          isInactive ? 'text-gray-500 line-through' : 'text-text-primary'
        }`}
        title={enemy.name}
      >
        {enemy.name}
      </span>
      
      {/* HP Bar */}
      <div className="w-16 h-2 bg-gray-800 rounded-sm overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getHpColor()}`}
          style={{ width: `${hpPercent}%` }}
        />
      </div>
      
      {/* HP Text */}
      <span className={`text-[10px] font-mono w-10 text-right ${
        isInactive ? 'text-gray-600' : isInfiniteHp ? 'text-purple-400' : 'text-gray-400'
      }`}>
        {isInfiniteHp ? '∞' : `${enemy.hp.current}/${enemy.hp.max}`}
      </span>
      
      {/* Quick Adjust Buttons */}
      {!isInactive && !isInfiniteHp && (
        <div className="flex gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdjustHp(enemy.id, -1);
            }}
            className="p-0.5 text-accent-red hover:bg-accent-red/20 rounded transition-colors"
            title="Decrease HP"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdjustHp(enemy.id, 1);
            }}
            className="p-0.5 text-accent-cyan hover:bg-accent-cyan/20 rounded transition-colors"
            title="Increase HP"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// Grouped enemies row (when 4+ of same type)
function GroupedEnemyRow({ type, enemies, onExpandGroup }) {
  const activeCount = enemies.filter(e => e.status === 'active').length;
  const totalHp = enemies.reduce((sum, e) => sum + e.hp.current, 0);
  const maxHp = enemies.reduce((sum, e) => sum + e.hp.max, 0);
  const hpPercent = maxHp ? (totalHp / maxHp) * 100 : 0;
  
  return (
    <button
      onClick={onExpandGroup}
      className="w-full flex items-center gap-2 py-1.5 px-2 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-700/30 transition-colors"
    >
      <Crosshair className="w-3 h-3 text-accent-cyan" />
      
      <span className="flex-1 text-xs font-mono truncate text-text-primary">
        {enemies[0]?.name?.replace(/\s[α-ω]$/, '')} ×{enemies.length}
      </span>
      
      <span className="text-[10px] text-gray-400 font-mono">
        {activeCount} active
      </span>
      
      <div className="w-12 h-2 bg-gray-800 rounded-sm overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            hpPercent > 66 ? 'bg-accent-cyan' : hpPercent > 33 ? 'bg-accent-yellow' : 'bg-accent-red'
          }`}
          style={{ width: `${hpPercent}%` }}
        />
      </div>
    </button>
  );
}

export default function EnemyRoster({ onOpenDrawer }) {
  const { spaceCombat, adjustEnemyHp, getActiveEnemyCount } = useSpaceCombat();
  const enemies = spaceCombat.enemies || [];
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  
  const activeCount = getActiveEnemyCount();
  
  // Group enemies by type
  const groupedByType = enemies.reduce((acc, enemy) => {
    if (!acc[enemy.type]) {
      acc[enemy.type] = [];
    }
    acc[enemy.type].push(enemy);
    return acc;
  }, {});
  
  // Determine which groups should be collapsed (4+ of same type)
  const shouldCollapse = (type) => {
    return groupedByType[type]?.length >= 4 && !expandedGroups.has(type);
  };
  
  const toggleGroup = (type) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };
  
  // Build display list
  const displayItems = [];
  const processedTypes = new Set();
  
  enemies.forEach((enemy) => {
    if (processedTypes.has(enemy.type)) return;
    
    if (shouldCollapse(enemy.type)) {
      displayItems.push({
        type: 'group',
        enemyType: enemy.type,
        enemies: groupedByType[enemy.type],
      });
      processedTypes.add(enemy.type);
    } else {
      // Show individual enemies of this type
      groupedByType[enemy.type].forEach(e => {
        displayItems.push({ type: 'enemy', enemy: e });
      });
      processedTypes.add(enemy.type);
    }
  });

  return (
    <div className={`bg-bg-secondary/80 backdrop-blur-sm border-3 ${
      enemies.length > 0 ? 'border-accent-red' : 'border-gray-700'
    } transition-colors`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {enemies.length > 0 && (
            <AlertTriangle className="w-4 h-4 text-accent-red" />
          )}
          <span className="text-xs font-orbitron font-bold uppercase text-accent-red">
            Enemy Forces
          </span>
          {enemies.length > 0 && (
            <span className="text-xs font-mono text-gray-400">
              ({activeCount} active)
            </span>
          )}
        </div>
        
        <button
          onClick={onOpenDrawer}
          className="p-1 text-gray-400 hover:text-accent-cyan transition-colors rounded border border-transparent hover:border-accent-cyan"
          title="Manage enemies"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
      
      {/* Enemy List */}
      {enemies.length === 0 ? (
        <div className="px-3 py-4 text-center">
          <p className="text-xs text-gray-500 mb-2">No enemies</p>
          <button
            onClick={onOpenDrawer}
            className="text-xs text-accent-cyan hover:underline flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Spawn enemies
          </button>
        </div>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          {displayItems.map((item, index) => {
            if (item.type === 'group') {
              return (
                <GroupedEnemyRow
                  key={`group-${item.enemyType}`}
                  type={item.enemyType}
                  enemies={item.enemies}
                  onExpandGroup={() => toggleGroup(item.enemyType)}
                />
              );
            }
            return (
              <EnemyRow
                key={item.enemy.id}
                enemy={item.enemy}
                onAdjustHp={adjustEnemyHp}
              />
            );
          })}
        </div>
      )}
      
      {/* Hyperdrive Warning */}
      {activeCount >= 4 && (
        <div className="px-3 py-2 bg-accent-red/10 border-t border-accent-red/30">
          <p className="text-[10px] text-accent-red font-orbitron text-center">
            ⚠️ 4+ enemies - Hyperdrive jump will destroy ship!
          </p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Plus, Dices, Shuffle, Ship, Sparkles } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { 
  ENEMY_SHIPS, 
  FIGHTER_BUILDS,
  FIGHTER_BUILDS_ARRAY,
  createEnemy, 
  createEnemySquad,
  rollFighterBuild,
  GREEK_LETTERS
} from '../../data/enemyShipData';

// Ship type selector button
function ShipTypeButton({ ship, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 text-left border-2 rounded transition-all ${
        isSelected
          ? 'border-accent-cyan bg-accent-cyan/10'
          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
      }`}
    >
      <h4 className="font-orbitron text-sm font-bold text-text-primary">
        {ship.name}
      </h4>
      <div className="flex gap-3 mt-1 text-[10px] font-mono text-gray-400">
        <span>HP: {ship.hp || '∞'}</span>
        <span>MRL: {ship.morale || '-'}</span>
        <span>ARM: {ship.armor || 0}</span>
      </div>
      <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
        {ship.description}
      </p>
    </button>
  );
}

// Build variation option
function BuildOption({ build, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-left border rounded transition-all ${
        isSelected
          ? 'border-accent-yellow bg-accent-yellow/10'
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-accent-yellow font-mono text-xs">d6={build.roll}</span>
        <span className="font-orbitron text-xs font-bold text-text-primary">
          {build.name}
        </span>
      </div>
      <p className="text-[10px] text-gray-400 mt-1">
        {build.effect}
      </p>
    </button>
  );
}

export default function EnemyGenerator() {
  const { addEnemy, addEnemies } = useSpaceCombat();
  const { play } = useSoundEffects();
  
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [lastRolledBuild, setLastRolledBuild] = useState(null);
  const [isRollingBuild, setIsRollingBuild] = useState(false);
  const [rollingDisplay, setRollingDisplay] = useState(null);
  
  const shipTypes = Object.values(ENEMY_SHIPS);
  
  // Quick spawn a single enemy
  const handleQuickSpawn = (shipType) => {
    const enemy = createEnemy(shipType);
    addEnemy(enemy);
    
    // Play specific sound for dreadnought
    if (shipType === 'dreadnought') {
      play('dreadnoughtSpawn', 0.7);
    } else {
      play('enemySpawn', 0.6);
    }
  };
  
  // Spawn with selected options
  const handleSpawn = () => {
    if (!selectedType) return;
    
    if (quantity === 1) {
      const enemy = createEnemy(selectedType, { build: selectedBuild });
      addEnemy(enemy);
    } else {
      const squad = createEnemySquad(selectedType, quantity, { build: selectedBuild });
      addEnemies(squad);
    }
    
    // Play specific sound for dreadnought
    if (selectedType === 'dreadnought') {
      play('dreadnoughtSpawn', 0.7);
    } else {
      play('enemySpawn', 0.6);
    }
    
    // Reset selections
    setSelectedType(null);
    setSelectedBuild(null);
    setQuantity(1);
    setLastRolledBuild(null);
  };
  
  // Roll random build with animation
  const handleRollBuild = () => {
    if (isRollingBuild) return;
    
    setIsRollingBuild(true);
    setLastRolledBuild(null);
    
    // Animate through random builds
    let count = 0;
    const maxCycles = 12;
    const interval = setInterval(() => {
      const randomBuild = FIGHTER_BUILDS_ARRAY[Math.floor(Math.random() * FIGHTER_BUILDS_ARRAY.length)];
      setRollingDisplay(randomBuild);
      count++;
      
      if (count >= maxCycles) {
        clearInterval(interval);
        // Final roll
        const finalBuild = rollFighterBuild();
        setRollingDisplay(null);
        setSelectedBuild(finalBuild.id);
        setLastRolledBuild(finalBuild);
        setIsRollingBuild(false);
        play('targetLock', 0.4);
      }
    }, 80);
  };
  
  // Spawn fighter with random build in one click
  const handleSpawnFighterWithRandomBuild = () => {
    const build = rollFighterBuild();
    const enemy = createEnemy('hunterFighter', { build: build.id });
    addEnemy(enemy);
    play('enemySpawn', 0.6);
    
    // Flash the result
    setLastRolledBuild(build);
    setTimeout(() => setLastRolledBuild(null), 2000);
  };
  
  // Fully random spawn
  const handleRandomSpawn = () => {
    // Random ship type (weighted toward common enemies)
    const weights = {
      hunterFighter: 50,
      predatorLeader: 25,
      pirateMarauder: 20,
      dreadnought: 5,
    };
    
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let random = Math.floor(Math.random() * total);
    let selectedShip = 'hunterFighter';
    
    for (const [type, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        selectedShip = type;
        break;
      }
    }
    
    // 50% chance of random build for fighters
    const build = selectedShip === 'hunterFighter' && Math.random() > 0.5 
      ? rollFighterBuild().id 
      : null;
    
    // Random quantity 1-3 for fighters, 1 for others
    const count = selectedShip === 'hunterFighter' 
      ? Math.floor(Math.random() * 3) + 1 
      : 1;
    
    if (count === 1) {
      const enemy = createEnemy(selectedShip, { build });
      addEnemy(enemy);
    } else {
      const squad = createEnemySquad(selectedShip, count, { build });
      addEnemies(squad);
    }
    
    // Play specific sound for dreadnought
    if (selectedShip === 'dreadnought') {
      play('dreadnoughtSpawn', 0.7);
    } else {
      play('enemySpawn', 0.6);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-xs font-orbitron text-gray-400 uppercase">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRandomSpawn}
            className="flex items-center gap-1 px-3 py-2 text-xs font-orbitron bg-accent-cyan/20 text-accent-cyan border border-accent-cyan rounded hover:bg-accent-cyan hover:text-bg-primary transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Random Enemy
          </button>
          
          {/* Fighter with random build */}
          <button
            onClick={handleSpawnFighterWithRandomBuild}
            className="flex items-center gap-1 px-3 py-2 text-xs font-orbitron bg-accent-yellow/20 text-accent-yellow border border-accent-yellow rounded hover:bg-accent-yellow hover:text-bg-primary transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Fighter + Build
          </button>
          
          {/* Quick spawn buttons for each type */}
          {shipTypes.slice(0, 2).map((ship) => (
            <button
              key={ship.id}
              onClick={() => handleQuickSpawn(ship.id)}
              className="flex items-center gap-1 px-3 py-2 text-xs font-orbitron bg-gray-700 text-gray-300 border border-gray-600 rounded hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-3 h-3" />
              {ship.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Ship Type Selection */}
      <div className="space-y-2">
        <h3 className="text-xs font-orbitron text-gray-400 uppercase">Select Ship Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {shipTypes.map((ship) => (
            <ShipTypeButton
              key={ship.id}
              ship={ship}
              isSelected={selectedType === ship.id}
              onClick={() => setSelectedType(ship.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Build Variation (for fighters) */}
      {selectedType === 'hunterFighter' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-orbitron text-gray-400 uppercase">
              Fighter Build Oracle
            </h3>
          </div>
          
          {/* Big Roll Button */}
          <button
            onClick={handleRollBuild}
            disabled={isRollingBuild}
            className={`w-full flex items-center justify-center gap-3 p-4 border-2 rounded transition-all ${
              isRollingBuild
                ? 'border-accent-yellow bg-accent-yellow/20 animate-pulse'
                : 'border-accent-yellow/50 bg-accent-yellow/10 hover:border-accent-yellow hover:bg-accent-yellow/20'
            }`}
          >
            <Dices className={`w-8 h-8 text-accent-yellow ${isRollingBuild ? 'animate-spin' : ''}`} />
            <div className="text-left">
              <p className="font-orbitron font-bold text-accent-yellow">
                {isRollingBuild ? 'Rolling...' : 'Roll d6 for Build'}
              </p>
              <p className="text-[10px] text-gray-400">
                {rollingDisplay ? rollingDisplay.name : 'Click to randomly determine fighter variant'}
              </p>
            </div>
          </button>
          
          {/* Roll Result */}
          {lastRolledBuild && !isRollingBuild && (
            <div className="bg-accent-yellow/20 border-2 border-accent-yellow p-3 rounded animate-pulse">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-orbitron font-bold text-accent-yellow">
                  [{lastRolledBuild.roll}]
                </span>
                <span className="font-orbitron font-bold text-text-primary text-lg">
                  {lastRolledBuild.name}
                </span>
              </div>
              <p className="text-xs text-gray-300">{lastRolledBuild.effect}</p>
            </div>
          )}
          
          {/* Manual Selection */}
          <div className="space-y-2">
            <p className="text-[10px] text-gray-500 uppercase">Or select manually:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              <button
                onClick={() => { setSelectedBuild(null); setLastRolledBuild(null); }}
                className={`p-2 text-left border rounded transition-all ${
                  selectedBuild === null && !lastRolledBuild
                    ? 'border-gray-500 bg-gray-700/50'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="font-orbitron text-xs text-gray-400">No Build</span>
                <p className="text-[10px] text-gray-500">Standard Fighter</p>
              </button>
              
              {FIGHTER_BUILDS_ARRAY.map((build) => (
                <BuildOption
                  key={build.id}
                  build={build}
                  isSelected={selectedBuild === build.id}
                  onClick={() => { setSelectedBuild(build.id); setLastRolledBuild(build); }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Quantity Selector */}
      {selectedType && (
        <div className="space-y-2">
          <h3 className="text-xs font-orbitron text-gray-400 uppercase">Quantity</h3>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setQuantity(n)}
                className={`w-10 h-10 text-sm font-orbitron rounded border transition-all ${
                  quantity === n
                    ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {quantity > 1 && (
            <p className="text-[10px] text-gray-500">
              Will spawn: {GREEK_LETTERS.slice(0, quantity).join(', ')} variants
            </p>
          )}
        </div>
      )}
      
      {/* Spawn Button */}
      {selectedType && (
        <button
          onClick={handleSpawn}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 font-orbitron font-bold bg-accent-red text-white border-2 border-accent-red rounded hover:bg-accent-red/80 transition-colors"
        >
          <Ship className="w-5 h-5" />
          Spawn {quantity > 1 ? `${quantity}× ` : ''}{ENEMY_SHIPS[selectedType]?.name}
          {selectedBuild && ` (${FIGHTER_BUILDS[selectedBuild]?.name})`}
        </button>
      )}
      
      {/* Ship Stats Reference */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <h3 className="text-xs font-orbitron text-gray-400 uppercase mb-2">Quick Reference</h3>
        <div className="text-[10px] text-gray-500 space-y-1">
          <p><span className="text-accent-cyan">Fodder:</span> One hit always destroys (Hunter Fighter)</p>
          <p><span className="text-accent-yellow">Squadthink:</span> 4+ fighters = MRL 8 instead of 7</p>
          <p><span className="text-accent-red">Elite:</span> DR14 to defend (Predator Leader)</p>
        </div>
      </div>
    </div>
  );
}

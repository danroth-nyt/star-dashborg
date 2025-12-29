import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useGame } from '../../context/GameContext';
import { Dices, Heart, Sparkles, Coins, Maximize2, Plus, Minus } from 'lucide-react';
import { rollD20 } from '../../utils/dice';

export default function CharacterPanel({ onExpand }) {
  const { character, updateField } = useCharacter();
  const { addLog } = useGame();
  const [rollingStatId, setRollingStatId] = useState(null);

  if (!character) {
    return (
      <div className="text-center text-text-secondary text-sm font-mono p-4">
        {'>'} No character loaded
      </div>
    );
  }

  // Format modifier with +/- prefix
  const formatModifier = (value) => {
    if (value > 0) return `+${value}`;
    if (value === 0) return '0';
    return `${value}`;
  };

  // Get color class based on stat value
  const getStatColor = (value) => {
    if (value >= 2) return 'text-accent-green';
    if (value >= 1) return 'text-accent-cyan';
    if (value === 0) return 'text-text-primary';
    if (value >= -1) return 'text-accent-yellow';
    return 'text-accent-red';
  };

  // Handle stat quick roll
  const handleStatRoll = (statName, statValue) => {
    setRollingStatId(statName);
    
    setTimeout(() => {
      const d20Roll = rollD20();
      const total = d20Roll + statValue;
      const isCrit = d20Roll === 20;
      const isBlunder = d20Roll === 1;
      
      let resultText = `${statName.toUpperCase()} Test: [${d20Roll}] ${formatModifier(statValue)} = ${total}`;
      
      if (isCrit) {
        resultText += ' ★ CRITICAL ★';
      } else if (isBlunder) {
        resultText += ' ✕ FUMBLE ✕';
      }
      
      addLog(resultText, isCrit ? 'success' : isBlunder ? 'danger' : 'roll');
      setRollingStatId(null);
    }, 400);
  };

  // Handle HP change
  const handleHPChange = (delta) => {
    const newHP = Math.max(0, Math.min(character.hp_max, character.hp_current + delta));
    updateField('hp_current', newHP);
  };

  // Handle Destiny change
  const handleDestinyChange = (delta) => {
    const newDestiny = Math.max(0, character.destinyPoints + delta);
    updateField('destinyPoints', newDestiny);
  };

  // Handle Bits change
  const handleBitsChange = (delta) => {
    const newBits = Math.max(0, character.bits + delta);
    updateField('bits', newBits);
  };

  // Calculate HP percentage for bar
  const hpPercent = (character.hp_current / character.hp_max) * 100;

  return (
    <div className="space-y-2">
      {/* Character Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-orbitron font-bold text-accent-yellow text-sm truncate">
            {character.name || 'Unnamed Rebel'}
          </h3>
          <p className="text-text-secondary text-[10px] font-mono">
            {character.className || character.class} • {character.species}
          </p>
        </div>
        {onExpand && (
          <button
            onClick={onExpand}
            className="ml-2 p-1 text-accent-cyan hover:text-accent-cyan/80 hover:bg-accent-cyan/10 transition-all rounded"
            title="Expand character sheet"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* HP Tracker */}
      <div className="bg-bg-primary border border-accent-red rounded p-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-accent-red" />
            <span className="text-[10px] font-mono text-text-secondary uppercase">HP</span>
          </div>
          <div className="font-orbitron font-bold text-accent-red text-sm">
            {character.hp_current} / {character.hp_max}
          </div>
        </div>
        
        {/* HP Bar */}
        <div className="relative h-1.5 bg-bg-secondary rounded-full overflow-hidden mb-1.5">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-red to-accent-red/60 transition-all duration-300"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        
        {/* HP Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleHPChange(-1)}
            disabled={character.hp_current === 0}
            className="flex-1 px-1 py-0.5 bg-accent-red/20 border border-accent-red text-accent-red text-[10px] font-orbitron hover:bg-accent-red hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-2.5 h-2.5 mx-auto" />
          </button>
          <button
            onClick={() => handleHPChange(-5)}
            disabled={character.hp_current === 0}
            className="flex-1 px-1 py-0.5 bg-accent-red/20 border border-accent-red text-accent-red text-[10px] font-orbitron hover:bg-accent-red hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            -5
          </button>
          <button
            onClick={() => handleHPChange(5)}
            disabled={character.hp_current === character.hp_max}
            className="flex-1 px-1 py-0.5 bg-accent-cyan/20 border border-accent-cyan text-accent-cyan text-[10px] font-orbitron hover:bg-accent-cyan hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +5
          </button>
          <button
            onClick={() => handleHPChange(1)}
            disabled={character.hp_current === character.hp_max}
            className="flex-1 px-1 py-0.5 bg-accent-cyan/20 border border-accent-cyan text-accent-cyan text-[10px] font-orbitron hover:bg-accent-cyan hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-2.5 h-2.5 mx-auto" />
          </button>
        </div>
      </div>

      {/* Stats Grid - Quick Roll */}
      <div className="grid grid-cols-2 gap-1.5">
        {Object.entries(character.stats).map(([statName, value]) => (
          <button
            key={statName}
            onClick={() => handleStatRoll(statName, value)}
            disabled={rollingStatId === statName}
            className="bg-bg-primary border border-accent-cyan/30 hover:border-accent-cyan hover:shadow-[0_0_8px_rgba(0,240,255,0.3)] transition-all p-2 text-left group disabled:animate-pulse"
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-mono text-text-secondary uppercase">
                {statName}
              </span>
              <Dices className="w-2.5 h-2.5 text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className={`text-xl font-orbitron font-bold ${getStatColor(value)}`}>
              {formatModifier(value)}
            </div>
            <div className="text-[9px] text-text-secondary font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              d20{formatModifier(value)}
            </div>
          </button>
        ))}
      </div>

      {/* Destiny Points & Bits */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* Destiny Points */}
        <div className="bg-bg-primary border border-accent-yellow rounded p-2">
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-accent-yellow" />
            <span className="text-[10px] font-mono text-text-secondary uppercase">Destiny</span>
          </div>
          <div className="text-lg font-orbitron font-bold text-accent-yellow mb-1">
            {character.destinyPoints || 0}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleDestinyChange(-1)}
              disabled={!character.destinyPoints || character.destinyPoints === 0}
              className="flex-1 px-1 py-0.5 bg-accent-red/20 border border-accent-red text-accent-red text-[9px] font-orbitron hover:bg-accent-red hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              SPEND
            </button>
            <button
              onClick={() => handleDestinyChange(1)}
              className="flex-1 px-1 py-0.5 bg-accent-cyan/20 border border-accent-cyan text-accent-cyan text-[9px] font-orbitron hover:bg-accent-cyan hover:text-bg-primary transition-all"
            >
              <Plus className="w-2.5 h-2.5 mx-auto" />
            </button>
          </div>
        </div>

        {/* Bits */}
        <div className="bg-bg-primary border border-accent-cyan rounded p-2">
          <div className="flex items-center gap-1 mb-1">
            <Coins className="w-3 h-3 text-accent-cyan" />
            <span className="text-[10px] font-mono text-text-secondary uppercase">Bits ∆</span>
          </div>
          <div className="text-lg font-orbitron font-bold text-accent-cyan mb-1">
            {character.bits || 0}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleBitsChange(-1)}
              disabled={!character.bits || character.bits === 0}
              className="flex-1 px-1 py-0.5 bg-accent-red/20 border border-accent-red text-accent-red text-[9px] font-orbitron hover:bg-accent-red hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-2.5 h-2.5 mx-auto" />
            </button>
            <button
              onClick={() => handleBitsChange(1)}
              className="flex-1 px-1 py-0.5 bg-accent-cyan/20 border border-accent-cyan text-accent-cyan text-[9px] font-orbitron hover:bg-accent-cyan hover:text-bg-primary transition-all"
            >
              <Plus className="w-2.5 h-2.5 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

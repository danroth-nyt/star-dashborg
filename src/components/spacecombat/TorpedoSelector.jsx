import { useState } from 'react';
import { Zap, ChevronDown } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { TORPEDO_TYPES } from '../../data/shipShopData';
import { getAvailableTorpedoes } from '../../utils/shipUpgrades';

export default function TorpedoSelector({ onSelect, selectedType = 'standard' }) {
  const { gameState } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  
  const availableTorpedoes = getAvailableTorpedoes(gameState.ship);
  
  // Always include standard torpedoes (loaded during combat)
  const allOptions = [
    { type: 'standard', count: '∞' },
    ...availableTorpedoes.filter(t => t.type !== 'standard'),
  ];

  // If only standard torpedoes available, don't show selector
  if (allOptions.length === 1) {
    return null;
  }

  const selectedTorpedo = TORPEDO_TYPES[selectedType];

  const handleSelect = (type) => {
    onSelect(type);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Selected Torpedo Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-bg-primary border-2 border-accent-yellow/30 hover:border-accent-yellow transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent-yellow" />
          <div className="text-left">
            <p className="text-xs font-orbitron text-accent-yellow">
              {selectedTorpedo.name}
            </p>
            <p className="text-[10px] text-gray-400">
              {selectedTorpedo.damage || 'Defensive'}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-accent-yellow transition-all ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-secondary border-3 border-accent-yellow z-50 max-h-64 overflow-y-auto">
          {allOptions.map(({ type, count }) => {
            const torpedo = TORPEDO_TYPES[type];
            const isSelected = type === selectedType;
            const isStandard = type === 'standard';

            return (
              <button
                key={type}
                onClick={() => handleSelect(type)}
                className={`w-full px-3 py-2 text-left border-b border-gray-700 last:border-0 transition-all ${
                  isSelected
                    ? 'bg-accent-yellow/20 border-l-4 border-l-accent-yellow'
                    : 'hover:bg-accent-yellow/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-orbitron text-text-primary">
                    {torpedo.name}
                  </p>
                  <span className="text-xs font-orbitron text-accent-cyan flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {count}
                  </span>
                </div>
                
                <p className="text-xs text-gray-400 mb-1">
                  {torpedo.description}
                </p>
                
                <div className="flex items-center justify-between">
                  {torpedo.damage && (
                    <span className="text-xs text-accent-red font-orbitron">
                      {torpedo.damage}
                    </span>
                  )}
                  {torpedo.special && (
                    <span className="text-[10px] text-accent-yellow">
                      {torpedo.special.replace('_', ' ').toUpperCase()}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { visualOracles, rollDice } from '../../data/oracles';
import { useGame } from '../../context/GameContext';
import { useOracleHistoryContext } from '../../context/OracleHistoryContext';
import Button from '../ui/Button';

export default function VisualBoostOracle() {
  const { addLog } = useGame();
  const history = useOracleHistoryContext();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [cyclingIndex, setCyclingIndex] = useState(null);

  // Visual Oracle boost array (20 items)
  const boostIcons = visualOracles.boost;

  const handleRoll = () => {
    if (isRolling) return;

    setIsRolling(true);
    setSelectedIndex(null);

    // Roll the final result
    const finalRoll = rollDice(20);
    const finalIndex = finalRoll - 1;

    // Cycling animation - 10 cycles at 150ms each
    let cycleCount = 0;
    const totalCycles = 10;

    const cycleInterval = setInterval(() => {
      // Random icon during cycling
      const randomIndex = Math.floor(Math.random() * 20);
      setCyclingIndex(randomIndex);

      cycleCount++;

      if (cycleCount >= totalCycles) {
        clearInterval(cycleInterval);
        
        // Land on final result
        setTimeout(() => {
          setCyclingIndex(null);
          setSelectedIndex(finalIndex);
          setIsRolling(false);

          // Log result
          const result = {
            roll: finalRoll,
            result: 'Visual Oracle',
            detail: boostIcons[finalIndex]
          };

          if (history) {
            history.addResult(result);
          }

          addLog(`Visual Oracle (${finalRoll}): ${boostIcons[finalIndex]}`, 'oracle');
        }, 200);
      }
    }, 150);
  };

  return (
    <div className="space-y-4">
      {/* Icon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {boostIcons.map((label, index) => {
          const isSelected = selectedIndex === index;
          const isCycling = cyclingIndex === index;
          const isActive = isSelected || isCycling;
          const isDimmed = selectedIndex !== null && !isSelected;

          return (
            <div
              key={index}
              className={`relative border-2 p-2 sm:p-3 transition-all duration-200 ${
                isActive
                  ? 'border-accent-cyan bg-accent-cyan/10 scale-105 glow-cyan'
                  : isDimmed
                  ? 'border-gray-700 opacity-30'
                  : 'border-gray-600 hover:border-accent-cyan/50'
              }`}
            >
              {/* Number Badge */}
              <div className="absolute top-0 left-0 text-[10px] sm:text-xs text-gray-500 font-orbitron px-1">
                {index + 1}
              </div>

              {/* Icon Image */}
              <div className="flex items-center justify-center">
                <img
                  src={`/images/boost/icon_${String(index + 1).padStart(2, '0')}.png`}
                  alt={`Boost Oracle ${index + 1}`}
                  className="w-full h-auto"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>

              {/* Pulse effect on selected */}
              {isSelected && (
                <div className="absolute inset-0 border-2 border-accent-cyan animate-pulse pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Roll Button */}
      <Button
        onClick={handleRoll}
        disabled={isRolling}
        variant="primary"
        className="w-full"
      >
        {isRolling ? 'ROLLING...' : 'ROLL d20'}
      </Button>

      {/* Result Text with Typewriter Effect */}
      {selectedIndex !== null && (
        <div className="border-2 border-accent-cyan bg-bg-primary p-4 mt-4">
          <div className="text-accent-cyan font-orbitron text-sm uppercase mb-2">
            Result #{selectedIndex + 1}
          </div>
          <div className="typewriter text-accent-cyan text-base sm:text-lg">
            {boostIcons[selectedIndex]}
          </div>
        </div>
      )}
    </div>
  );
}

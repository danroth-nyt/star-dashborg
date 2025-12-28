import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AlertTriangle } from 'lucide-react';

export default function ThreatDie() {
  const { gameState, updateGameState, addLog } = useGame();
  const [isAnimating, setIsAnimating] = useState(false);

  const cycleDie = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newValue = gameState.threatDie === 6 ? 1 : gameState.threatDie + 1;
    updateGameState({ threatDie: newValue });
    addLog(`Threat Die set to ${newValue}`, 'threat');
    
    setTimeout(() => setIsAnimating(false), 400);
  };

  const isMaxThreat = gameState.threatDie === 6;

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={cycleDie}
        className={`w-32 h-32 bg-accent-red text-bg-primary font-orbitron font-black text-6xl border-3 border-accent-red hover:bg-transparent hover:text-accent-red transition-all glow-red hover:shadow-[0_0_20px_rgba(255,0,60,0.8)] active:scale-95 ${
          isAnimating ? 'threat-cycle glow-pulse-red' : ''
        } ${isMaxThreat ? 'glow-pulse-red' : ''}`}
      >
        <span className={isAnimating ? 'number-flip inline-block' : 'inline-block'}>
          {gameState.threatDie}
        </span>
      </button>
      <p className="text-accent-red text-sm font-orbitron uppercase">
        Click to Cycle
      </p>

      {/* Inline Alert for Maximum Threat */}
      {isMaxThreat && (
        <div className="w-full border-3 border-accent-red bg-accent-red/10 p-4 inline-alert-pulse">
          <div className="flex items-start gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
            <h4 className="font-orbitron font-bold text-accent-red uppercase text-sm">
              Maximum Threat
            </h4>
          </div>
          <p className="text-text-primary text-sm mb-2 pl-8">
            Choose one:
          </p>
          <ul className="space-y-1 pl-8">
            <li className="text-text-primary text-sm flex items-start gap-2">
              <span className="text-accent-red">•</span>
              <span>Advance ALL Danger Clocks by 1</span>
            </li>
            <li className="text-text-primary text-sm flex items-start gap-2">
              <span className="text-accent-red">•</span>
              <span>Completely fill ONE Danger Clock</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}


import { useState } from 'react';
import { useGame } from '../../context/GameContext';

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

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={cycleDie}
        className={`w-32 h-32 bg-accent-red text-bg-primary font-orbitron font-black text-6xl border-3 border-accent-red hover:bg-transparent hover:text-accent-red transition-all glow-red hover:shadow-[0_0_20px_rgba(255,0,60,0.8)] active:scale-95 ${
          isAnimating ? 'threat-cycle glow-pulse-red' : ''
        }`}
      >
        <span className={isAnimating ? 'number-flip inline-block' : 'inline-block'}>
          {gameState.threatDie}
        </span>
      </button>
      <p className="text-accent-red text-sm font-orbitron uppercase">
        Click to Cycle
      </p>
    </div>
  );
}


import { useGame } from '../../context/GameContext';

export default function ThreatDie() {
  const { gameState, updateGameState, addLog } = useGame();

  const cycleDie = () => {
    const newValue = gameState.threatDie === 6 ? 1 : gameState.threatDie + 1;
    updateGameState({ threatDie: newValue });
    addLog(`Threat Die set to ${newValue}`, 'threat');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={cycleDie}
        className="w-32 h-32 bg-accent-red text-bg-primary font-orbitron font-black text-6xl border-3 border-accent-red hover:bg-transparent hover:text-accent-red transition-all glow-red"
      >
        {gameState.threatDie}
      </button>
      <p className="text-accent-red text-sm font-orbitron uppercase">
        Click to Cycle
      </p>
    </div>
  );
}


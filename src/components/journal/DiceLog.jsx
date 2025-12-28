import { useGame } from '../../context/GameContext';
import { useEffect, useRef } from 'react';

export default function DiceLog() {
  const { gameState } = useGame();
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.log]);

  const getLogColor = (type) => {
    switch (type) {
      case 'threat':
        return 'text-accent-red';
      case 'danger':
        return 'text-accent-red font-bold';
      case 'success':
        return 'text-accent-cyan';
      case 'mission':
        return 'text-accent-yellow';
      case 'roll':
        return 'text-accent-cyan';
      default:
        return 'text-gray-400';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="h-full overflow-y-auto space-y-2 font-mono text-sm">
      {gameState.log.length === 0 ? (
        <p className="text-gray-500 text-center italic">No activity yet...</p>
      ) : (
        <>
          {gameState.log.slice().reverse().map((entry) => (
            <div key={entry.id} className="border-l-2 border-accent-cyan pl-2 py-1">
              <div className="flex items-baseline gap-2">
                <span className="text-accent-cyan text-xs">
                  {formatTimestamp(entry.timestamp)}
                </span>
                <span className={getLogColor(entry.type)}>
                  {entry.message}
                </span>
              </div>
            </div>
          ))}
          <div ref={logEndRef} />
        </>
      )}
    </div>
  );
}


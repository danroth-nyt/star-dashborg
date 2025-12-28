import { useGame } from '../../context/GameContext';
import { useEffect, useRef } from 'react';

// Dice icon components
const diceIcons = {
  D4: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block" fill="currentColor">
      <polygon points="12,4 20,20 4,20" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  D6: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1" />
    </svg>
  ),
  D8: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block" fill="currentColor">
      <polygon points="12,4 18,9 18,15 12,20 6,15 6,9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  D10: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block" fill="currentColor">
      <polygon points="8,12 12,4 16,12 12,20" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  D12: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block" fill="currentColor">
      <polygon points="12,3 16,6 19,10 19,14 16,18 12,21 8,18 5,14 5,10 8,6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  D20: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block" fill="currentColor">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  D100: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block" fill="currentColor">
      <rect x="5" y="8" width="14" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1" />
    </svg>
  ),
  '2D6': (
    <svg viewBox="0 0 24 24" className="w-4 h-4 inline-block" fill="currentColor">
      <rect x="4" y="4" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1" />
      <rect x="12" y="12" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" rx="1" />
    </svg>
  ),
};

export default function DiceLog() {
  const { gameState } = useGame();
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
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

  const getLogIcon = (type, message) => {
    // Extract dice type from roll messages
    if (type === 'roll' && message.includes('Rolled')) {
      const match = message.match(/Rolled (D\d+|2D6):/);
      if (match && diceIcons[match[1]]) {
        return diceIcons[match[1]];
      }
    }
    
    // Return emoji-style icons for other types
    switch (type) {
      case 'threat':
        return '⚠';
      case 'danger':
        return '☠';
      case 'success':
        return '✓';
      case 'mission':
        return '★';
      default:
        return '•';
    }
  };

  const formatRollMessage = (message) => {
    // Bold the result number in roll messages
    return message.replace(/: (\d+)/, ': <strong class="text-glow-cyan">$1</strong>');
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
    <div ref={logContainerRef} className="h-full overflow-y-auto space-y-2 font-mono text-sm">
      {gameState.log.length === 0 ? (
        <p className="text-gray-500 text-center italic">No activity yet...</p>
      ) : (
        gameState.log.slice().reverse().map((entry) => (
          <div 
            key={entry.id} 
            className="border-l-2 border-accent-cyan/50 pl-3 py-1 hover:border-accent-cyan hover:bg-bg-secondary/30 transition-all slide-up"
          >
            <div className="flex items-start gap-2">
              {/* Icon */}
              <span className={`${getLogColor(entry.type)} mt-0.5 flex-shrink-0`}>
                {getLogIcon(entry.type, entry.message)}
              </span>
              
              <div className="flex-1 min-w-0">
                {/* Timestamp */}
                <span className="text-accent-cyan/60 text-xs mr-2">
                  {formatTimestamp(entry.timestamp)}
                </span>
                
                {/* Message */}
                <span 
                  className={getLogColor(entry.type)}
                  dangerouslySetInnerHTML={{ 
                    __html: entry.type === 'roll' ? formatRollMessage(entry.message) : entry.message 
                  }}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


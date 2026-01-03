import { useGame } from '../../context/GameContext';
import { useEffect, useRef, useState } from 'react';

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
  const containerRef = useRef(null);
  const [latestLogId, setLatestLogId] = useState(null);

  // Auto-scroll to bottom when new log entries are added
  useEffect(() => {
    if (containerRef.current && gameState.log.length > 0) {
      // Find the scrollable parent (Panel's content div)
      const scrollableParent = containerRef.current.parentElement;
      if (scrollableParent) {
        scrollableParent.scrollTop = scrollableParent.scrollHeight;
      }
    }
  }, [gameState.log.length]);

  // Track latest entry for animation
  useEffect(() => {
    if (gameState.log.length > 0) {
      const latest = gameState.log[gameState.log.length - 1];
      if (latest.id !== latestLogId) {
        setLatestLogId(latest.id);
      }
    }
  }, [gameState.log, latestLogId]);

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
      case 'oracle':
        return 'text-accent-yellow';
      default:
        return 'text-gray-400';
    }
  };

  const getLogIcon = (type, message) => {
    // Extract dice type from roll messages
    if (type === 'roll' && message.includes('Rolled')) {
      const match = message.match(/Rolled (D\d+|2D6)/);
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
      case 'oracle':
        return '◈';
      default:
        return '•';
    }
  };

  const formatRollMessage = (message) => {
    // Check if it's an advantage/disadvantage roll
    if (message.includes('(ADV)') || message.includes('(DIS)')) {
      // Format: "Rolled D20 (ADV): [18, 12] = 18"
      // Highlight the mode label
      const withMode = message.replace(
        /\((ADV|DIS)\)/,
        '<span class="text-accent-yellow">($1)</span>'
      );
      // Highlight the final result after the equals sign
      return withMode.replace(
        /= (\d+)$/,
        '= <strong class="text-glow-cyan">$1</strong>'
      );
    }
    // Normal roll - bold the result number
    return message.replace(/: (\d+)$/, ': <strong class="text-glow-cyan">$1</strong>');
  };

  const formatOracleMessage = (message) => {
    // Split on pipe separator for structured oracle results
    if (message.includes(' | ')) {
      const parts = message.split(' | ');
      const formatted = parts.map((part, idx) => {
        if (idx === 0) {
          // First part includes the title - keep it normal
          return part;
        }
        // Highlight subsequent parts
        return `<span class="text-accent-cyan">${part}</span>`;
      }).join(' <span class="text-accent-yellow/40">|</span> ');
      return formatted;
    }
    
    // Highlight values after colons
    return message.replace(/: ([^:]+)$/, ': <span class="text-accent-cyan">$1</span>');
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
    <div ref={containerRef} className="space-y-2 font-mono text-sm">
      {gameState.log.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-accent-cyan/20 text-3xl font-mono">
              [ ]<br />
              {'>'}_
            </div>
            <p className="text-gray-500 font-orbitron text-sm">SHIP LOG EMPTY</p>
            <p className="text-gray-600 text-xs">Activity will appear here</p>
          </div>
        </div>
      ) : (
        gameState.log.slice().reverse().map((entry, index) => {
          const isLatest = entry.id === latestLogId && index === 0;
          const prevEntry = index < gameState.log.length - 1 ? gameState.log.slice().reverse()[index + 1] : null;
          const isSameTypeAsPrev = prevEntry && prevEntry.type === entry.type;

          return (
            <div 
              key={entry.id} 
              className={`border-l-2 pl-3 py-1 hover:border-accent-cyan hover:bg-bg-secondary/30 transition-all duration-200 ${
                isLatest ? 'log-entry-slide new-entry-pulse' : 'slide-up'
              } ${
                isSameTypeAsPrev ? 'border-accent-cyan/30' : 'border-accent-cyan/50 mt-1'
              }`}
            >
              <div className="flex items-start gap-2">
                {/* Icon */}
                <span className={`${getLogColor(entry.type)} mt-0.5 flex-shrink-0`}>
                  {getLogIcon(entry.type, entry.message)}
                </span>
                
                <div className="flex-1 min-w-0">
                  {/* Timestamp - color coded by type */}
                  <span className={`text-xs mr-2 ${
                    entry.type === 'threat' ? 'text-accent-red/60' :
                    entry.type === 'danger' ? 'text-accent-red/60' :
                    entry.type === 'success' ? 'text-accent-cyan/60' :
                    entry.type === 'mission' ? 'text-accent-yellow/60' :
                    entry.type === 'oracle' ? 'text-accent-yellow/60' :
                    'text-accent-cyan/60'
                  }`}>
                    {formatTimestamp(entry.timestamp)}
                  </span>
                  
                  {/* Message */}
                  <span 
                    className={getLogColor(entry.type)}
                    dangerouslySetInnerHTML={{ 
                      __html: entry.type === 'roll' ? formatRollMessage(entry.message) : 
                             entry.type === 'oracle' ? formatOracleMessage(entry.message) :
                             entry.message 
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

